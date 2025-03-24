import { CommandPipelineStep } from '../models/CommandPipelineStep';
import { CompositePipelineStep } from '../models/CompositePipelineStep';
import { IPipelineStep } from './IPipelineStep';

export interface IPipelineVisitor {
    visit(pipelineStep: IPipelineStep): void;
    visitCommand(command: CommandPipelineStep): void;
    visitComposite(composite: CompositePipelineStep): void;
}
