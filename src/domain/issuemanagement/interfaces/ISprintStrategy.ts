import { Sprint } from "../models/Sprint";

export interface ISprintStrategy {
    sprintFinishStrategy(sprint: Sprint): void;
}