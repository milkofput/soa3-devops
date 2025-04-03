import { User } from '../../common/models/User';
import { IObserver } from '../../notifications/interfaces/IObserver';
import { ISubject } from '../../notifications/interfaces/ISubject';
import { BacklogItem } from './BacklogItem';
import { ReviewDocument } from './ReviewDocument';
import { ISprintState } from '../interfaces/ISprintState';
import { CreatedSprintState } from './sprintstates/CreatedSprintState';
import { ISprintStrategy } from '../interfaces/ISprintStrategy';
import { Pipeline } from '../../cicd/models/Pipeline';
import { ExecutionVisitor } from '../../cicd/models/ExecutionVisitor';
import { IPipelineVisitor } from '../../cicd/interfaces/IPipelineVisitor';
import { IEvent } from '../../notifications/interfaces/IEvent';
import { PipelineOutcomeEvent } from '../../notifications/models/events/PipelineOutcomeEvent';
import { SprintReportTemplate } from '../../reports/models/SprintReportTemplate';

export class Sprint implements ISubject<Sprint> {
    private reviewDocument?: ReviewDocument;
    private readonly observers: IObserver<Sprint>[] = [];
    private statusMessage: string = '';
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly startDate: Date,
        private readonly endDate: Date,
        private readonly scrumMaster: User,
        private readonly strategy: ISprintStrategy,
        private releasePipeline?: Pipeline,
        private state: ISprintState = new CreatedSprintState(this),
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
    notifyObservers(e?: IEvent): void {
        for (const observer of this.observers) {
            observer.update(this, e);
        }
    }

    addBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlogItems.push(...backlogItems);
        backlogItems.forEach((item) => item.setSprint(this));
    }

    removeBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlogItems = this.backlogItems.filter(
            (item) => !backlogItems.some((backlogItem) => backlogItem.getId() === item.getId()),
        );
    }

    addReviewDocument(reviewDocument: ReviewDocument): void {
        this.reviewDocument = reviewDocument;
    }

    runPipeline(visitor: IPipelineVisitor): void {
        if (this.releasePipeline) {
            this.releasePipeline.run(visitor);
            this.notifyObservers(new PipelineOutcomeEvent(this));
        }
    }

    public generateReport(report: SprintReportTemplate, withHeaderAndFooter: boolean = true): void {
        report.generateReport(withHeaderAndFooter);
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

    public changeState(state: ISprintState): void {
        this.state = state;
    }

    getTeamMembers(): User[] {
        if (this.backlogItems.length > 0) {
            return this.backlogItems[0].getProject().getMembers();
        }
        return [];
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

    getBacklogItems(): BacklogItem[] {
        return this.backlogItems;
    }

    getDocument(): ReviewDocument | undefined {
        return this.reviewDocument;
    }

    getReleasePipeline(): Pipeline | undefined {
        return this.releasePipeline;
    }

    setPipeline(pipeline: Pipeline): void {
        this.releasePipeline = pipeline;
    }
}
