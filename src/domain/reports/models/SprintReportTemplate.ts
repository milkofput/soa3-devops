import { Sprint } from '../../issuemanagement/models/Sprint';
import { IExportStrategy } from '../interfaces/IExportStrategy';

export abstract class SprintReportTemplate {
    constructor(
        protected readonly sprint: Sprint,
        protected readonly exportStrategy: IExportStrategy,
    ) {}

    protected header(): string {
        return `=== Sprint Report for ${this.sprint.getName()} - ${this.sprint.getStartDate().toLocaleDateString()} to ${this.sprint.getEndDate().toLocaleDateString()} ===`;
    }

    protected footer(): string {
        return `=== End of Report ===`;
    }

    protected abstract body(): string;

    public generateReport(withHeaderAndFooter = false): void {
        let result = '';
        if (withHeaderAndFooter) {
            result += this.header();
            result += '\n';
        }

        result += this.body();
        result += '\n';

        if (withHeaderAndFooter) {
            result += this.footer();
        }
        this.exportStrategy.exportData(result);
    }
}
