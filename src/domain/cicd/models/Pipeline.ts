import { PipelineStatusEnum } from '../enums/PipelineStatusEnum';
import { IPipelineStep } from '../interface/IPipelineStep';
import { IPipelineVisitor } from '../interface/IPipelineVisitor';

export class Pipeline {
    constructor(
        private readonly name: string,
        private readonly status: PipelineStatusEnum,
        private readonly lastRun: Date,
        private readonly rootPipelineStep: IPipelineStep,
    ) {}

    public run(visitor: IPipelineVisitor) {
        console.log('Running pipe', this.name);
        visitor.visit(this.rootPipelineStep);
    }
}
