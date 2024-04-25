import DTO from "core/domain/types/DTO";
import { InstallationType } from "@utils/enum";


export abstract class SystemAdapter {
    abstract addNewLib(installationType: InstallationType,parthOrNameLib: string): Promise<boolean>;
    abstract addImportStandardInCode(code: string): string;
    abstract addServerCode(): string;
    abstract createSketch(nameSketch: string): Promise<boolean>;
    abstract writeSketchFile(pathSketch: string): Promise<boolean>;
    abstract compileSketch(pathSketch: string, pathSaveBin: string): Promise<boolean>;
}