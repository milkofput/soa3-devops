import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";
import { FinishedSprintState } from "./FinishedSprintState";

export class StartedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("Sprint is already started");
    }

    public start(): void {
        console.log("Sprint is already started");
    }

    public finish(): void {
        this.sprint.setState(new FinishedSprintState(this.sprint));
    }

    public finalize(): void {
        console.log("Sprint is not finished yet");
    }

    public cancel(): void {
        console.log("Sprint is not finished yet");
    }
}