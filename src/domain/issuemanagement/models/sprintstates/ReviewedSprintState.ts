import { ISprintState } from "../../interfaces/ISprintState";
import { Sprint } from "../Sprint";

export class ReviewedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public create(): void {
        console.log("Sprint is already reviewed");
    }

    public start(): void {
        console.log("Sprint is already reviewed");
    }

    public finish(): void {
        console.log("Sprint is already reviewed");
    }

    public finalize(): void {
    }

    public cancel(): void {
    }
}