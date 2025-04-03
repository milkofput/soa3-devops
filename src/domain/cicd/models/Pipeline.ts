import { PipelineStatusEnum } from '../enums/PipelineStatusEnum';
import { IPipelineStep } from '../interfaces/IPipelineStep';
import { IPipelineVisitor } from '../interfaces/IPipelineVisitor';

export class Pipeline {
    constructor(
        private readonly name: string,
        private status: PipelineStatusEnum,
        lastRun: Date,
        private readonly rootPipelineStep: IPipelineStep,
    ) {}

    public run(visitor: IPipelineVisitor): boolean {
        console.log('\n🚧 Running pipe', this.name);
        this.status = PipelineStatusEnum.RUNNING;

        try {
            visitor.visit(this.rootPipelineStep);
            this.status = PipelineStatusEnum.SUCCEEDED;
            return true;
        } catch (error) {
            console.error(`❌ Pipeline failed: ${error}`);
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
