// src/domain/cicd/models/ExecutionVisitor.ts
import { IPipelineVisitor } from '../interfaces/IPipelineVisitor';
import { IPipelineStep } from '../interfaces/IPipelineStep';
import { CommandPipelineStep } from './CommandPipelineStep';
import { CompositePipelineStep } from './CompositePipelineStep';

export class ExecutionVisitor implements IPipelineVisitor {
    visit(step: IPipelineStep): void {
        step.accept(this);
    }

    visitCommand(step: CommandPipelineStep): void {
        console.log(`🔧 Executing command: ${step.getCommand()}`);
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
