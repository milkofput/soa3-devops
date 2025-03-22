import { Sprint } from "../Sprint";
import { ISprintState } from "../../interfaces/ISprintState";
import { StartedSprintState } from "./StartedSprintState";

export class CreatedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("Sprint is already created");
    }

    public start(): void {
        this.sprint.setState(new StartedSprintState(this.sprint));
        this.sprint.setStatusMessage("Sprint is started");
    }

    public finish(): void {
        console.log("Sprint is not started yet");
    }

    public review(): void {
        console.log("Sprint is not started yet");
    }

    public release(): void {
        console.log("Sprint is not started yet");
    }

    public cancel(): void {
        console.log("Sprint is not started yet");
    }
}