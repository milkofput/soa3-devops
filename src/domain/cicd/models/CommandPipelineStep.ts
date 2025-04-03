import { IPipelineStep } from '../interfaces/IPipelineStep';
import { IPipelineVisitor } from '../interfaces/IPipelineVisitor';

export class CommandPipelineStep implements IPipelineStep {
    constructor(private readonly command: string) { }

    public accept(visitor: IPipelineVisitor): void {
        visitor.visitCommand(this);
    }

    public getCommand(): string {
        return this.command;
    }
}
