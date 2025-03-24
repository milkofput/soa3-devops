import { Sprint } from "../Sprint";
import { ISprintState } from "../../interfaces/ISprintState";
import { StartedSprintState } from "./StartedSprintState";
import { CancelledSprintState } from "./CancelledSprintState";

export class CreatedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("🚫 Sprint is already created");
    }

    public start(): void {
        this.sprint.setState(new StartedSprintState(this.sprint));
        console.log("🚀 Sprint is started");
    }

    public finish(): void {
        console.log("🚫 Sprint is not started yet");
    }

    public finalize(): void {
        console.log("🚫 Sprint is not started yet");
    }

    public cancel(): void {
        this.sprint.setState(new CancelledSprintState(this.sprint));
        console.log("🗑️ Sprint is cancelled");
    }
}