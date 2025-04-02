import { SprintReportTemplate } from './SprintReportTemplate';

export class EffortReport extends SprintReportTemplate {
    protected body(): string {
        return `📊 Effort Report for ${this.sprint.getName()}`;
    }
}
