import { User } from '../../common/models/User';
import { IObserver } from '../../notifications/interfaces/IObserver';
import { ISubject } from '../../notifications/interfaces/ISubject';
import { BacklogItem } from './BacklogItem';
import { ReviewDocument } from './ReviewDocument';
import { ISprintState } from '../interfaces/ISprintState';
import { CreatedSprintState } from './sprintstates/CreatedSprintState';
import { ISprintStrategy } from '../interfaces/ISprintStrategy';

export class Sprint implements ISubject<Sprint> {
    private reviewDocument?: ReviewDocument;
    private readonly observers: IObserver<Sprint>[] = [];
    private statusMessage: string = "";
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly startDate: Date,
        private readonly endDate: Date,
        private readonly scrumMaster: User,
        private readonly strategy: ISprintStrategy,
        private state: ISprintState = new CreatedSprintState(this),
        //private readonly releasePipeline: Pipeline,
        private backlogItems: BacklogItem[] = [],
    ) { }

    addObserver(observer: IObserver<Sprint>): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }
    removeObserver(observer: IObserver<Sprint>): void {
        if (this.observers.includes(observer)) {
            this.observers.splice(this.observers.indexOf(observer), 1);
        }
    }
    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    addBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlogItems.push(...backlogItems);
        this.notifyObservers();
    }

    removeBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlogItems = this.backlogItems.filter(
            (item) => !backlogItems.some((backlogItem) => backlogItem.getId() === item.getId()),
        );
        // this.notifyObservers();
    }

    addReviewDocument(reviewDocument: ReviewDocument): void {
        this.reviewDocument = reviewDocument;
    }

    // generateReport(): void {
    //     // generate report
    // }

    public create(): void {
        this.state.create();
    }

    public start(): void {
        this.state.start();
    }

    public finish(): void {
        this.state.finish();
    }

    public finalize(): void {
        this.state.finalize();
    }

    public cancel(): void {
        this.state.cancel();
    }

    public setState(state: ISprintState): void {
        this.state = state;
    }

    // getters
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

    getStrategy(): ISprintStrategy {
        return this.strategy;
    }

    getState(): ISprintState {
        return this.state;
    }

    // getReleasePipeline(): any {
    //     //return this.releasePipeline;
    // }

    getBacklogItems(): BacklogItem[] {
        return this.backlogItems;
    }

    getDocument(): ReviewDocument | undefined {
        return this.reviewDocument;
    }
}
