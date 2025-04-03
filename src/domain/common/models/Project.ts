import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { Sprint } from '../../issuemanagement/models/Sprint';
import { ProductBacklog } from './ProductBacklog';
import { User } from './User';

export class Project {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly backlog: ProductBacklog,
        private readonly productOwner: User,
        private readonly description: string = '',
        private readonly sprints: Sprint[] = [],
        private readonly members: User[] = [],
        //private readonly scmReposity: SCMRepository,
        //private readonly pipelines: Pipeline[],
    ) {}

    addMembers(...members: User[]): void {
        this.members.push(...members);
    }

    addSprint(sprint: Sprint): void {
        this.sprints.push(sprint);
    }

    addBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlog.addBacklogItems(...backlogItems);
    }

    removeBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlog.removeBacklogItems(...backlogItems);
    }

    // gettters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getSprints(): Sprint[] {
        return this.sprints;
    }

    getMembers(): User[] {
        return this.members;
    }

    getProductOwner(): User {
        return this.productOwner;
    }
}
