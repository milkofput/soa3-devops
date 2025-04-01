import { BacklogStatusChangedEvent } from "../../../notifications/models/events/BacklogStatusChangedEvent";
import { ActivityStatusEnum } from "../../enums/ActivityStatusEnum";
import { IBacklogItemState } from "../../interfaces/IBacklogItemState";
import { BacklogItem } from "../BacklogItem";
import { DoneState } from "./DoneState";
import { TodoState } from "./TodoState";

export class TestedState implements IBacklogItemState {
    constructor(private readonly backlogItem: BacklogItem) { }

    public moveToBacklog(): void {
        this.backlogItem.changeState(new TodoState(this.backlogItem));
        console.log(`\n✅ ${this.backlogItem.getTitle()} moved to backlog`);
        this.backlogItem.notifyObservers(new BacklogStatusChangedEvent(this.backlogItem, new TodoState(this.backlogItem)));
    }

    public startDevelopment(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already tested`);
    }

    public markReadyForTesting(): void {
        this.backlogItem.changeState(new TestedState(this.backlogItem));
        console.log(`\n✅ ${this.backlogItem.getTitle()} is ready for testing`);
        this.backlogItem.notifyObservers(new BacklogStatusChangedEvent(this.backlogItem, new TestedState(this.backlogItem)));
    }

    public beginTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already tested`);
    }

    public completeTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already tested`);
    }

    public markAsDone(): void {
        // can only be done after all activities have enum ActivityStatusEnum.DONE
        if (this.backlogItem.getActivities().every(activity => activity.getStatus() === ActivityStatusEnum.DONE)) {
            this.backlogItem.changeState(new DoneState(this.backlogItem));
            console.log(`\n✅ ${this.backlogItem.getTitle()} is done`);
        }
        else {
            throw new Error(`🚫 ${this.backlogItem.getTitle()} not all activities are done`);
        }
    }

}