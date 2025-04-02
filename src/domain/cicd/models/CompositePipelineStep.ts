import { IPipelineStep } from '../interfaces/IPipelineStep';
import { IPipelineVisitor } from '../interfaces/IPipelineVisitor';

export class CompositePipelineStep implements IPipelineStep {
    constructor(
        private readonly groupName: string,
        private readonly childrenPipelineSteps: IPipelineStep[] = [],
    ) {}

    public accept(visitor: IPipelineVisitor) {
        visitor.visitComposite(this);
    }

    public addChildrenPipelineStep(pipelineStep: IPipelineStep) {
        this.childrenPipelineSteps.push(pipelineStep);
    }

    public getChildrenPipelineSteps() {
        return this.childrenPipelineSteps;
    }

    public getGroupName() {
        return this.groupName;
    }
}
