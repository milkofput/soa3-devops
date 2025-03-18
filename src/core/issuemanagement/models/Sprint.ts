import { User } from '../../common/models/User';
import { BacklogItem } from './BacklogItem';

export class Sprint {
    //private readonly reviewDocument?: ReviewDocument;
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly startDate: Date,
        private readonly endDate: Date,
        //private readonly state: SprintState,
        private readonly scrumMaster: User,
        //private readonly releasePipeline: Pipeline,
        private readonly backlogItems: BacklogItem[] = [],
    ) {}

    addBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlogItems.push(...backlogItems);
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getScrumMaster(): User {
        return this.scrumMaster;
    }

    getBacklogItems(): BacklogItem[] {
        return this.backlogItems;
    }
}
