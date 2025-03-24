import { ISprintStrategy } from "../../interfaces/ISprintStrategy";
import { Sprint } from "../Sprint";
import { ReviewedSprintState } from "../sprintstates/ReviewedSprintState";

export class ReviewSprintStrategy implements ISprintStrategy {
    public sprintFinishStrategy(sprint: Sprint): void {
        sprint.getDocument
        sprint.setState(new ReviewedSprintState(sprint));
    }
}