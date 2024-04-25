import { ISystemService } from "@iservice/ISystemService";
import { InstallationType } from "@utils/enum";


export class SystemService extends ISystemService {
    async addNewLib(installationType: InstallationType, parthOrNameLib: string): Promise<boolean> {
        try {
            const result = await this.adapter.addNewLib(installationType, parthOrNameLib);
            if (result) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            return false;
        }
    }
    addImportStandardInCode(code: string): string {
        return this.adapter.addImportStandardInCode(code);
    }
    addServerCode(): string {
        return this.adapter.addServerCode()
    }

    async createSketch(nameSketch: string): Promise<boolean> {
        try {
            await this.adapter.createSketch(nameSketch);
            return true;
        } catch (error: any) {
            return false;
        }
    }

    async writeSketchFile(pathSketch: string): Promise<boolean> {
        try {
            await this.adapter.writeSketchFile(pathSketch);
            return true;
        } catch (error: any) {
            return false;
        }
    }
    async compileSketch(pathSketch: string,pathSaveBin: string,): Promise<boolean> {
        try {
            await this.adapter.compileSketch(pathSketch,pathSaveBin);
            return true;
        } catch (error: any) {
            return false;
        }
    }

}