import { IExportStrategy } from '../interfaces/IExportStrategy';

export class PDFExportStrategy implements IExportStrategy {
    public exportData(data: string): void {
        console.log(`📄 Exporting data to PDF: ${data}`);
    }
}
