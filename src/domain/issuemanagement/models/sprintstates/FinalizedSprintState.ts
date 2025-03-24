import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";

export class FinalizedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("Sprint is already finalized");
    }

    public start(): void {
        console.log("Sprint is already finalized");
    }

    public finish(): void {
        console.log("Sprint is already finalized");
    }

    public finalize(): void {
        console.log("Sprint is already finalized");
    }

    public cancel(): void {
        console.log("Sprint is already finalized");
    }
}