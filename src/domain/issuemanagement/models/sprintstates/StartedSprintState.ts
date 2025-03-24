import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";
import { CancelledSprintState } from "./CancelledSprintState";
import { FinishedSprintState } from "./FinishedSprintState";

export class StartedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("🚫 Sprint is already started");
    }

    public start(): void {
        console.log("🚫 Sprint is already started");
    }

    public finish(): void {
        this.sprint.setState(new FinishedSprintState(this.sprint));
        console.log("🏁 Sprint is finished");
    }

    public finalize(): void {
        console.log("🚫 Sprint is not finished yet");
    }

    public cancel(): void {
        this.sprint.setState(new CancelledSprintState(this.sprint));
        console.log("🗑️ Sprint is cancelled");
    }
}