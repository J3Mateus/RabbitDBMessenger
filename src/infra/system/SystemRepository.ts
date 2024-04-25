import { SystemAdapter } from '@adapter/SystemAdapter'
import { InstallationType } from '@utils/enum';
import { exec } from 'child_process';
import { writeFile } from 'fs'
import DTO from 'core/domain/types/DTO';

export class SystemRepository implements SystemAdapter {
    private code!: string;

    static SetupCodeObj (json: DTO): SystemRepository {
        const obj = new SystemRepository();
        obj.code = String(json['code']);

        return obj
    }

    addNewLib(installationType: InstallationType, parthOrNameLib: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const command = `arduino-cli lib ${installationType} ${parthOrNameLib}`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao adicionar a biblioteca: ${error.message}`);
                    reject(false);
                } else if (stderr) {
                    console.error(`Erro: ${stderr}`);
                    reject(false);
                } else {
                    console.log(`Biblioteca adicionada com sucesso: ${stdout}`);
                    resolve(true);
                }
            });
        });
    }

    addImportStandardInCode(code: string): string {
        const dynamicImports = '#include <ESP8266WiFi.h>\n#include <ESP8266APIServer.h>\nconst int serverPort = 80;\nESP8266WiFiClass wifi;\nESP8266APIServer apiServer(serverPort, wifi);';

        this.code = `${dynamicImports}\n${code}`;
        return `${dynamicImports}\n${code}`;
    }

    addServerCode(): string {
        const setupRegex = /void\s+setup\s*\(\s*\)\s*\{/;
        const loopRegex = /void\s+loop\s*\(\s*\)\s*\{/;

        const setupMatch = this.code.match(setupRegex);
        const loopMatch = this.code.match(loopRegex);

        if (setupMatch && loopMatch) {
            const setupIndex = setupMatch.index ? setupMatch.index + setupMatch[0].length : 0;
            const loopIndex = loopMatch.index ? loopMatch.index + loopMatch[0].length : 0;

            const setupLine = `\n  apiServer.begin();`;
            const loopLine  = `\n  apiServer.handleClient();`;
            this.code = this.code.slice(0, setupIndex) + setupLine + this.code.slice(setupIndex, loopIndex) + loopLine + this.code.slice(loopIndex);
            return this.code.slice(0, setupIndex) + setupLine + this.code.slice(setupIndex, loopIndex) + loopLine + this.code.slice(loopIndex);
        } else {
            console.error('Erro ao adicionar código do servidor.');
            return this.code;
        }
    }

    createSketch(nameSketch: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            exec(`arduino-cli sketch new ${nameSketch} -f`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Erro ao compilar o sketch:', error);
                    reject(false);
                } else {
                    console.log('Sketch criado com sucesso:', stdout);
                    resolve(true);
                }
            });
        });
    }

    writeSketchFile(pathSketch: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            writeFile(pathSketch, this.code, (err) => {
                if (err) {
                    console.error('Erro ao escrever o arquivo do sketch:', err);
                    reject(false);
                } else {
                    console.log('Arquivo do sketch criado com sucesso:', pathSketch);
                    resolve(true);
                }
            });
        });
    }

    compileSketch(pathSketch: string,pathSaveBin: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            exec(`arduino-cli compile --output-dir ${pathSaveBin} -e --fqbn esp8266:esp8266:d1_mini ${pathSketch}`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Erro ao compilar o sketch:', error);
                    reject(error);
                } else {
                    console.log(stdout);
                    console.error(stderr);
                    resolve(true);
                }
            });
        });
    }

}