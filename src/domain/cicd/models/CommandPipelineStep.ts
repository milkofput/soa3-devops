import { IPipelineStep } from '../interfaces/IPipelineStep';
import { IPipelineVisitor } from '../interfaces/IPipelineVisitor';

export class CommandPipelineStep implements IPipelineStep {
    constructor(private readonly command: string) {}

    public accept(visitor: IPipelineVisitor) {
        visitor.visitCommand(this);
    }

    public getCommand() {
        return this.command;
    }
}
