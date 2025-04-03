import { IPipelineVisitor } from '../interfaces/IPipelineVisitor';
import { IPipelineStep } from '../interfaces/IPipelineStep';
import { CommandPipelineStep } from './CommandPipelineStep';
import { CompositePipelineStep } from './CompositePipelineStep';

/* istanbul ignore file */

export class FailingExecutionVisitor implements IPipelineVisitor {
    private readonly failOnCommands: string[];

    constructor(failOnCommands: string[] = []) {
        this.failOnCommands = failOnCommands;
    }

    visit(step: IPipelineStep): void {
        step.accept(this);
    }

    visitCommand(step: CommandPipelineStep): void {
        const command = step.getCommand();
        console.log(`🔧 Executing command: ${command}`);

        if (this.failOnCommands.some((failCommand) => command.includes(failCommand))) {
            throw new Error(`Command failed: ${command}`);
        }
    }

    visitComposite(step: CompositePipelineStep): void {
        console.log(`📂 Entering group: ${step.getGroupName()}`);
        // Process all children
        for (const child of step.getChildrenPipelineSteps()) {
            this.visit(child);
        }
        console.log(`📂 Completed group: ${step.getGroupName()}`);
    }
}
