import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";

export class ReleasedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("Sprint is already released");
    }

    public start(): void {
        console.log("Sprint is already released");
    }

    public finish(): void {
        console.log("Sprint is already released");
    }

    public review(): void {
    }

    public release(): void {
    }

    public cancel(): void {
    }
}