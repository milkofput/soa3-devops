import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";

export class CancelledSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }

    public start(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }

    public finish(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }

    public finalize(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }

    public cancel(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }
}