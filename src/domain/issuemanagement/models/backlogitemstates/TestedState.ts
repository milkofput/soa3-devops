import { IBacklogItemState } from "../../interfaces/IBacklogItemState";
import { BacklogItem } from "../BacklogItem";
import { DoneState } from "./DoneState";
import { TodoState } from "./TodoState";

export class TestedState implements IBacklogItemState {
    constructor(private readonly backlogItem: BacklogItem) { }

    public moveToBacklog(): void {
        this.backlogItem.changeState(new TodoState(this.backlogItem));
        console.log(`\n✅ ${this.backlogItem.getTitle()} moved to backlog`);
    }

    public startDevelopment(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already tested`);
    }

    public markReadyForTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already tested`);
    }

    public beginTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already tested`);
    }

    public completeTesting(): void {
        throw new Error(`🚫 ${this.backlogItem.getTitle()} already tested`);
    }

    public markAsDone(): void {
        this.backlogItem.changeState(new DoneState(this.backlogItem));
        console.log(`\n✅ ${this.backlogItem.getTitle()} is done`);
    }

}