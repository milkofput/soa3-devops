import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";
import { CancelledSprintState } from "./CancelledSprintState";

export class FinishedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finished`);
    }

    public start(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finished`);
    }

    public finish(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finished`);
    }

    public finalize(): void {
        this.sprint.getStrategy().sprintFinishStrategy(this.sprint);
    }

    public cancel(): void {
        this.sprint.setState(new CancelledSprintState(this.sprint));
        console.log(`\n🗑️ ${this.sprint.getName()} cancelled`);
    }
}