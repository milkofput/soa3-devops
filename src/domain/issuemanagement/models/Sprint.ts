import { User } from '../../common/models/User';
import { IObserver } from '../../notifications/interfaces/IObserver';
import { ISubject } from '../../notifications/interfaces/ISubject';
import { BacklogItem } from './BacklogItem';

export class Sprint implements ISubject<Sprint> {
    //private readonly reviewDocument?: ReviewDocument;
    private readonly observers: IObserver<Sprint>[] = [];
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
