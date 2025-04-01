import { IBacklogItemState } from "../../interfaces/IBacklogItemState";
import { BacklogItem } from "../BacklogItem";
import { TestingState } from "./TestingState";

export class ReadyForTestingState implements IBacklogItemState {
    constructor(private readonly backlogItem: BacklogItem) { }

    public moveToBacklog(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already ready for testing`);
    }

    public startDevelopment(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already ready for testing`);
    }

    public markReadyForTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already ready for testing`);
    }

    public beginTesting(): void {
        this.backlogItem.changeState(new TestingState(this.backlogItem));
        console.log(`\n🚀 ${this.backlogItem.getTitle()} is in testing`);
    }

    public completeTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} testing has not started`);
    }

    public markAsDone(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} testing has not started`);
    }

}