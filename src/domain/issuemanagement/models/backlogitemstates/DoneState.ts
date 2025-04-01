import { IBacklogItemState } from "../../interfaces/IBacklogItemState";
import { BacklogItem } from "../BacklogItem";

export class DoneState implements IBacklogItemState {
    constructor(private readonly backlogItem: BacklogItem) { }

    public moveToBacklog(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already done`);
    }

    public startDevelopment(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already done`);
    }

    public markReadyForTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already done`);
    }

    public beginTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already done`);
    }

    public completeTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already done`);
    }

    public markAsDone(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already done`);
    }
}