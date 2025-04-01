import { IBacklogItemState } from "../../interfaces/IBacklogItemState";
import { BacklogItem } from "../BacklogItem";
import { ReadyForTestingState } from "./ReadyForTestingState";

export class DoingState implements IBacklogItemState {
    constructor(private readonly backlogItem: BacklogItem) { }

    public moveToBacklog(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} can't move while in progress`);
    }

    public startDevelopment(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already in progress`);
    }

    public markReadyForTesting(): void {
        this.backlogItem.changeState(new ReadyForTestingState(this.backlogItem));
        console.log(`\n✅ Backlog Item: ${this.backlogItem.getTitle()} is ready for testing`);
    }

    public beginTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} has not been tested`);
    }

    public completeTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} has not been tested`);
    }

    public markAsDone(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} has not been tested`);
    }

}
