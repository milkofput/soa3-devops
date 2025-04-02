import { SprintReportTemplate } from './SprintReportTemplate';

export class TeamCompositionReport extends SprintReportTemplate {
    protected body(): string {
        const teamMembers = this.sprint.getTeamMembers() || [];
        const membersList = teamMembers.length
            ? teamMembers.map((member) => `- ${member.getName()}`).join('\n')
            : 'No team members available.';

        return `\n👥 In sprint ${this.sprint.getName()}, the team composition is:\n${membersList}\n`;
    }
}
