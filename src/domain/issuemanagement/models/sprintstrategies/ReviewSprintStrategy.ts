import { ISprintStrategy } from "../../interfaces/ISprintStrategy";
import { Sprint } from "../Sprint";
import { FinalizedSprintState } from "../sprintstates/FinalizedSprintState";

export class ReviewSprintStrategy implements ISprintStrategy {
    public sprintFinishStrategy(sprint: Sprint): void {
        if (!sprint.getDocument()) {
            throw new Error("Document is required to review sprint");
        }
        sprint.setState(new FinalizedSprintState(sprint));
        console.log("Sprint is reviewed");
    }
}