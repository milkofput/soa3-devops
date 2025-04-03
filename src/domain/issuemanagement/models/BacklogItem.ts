import { Project } from '../../common/models/Project';
import { User } from '../../common/models/User';
import { IEvent } from '../../notifications/interfaces/IEvent';
import { IObserver } from '../../notifications/interfaces/IObserver';
import { ISubject } from '../../notifications/interfaces/ISubject';
import { BacklogStatusChangedEvent } from '../../notifications/models/events/BacklogStatusChangedEvent';
import { IBacklogItemState } from '../interfaces/IBacklogItemState';
import { Activity } from './Activity';
import { TodoState } from './backlogitemstates/TodoState';
import { Discussion } from './Discussion';
import { Sprint } from './Sprint';

export class BacklogItem implements ISubject<BacklogItem> {
    private readonly observers: IObserver<BacklogItem>[] = [];
    private assignee?: User;
    private sprint?: Sprint;
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly description: string = '',
        private readonly storyPoints: number = 0,
        private readonly project: Project,
        private readonly activities: Activity[] = [],
        private readonly discussions: Discussion[] = [],
        private state: IBacklogItemState = new TodoState(this),
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
    notifyObservers(e?: IEvent): void {
        for (const observer of this.observers) {
            observer.update(this, e);
        }
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
    }

    public moveToBacklog(): void {
        this.state.moveToBacklog();
    }

    public startDevelopment(): void {
        this.state.startDevelopment();
    }

    public markReadyForTesting(): void {
        this.state.markReadyForTesting();
    }

    public beginTesting(): void {
        this.state.beginTesting();
    }

    public completeTesting(): void {
        this.state.completeTesting();
    }

    public markAsDone(): void {
        this.state.markAsDone();
    }

    public changeState(state: IBacklogItemState): void {
        this.state = state;
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

    getAssignee(): User | undefined {
        return this.assignee;
    }

    getActivities(): Activity[] {
        return this.activities;
    }

    getDiscussions(): Discussion[] {
        return this.discussions;
    }

    getState(): IBacklogItemState {
        return this.state;
    }

    setSprint(sprint: Sprint): void {
        this.sprint = sprint;
    }
}
