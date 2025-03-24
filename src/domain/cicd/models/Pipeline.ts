import { PipelineStatusEnum } from '../enums/PipelineStatusEnum';
import { IPipelineStep } from '../interface/IPipelineStep';
import { IPipelineVisitor } from '../interface/IPipelineVisitor';

export class Pipeline {
    private status: PipelineStatusEnum;

    constructor(
        private readonly name: string,
        status: PipelineStatusEnum,
        lastRun: Date,
        private readonly rootPipelineStep: IPipelineStep,
    ) {
        this.status = status;
    }

    public run(visitor: IPipelineVisitor): boolean {
        console.log('\n🚧 Running pipe', this.name);
        this.status = PipelineStatusEnum.RUNNING;

        try {
            visitor.visit(this.rootPipelineStep);
            this.status = PipelineStatusEnum.SUCCEEDED;
            return true;
        } catch (error) {
            console.error(`❌ Pipeline failed: ${error instanceof Error ? error.message : String(error)}`);
            this.status = PipelineStatusEnum.FAILED;
            return false;
        }
    }

    public getStatus(): PipelineStatusEnum {
        return this.status;
    }

    public getName(): string {
        return this.name;
    }
}
