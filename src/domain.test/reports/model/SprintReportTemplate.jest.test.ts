import { Sprint } from '../../../domain/issuemanagement/models/Sprint';
import { IExportStrategy } from '../../../domain/reports/interfaces/IExportStrategy';
import { BurndownChartReport } from '../../../domain/reports/models/BurndownChartReport';
import { EffortReport } from '../../../domain/reports/models/EffortReport';
import { PDFExportStrategy } from '../../../domain/reports/models/PDFExportStrategy';
import { PNGExportStrategy } from '../../../domain/reports/models/PNGExportStrategy';
import { SprintReportTemplate } from '../../../domain/reports/models/SprintReportTemplate';
import { TeamCompositionReport } from '../../../domain/reports/models/TeamCompositionReport';

class MockExportStrategy implements IExportStrategy {
    public exportedData: string = '';
    exportData(data: string): void {
        this.exportedData = data;
    }
}

class TestSprintReport extends SprintReportTemplate {
    protected body(): string {
        return 'Test Report Body';
    }
}

describe('UT-F9-3: Export formats', () => {
    let mockSprint: jest.Mocked<Sprint>;

    beforeEach(() => {
        mockSprint = {
            getName: jest.fn().mockReturnValue('Test Sprint'),
            getStartDate: jest.fn().mockReturnValue(new Date('2024-01-01')),
            getEndDate: jest.fn().mockReturnValue(new Date('2024-01-14')),
        } as unknown as jest.Mocked<Sprint>;
    });

    class TestReport extends SprintReportTemplate {
        protected body(): string {
            return 'Test Report Content';
        }
    }

    it('should export report as PDF', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const pdfStrategy = new PDFExportStrategy();
        const report = new TestReport(mockSprint, pdfStrategy);

        report.generateReport(true);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('📄 Exporting data to PDF:'),
        );
        consoleSpy.mockRestore();
    });

    it('should export report as PNG', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const pngStrategy = new PNGExportStrategy();
        const report = new TestReport(mockSprint, pngStrategy);

        report.generateReport(true);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('📄 Exporting data to PNG:'),
        );
        consoleSpy.mockRestore();
    });

    it('should contain same content in both formats', () => {
        const pdfStrategy = new PDFExportStrategy();
        const pngStrategy = new PNGExportStrategy();
        const pdfReport = new TestReport(mockSprint, pdfStrategy);
        const pngReport = new TestReport(mockSprint, pngStrategy);

        const consoleSpy = jest.spyOn(console, 'log');

        pdfReport.generateReport(true);
        const pdfOutput = consoleSpy.mock.calls[0][0];

        pngReport.generateReport(true);
        const pngOutput = consoleSpy.mock.calls[1][0];

        // Remove format-specific parts and compare content
        const pdfContent = pdfOutput.replace('📄 Exporting data to PDF:', '');
        const pngContent = pngOutput.replace('📄 Exporting data to PNG:', '');

        expect(pdfContent).toBe(pngContent);

        consoleSpy.mockRestore();
    });
});

describe('UT-F9-1: Can generate report for team composition, burndown chart, and effort points', () => {
    let mockSprint: jest.Mocked<Sprint>;
    let mockExportStrategy: MockExportStrategy;

    beforeEach(() => {
        mockSprint = {
            getName: jest.fn().mockReturnValue('Test Sprint'),
            getStartDate: jest.fn().mockReturnValue(new Date('2024-01-01')),
            getEndDate: jest.fn().mockReturnValue(new Date('2024-01-14')),
            getTeamMembers: jest
                .fn()
                .mockReturnValue([
                    { getName: () => 'Developer 1' },
                    { getName: () => 'Developer 2' },
                ]),
        } as unknown as jest.Mocked<Sprint>;

        mockExportStrategy = new MockExportStrategy();
    });

    it('should generate team composition report', () => {
        const teamReport = new TeamCompositionReport(mockSprint, mockExportStrategy);
        teamReport.generateReport(true);

        expect(mockExportStrategy.exportedData).toContain('👥 In sprint Test Sprint');
        expect(mockExportStrategy.exportedData).toContain('Developer 1');
        expect(mockExportStrategy.exportedData).toContain('Developer 2');
    });

    it('should generate burndown chart report', () => {
        const burndownReport = new BurndownChartReport(mockSprint, mockExportStrategy);
        burndownReport.generateReport(true);

        expect(mockExportStrategy.exportedData).toContain(
            '📊 Burndown Chart Report for Test Sprint',
        );
    });

    it('should generate effort points report', () => {
        const effortReport = new EffortReport(mockSprint, mockExportStrategy);
        effortReport.generateReport(true);

        expect(mockExportStrategy.exportedData).toContain('📊 Effort Report for Test Sprint');
    });
});

describe('SprintReportTemplate', () => {
    let mockSprint: jest.Mocked<Sprint>;
    let mockExportStrategy: MockExportStrategy;
    let sprintReport: TestSprintReport;

    beforeEach(() => {
        mockSprint = {
            getName: jest.fn().mockReturnValue('Test Sprint'),
            getStartDate: jest.fn().mockReturnValue(new Date('2024-01-01')),
            getEndDate: jest.fn().mockReturnValue(new Date('2024-01-14')),
        } as unknown as jest.Mocked<Sprint>;

        mockExportStrategy = new MockExportStrategy();
        sprintReport = new TestSprintReport(mockSprint, mockExportStrategy);
    });

    it('should generate report without header and footer by default', () => {
        sprintReport.generateReport();

        expect(mockExportStrategy.exportedData).toBe('Test Report Body\n');
    });

    it('(UT-F9-2) should generate report with header and footer when specified', () => {
        sprintReport.generateReport(true);

        const exportedData = mockExportStrategy.exportedData;

        expect(exportedData).toContain('=== Sprint Report for Test Sprint -');

        expect(exportedData).toContain('Test Report Body');

        expect(exportedData).toContain('=== End of Report ===');
    });

    it('should call sprint methods to get report data', () => {
        sprintReport.generateReport(true);

        expect(mockSprint.getName).toHaveBeenCalled();
        expect(mockSprint.getStartDate).toHaveBeenCalled();
        expect(mockSprint.getEndDate).toHaveBeenCalled();
    });
});
