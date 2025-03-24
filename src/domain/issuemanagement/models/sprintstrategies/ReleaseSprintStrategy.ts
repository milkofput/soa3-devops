import { ISprintStrategy } from "../../interfaces/ISprintStrategy";

export class ReleaseSprintStrategy implements ISprintStrategy {
    public sprintFinishStrategy(): void {
        console.log("Time to release sprint");
    }
}