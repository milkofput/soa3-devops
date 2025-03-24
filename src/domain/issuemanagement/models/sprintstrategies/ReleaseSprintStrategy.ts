import { PipelineStatusEnum } from "../../../cicd/enums/PipelineStatusEnum";
import { IPipelineVisitor } from "../../../cicd/interface/IPipelineVisitor";
import { ExecutionVisitor } from "../../../cicd/models/ExecutionVisitor";
import { ISprintStrategy } from "../../interfaces/ISprintStrategy";
import { Sprint } from "../Sprint";
import { FinalizedSprintState } from "../sprintstates/FinalizedSprintState";
import { FinishedSprintState } from "../sprintstates/FinishedSprintState";

export class ReleaseSprintStrategy implements ISprintStrategy {
    constructor(private readonly visitor: IPipelineVisitor) { }

    public sprintFinishStrategy(sprint: Sprint): void {
        sprint.runPipeline(this.visitor);
        if (sprint.getReleasePipeline()?.getStatus() === PipelineStatusEnum.FAILED) {
            console.log(`\n🚫 Pipeline failed, sprint is not released`);
        } else {
            sprint.setState(new FinalizedSprintState(sprint));
            console.log(`\n🎯 ${sprint.getName()} released`);
        }
    }
}