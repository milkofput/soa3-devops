import { PipelineStatusEnum } from '../../../cicd/enums/PipelineStatusEnum';
import { IPipelineVisitor } from '../../../cicd/interface/IPipelineVisitor';
import { ExecutionVisitor } from '../../../cicd/models/ExecutionVisitor';
import { ISprintStrategy } from '../../interfaces/ISprintStrategy';
import { Sprint } from '../Sprint';
import { FinalizedSprintState } from '../sprintstates/FinalizedSprintState';
import { FinishedSprintState } from '../sprintstates/FinishedSprintState';

export class ReleaseSprintStrategy implements ISprintStrategy {
    constructor(private readonly visitor: IPipelineVisitor) {}

    public sprintFinishStrategy(sprint: Sprint): void {
        sprint.runPipeline(this.visitor);
        const releasePipeline = sprint.getReleasePipeline();
        if (!releasePipeline) {
            throw new Error(`\n🚫 No release pipeline found, sprint cannot be released`);
        }
        if (releasePipeline.getStatus() === PipelineStatusEnum.FAILED) {
            throw new Error(`\n🚫 Pipeline failed, sprint is not released`);
        }
        sprint.setState(new FinalizedSprintState(sprint));
        console.log(`\n🎯 ${sprint.getName()} released`);
    }
}
