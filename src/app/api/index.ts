import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import 'module-alias/register';

const app = express();
import { loadRoutes } from '@api/index';
import APIDIContainer from '@dicontainer/api';
import DatabaseConnection from '@postgres/postgresRepository';
import { InstallationType } from '@utils/enum';
import { ConsumeMessage } from 'amqplib';

dotenv.config();
app.use(express.static('public'));
app.use(cors({
    origin:['http://localhost:3000']
}))

app.use(express.json())
app.use("/api", loadRoutes());


app.listen(3001,() => {
    console.log("API is running on port 3001!");
})

const dicontainer = new APIDIContainer();
const rabbitMQService = dicontainer.getRabbitMQService();
const systemService = dicontainer.getSystemService();
const dbConnection = new DatabaseConnection();
enum Status {
    BUILD = 'BUILD',
    ERROR = 'ERROR',
    FINISH = 'FINISH'
  }

const processMessage = async (msg: ConsumeMessage | null) => {
    if (!msg) {
        return;
    }
    const DTO = JSON.parse(msg.content.toString());
    try {

        console.log(`[x] Recebido ${msg.content.toString()}`);
        // Conecta ao banco de dados
        await dbConnection.connect();

        const firmware = await getFirmware(DTO['firmware_id'], DTO['user_id']);
        await setupEnvironment();
        
        const sketchPath = `${process.cwd()}/public/sketchs/${firmware.name}-${firmware.version}`;
        
        await generateSketch(firmware, sketchPath);
        const url_path = await compileAndSaveSketch(firmware, sketchPath);
        await updateBuildStatus(DTO['firmware_id'], DTO['user_id'],url_path);
        await updateWebhookStatus(DTO['firmware_id'],Status.FINISH)
        rabbitMQService.ackMessage(msg, false);
    } catch (error) {
        console.error('Erro:', error);
        await updateWebhookStatus(DTO['firmware_id'],Status.ERROR,)
    } 
};

const getFirmware = async (firmwareId: string, userId: string) => {
    const selectQuery = `
        SELECT * FROM "Firmware"
        WHERE "id" = $1 AND "authorId" = $2;
    `;
    const client = dbConnection.getPool();
    try {
        await client.connect()
        const firmwareResult = await client.query(selectQuery, [firmwareId, userId]);
        return firmwareResult.rows[0];
    } catch (erro) {
        console.error(erro);
    } 
};

const setupEnvironment = async () => {
    await Promise.all([
        systemService.addNewLib(InstallationType.zipPath, `${process.cwd()}/resource/lib/ESP8266APIServer.zip`),
        systemService.addNewLib(InstallationType.install, "ArduinoJson"),
    ]);
};

const generateSketch = async (firmware: any, sketchPath: string) => {
    systemService.addImportStandardInCode(firmware.code);
    systemService.addServerCode();
    await systemService.createSketch(sketchPath);
    await systemService.writeSketchFile(`${sketchPath}/${firmware.name}-${firmware.version}.ino`);
};

const compileAndSaveSketch = async (firmware: any, sketchPath: string) => {
    const result = await systemService.compileSketch(
        `${sketchPath}/${firmware.name}-${firmware.version}.ino`,
        `${process.cwd()}/public/bins/${firmware.name}-${firmware.version}`
    );

    if ( result){
        return `bins/${firmware.name}-${firmware.version}/${firmware.name}-${firmware.version}.ino.bin`
    }

    return ''
};

const updateBuildStatus = async (firmwareId: string, userId: string,url_path: string) => {
    const updateQuery = `
        UPDATE "Firmware"
        SET "finish_build" = $1,
            "is_to_update" = $2,
            "link_bin" = $3
        WHERE "id" = $4 AND "authorId" = $5
        RETURNING *;
    `;

    const updateQueryToUpdate = `
        UPDATE "Firmware"
        SET 
            "is_to_update" = $1
        WHERE "authorId" = $2
        RETURNING *;
    `;
    
    const client = dbConnection.getPool();
    try {
        await client.query(updateQueryToUpdate, [false, userId]);
        await client.query(updateQuery, [true, true, `${process.env.BIN_SERVER}${url_path}` ,firmwareId, userId]);
    } catch (erro) {
        console.error(erro);
    }
};

const updateWebhookStatus = async (firmwareId: string, status:Status) => {
    const updateQuery = `
        UPDATE "WebHook"
        SET "status" = $1
        WHERE "firmware_id" = $2
        RETURNING *;
    `;
    const client = dbConnection.getPool();
    try {
        await client.query(updateQuery, [status,firmwareId]);
    } catch (erro) {
        console.error(erro);
    }
};

rabbitMQService.consume('build', processMessage);