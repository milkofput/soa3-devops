import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";

export class CancelledSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("Sprint is already cancelled");
    }

    public start(): void {
        console.log("Sprint is already cancelled");
    }

    public finish(): void {
        console.log("Sprint is already cancelled");
    }

    public review(): void {
        console.log("Sprint is already cancelled");
    }

    public release(): void {
        console.log("Sprint is already cancelled");
    }

    public cancel(): void {
        console.log("Sprint is already cancelled");
    }
}