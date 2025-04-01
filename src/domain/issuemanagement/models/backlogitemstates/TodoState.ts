import { IBacklogItemState } from "../../interfaces/IBacklogItemState";
import { BacklogItem } from "../BacklogItem";
import { DoingState } from "./DoingState";

export class TodoState implements IBacklogItemState {
    constructor(private readonly backlogItem: BacklogItem) { }

    public moveToBacklog(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already in backlog`);
    }

    public startDevelopment(): void {
        this.backlogItem.changeState(new DoingState(this.backlogItem));
        console.log(`\n🚀 Backlog Item: ${this.backlogItem.getTitle()} is in progress`);
    }

    public markReadyForTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} not in progress`);
    }

    public beginTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} not in progress`);
    }

    public completeTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} not in progress`);
    }

    public markAsDone(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} not in progress`);
    }
}