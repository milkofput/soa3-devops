import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";

export class FinishedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("Sprint is already finished");
    }

    public start(): void {
        console.log("Sprint is already finished");
    }

    public finish(): void {
        console.log("Sprint is already finished");
    }

    public review(): void {
        // iets met template pattern doen
    }

    public release(): void {
        // iets met template pattern doen
    }

    public cancel(): void {
        // iets met template pattern doen
    }
}