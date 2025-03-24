import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";

export class FinalizedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finalized`);
    }

    public start(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finalized`);
    }

    public finish(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finalized`);
    }

    public finalize(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finalized`);
    }

    public cancel(): void {
        console.log(`\n🚫 ${this.sprint.getName()} already finalized`);
    }
}