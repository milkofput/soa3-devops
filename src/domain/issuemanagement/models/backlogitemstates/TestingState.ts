import { BacklogStatusChangedEvent } from '../../../notifications/models/events/BacklogStatusChangedEvent';
import { IBacklogItemState } from '../../interfaces/IBacklogItemState';
import { BacklogItem } from '../BacklogItem';
import { TestedState } from './TestedState';
import { TodoState } from './TodoState';

export class TestingState implements IBacklogItemState {
    constructor(private readonly backlogItem: BacklogItem) {}

    public moveToBacklog(): void {
        this.backlogItem.changeState(new TodoState(this.backlogItem));
        console.log(`\n✅ ${this.backlogItem.getTitle()} moved to backlog`);
        this.backlogItem.notifyObservers(
            new BacklogStatusChangedEvent(this.backlogItem, new TodoState(this.backlogItem)),
        );
    }

    public startDevelopment(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already in testing`);
    }

    public markReadyForTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already in testing`);
    }

    public beginTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already in testing`);
    }

    public completeTesting(): void {
        this.backlogItem.changeState(new TestedState(this.backlogItem));
        console.log(`\n✅ ${this.backlogItem.getTitle()} testing completed`);
    }

    public markAsDone(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} testing has not completed`);
    }
}
