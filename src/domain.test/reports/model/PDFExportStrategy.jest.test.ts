import { Sprint } from '../../../domain/issuemanagement/models/Sprint';
import { IExportStrategy } from '../../../domain/reports/interfaces/IExportStrategy';
import { SprintReportTemplate } from '../../../domain/reports/models/SprintReportTemplate';

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

    it('should generate report with header and footer when specified', () => {
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
