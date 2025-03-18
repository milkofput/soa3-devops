import { Sprint } from '../../issuemanagement/models/Sprint';
import { User } from './User';

export class Project {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly sprints: Sprint[] = [],
        //private readonly backlog: ProductBacklog,
        private readonly members: User[] = [],
        //private readonly scmReposity: SCMRepository,
        //private readonly pipelines: Pipeline[],
    ) {}

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getSprints(): Sprint[] {
        return this.sprints;
    }

    getMembers(): User[] {
        return this.members;
    }

    addSprint(sprint: Sprint): void {
        this.sprints.push(sprint);
    }

    addMembers(...members: User[]): void {
        this.members.push(...members);
    }
}
