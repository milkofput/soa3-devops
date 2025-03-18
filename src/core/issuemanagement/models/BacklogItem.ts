import { User } from '../../common/models/User';
import { BacklogItemStatusEnum } from '../enums/BacklogItemStatusEnum';
import { Activity } from './Activity';
import { Discussion } from './Discussion';

export class BacklogItem {
    private assignee?: User;
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly description: string,
        private readonly storyPoints: number,
        private readonly status: BacklogItemStatusEnum,
        private readonly activities: Activity[] = [],
        private readonly discussions: Discussion[] = [],
        //private readonly relatedBranch: Branch[] = [],
    ) {}

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getStoryPoints(): number {
        return this.storyPoints;
    }

    getStatus(): BacklogItemStatusEnum {
        return this.status;
    }

    getAssignee(): User | undefined {
        return this.assignee;
    }

    getActivities(): Activity[] {
        return this.activities;
    }

    getDiscussions(): Discussion[] {
        return this.discussions;
    }

    assignTo(user: User): BacklogItem {
        this.assignee = user;
        return this;
    }
}
