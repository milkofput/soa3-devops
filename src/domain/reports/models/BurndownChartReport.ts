import { SprintReportTemplate } from './SprintReportTemplate';

export class BurndownChartReport extends SprintReportTemplate {
    protected body(): string {
        return `📊 Burndown Chart Report for ${this.sprint.getName()}`;
    }
}
