import { User } from '../../common/models/User';
import { IObserver } from '../../notifications/interfaces/IObserver';
import { ISubject } from '../../notifications/interfaces/ISubject';
import { BacklogItemStatusEnum } from '../enums/BacklogItemStatusEnum';
import { Activity } from './Activity';
import { Discussion } from './Discussion';

export class BacklogItem implements ISubject<BacklogItem> {
    private readonly observers: IObserver<BacklogItem>[] = [];
    private assignee?: User;
    private status: BacklogItemStatusEnum = BacklogItemStatusEnum.TODO;
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly description: string,
        private readonly storyPoints: number,
        private readonly activities: Activity[] = [],
        private readonly discussions: Discussion[] = [],
        //private readonly relatedBranch: Branch[] = [],
    ) {}

    addObserver(observer: IObserver<BacklogItem>): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }
    removeObserver(observer: IObserver<BacklogItem>): void {
        if (this.observers.includes(observer)) {
            this.observers.splice(this.observers.indexOf(observer), 1);
        }
    }
    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

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

    setStatus(status: BacklogItemStatusEnum): BacklogItem {
        this.status = status;
        this.notifyObservers();
        return this;
    }

    assignTo(user: User): BacklogItem {
        this.assignee = user;
        return this;
    }
}
