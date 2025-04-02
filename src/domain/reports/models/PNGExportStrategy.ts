import { IExportStrategy } from '../interfaces/IExportStrategy';

export class PNGExportStrategy implements IExportStrategy {
    public exportData(data: string): void {
        console.log(`📄 Exporting data to PNG: ${data}`);
    }
}
