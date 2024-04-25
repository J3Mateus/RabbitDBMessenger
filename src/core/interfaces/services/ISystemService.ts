import { SystemAdapter } from "@adapter/SystemAdapter";
import { InstallationType } from "@utils/enum";



export abstract class ISystemService {
    constructor(protected readonly adapter: SystemAdapter){}
    abstract addNewLib(installationType: InstallationType,parthOrNameLib: string): Promise<boolean>;
    abstract addImportStandardInCode(code: string): string;
    abstract addServerCode(): string;
    abstract createSketch(nameSketch: string): Promise<boolean>;
    abstract writeSketchFile(pathSketch: string): Promise<boolean>;
    abstract compileSketch(pathSketch: string, pathSaveBin: string): Promise<boolean>;
}