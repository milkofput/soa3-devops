import { IPipelineStep } from '../interfaces/IPipelineStep';
import { IPipelineVisitor } from '../interfaces/IPipelineVisitor';

export class CompositePipelineStep implements IPipelineStep {
    constructor(
        private readonly groupName: string,
        private readonly childrenPipelineSteps: IPipelineStep[] = [],
    ) { }

    public accept(visitor: IPipelineVisitor): void {
        visitor.visitComposite(this);
    }

    public addChildrenPipelineStep(pipelineStep: IPipelineStep): void {
        this.childrenPipelineSteps.push(pipelineStep);
    }

    public getChildrenPipelineSteps(): IPipelineStep[] {
        return this.childrenPipelineSteps;
    }

    public getGroupName(): string {
        return this.groupName;
    }
}
