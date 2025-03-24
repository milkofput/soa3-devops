import { ISprintStrategy } from "../../interfaces/ISprintStrategy";
import { Sprint } from "../Sprint";
import { FinalizedSprintState } from "../sprintstates/FinalizedSprintState";

export class ReleaseSprintStrategy implements ISprintStrategy {
    public sprintFinishStrategy(sprint: Sprint): void {
        // run pipeline
        // if (! pipeline success) {
        //     throw new Error("Pipeline is required to release sprint");
        // }
        sprint.setState(new FinalizedSprintState(sprint));
        console.log("Sprint is released");
    }
}