import { Project } from '../../common/models/Project';
import { User } from '../../common/models/User';
import { IEvent } from '../../notifications/interfaces/IEvent';
import { IObserver } from '../../notifications/interfaces/IObserver';
import { ISubject } from '../../notifications/interfaces/ISubject';
import { BacklogStatusChangedEvent } from '../../notifications/models/events/BacklogStatusChangedEvent';
import { BacklogItemStatusEnum } from '../enums/BacklogItemStatusEnum';
import { Activity } from './Activity';
import { Discussion } from './Discussion';
import { Sprint } from './Sprint';

export class BacklogItem implements ISubject<BacklogItem> {
    private readonly observers: IObserver<BacklogItem>[] = [];
    private assignee?: User;
    private status: BacklogItemStatusEnum = BacklogItemStatusEnum.TODO;
    private sprint?: Sprint;
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly description: string = '',
        private readonly storyPoints: number = 0,
        private readonly project: Project,
        private readonly activities: Activity[] = [],
        private readonly discussions: Discussion[] = [],
        //private readonly relatedBranches: Branch[] = [],
    ) { }

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
    notifyObservers(e?: IEvent): void {
        for (const observer of this.observers) {
            observer.update(this, e);
        }
    }

    setStatus(status: BacklogItemStatusEnum): void {
        const oldStatus = this.status;
        this.status = status;
        this.notifyObservers(new BacklogStatusChangedEvent(this, oldStatus, this.status));
    }

    assignTo(user: User): this {
        this.assignee = user;
        return this;
    }

    addActivity(activity: Activity): void {
        this.activities.push(activity);
    }

    addDiscussion(discussion: Discussion): void {
        this.discussions.push(discussion);
        // this.notifyObservers();
    }

    // linkBranch(branch: string): BacklogItem {
    //     //this.relatedBranches.push(branch);
    //     return this;
    // }

    isInProgress(): void {
        this.status === BacklogItemStatusEnum.DOING;
    }

    isReady(): void {
        this.status === BacklogItemStatusEnum.READY_FOR_TESTING;
    }

    isInTesting(): void {
        this.status === BacklogItemStatusEnum.TESTING;
    }

    isTested(): void {
        this.status === BacklogItemStatusEnum.TESTED;
    }

    isDone(): void {
        this.status === BacklogItemStatusEnum.DONE;
    }

    // getters
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

    getProject(): Project {
        return this.project;
    }

    getSprint(): Sprint | undefined {
        return this.sprint;
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

    setSprint(sprint: Sprint): void {
        this.sprint = sprint;
    }
}
