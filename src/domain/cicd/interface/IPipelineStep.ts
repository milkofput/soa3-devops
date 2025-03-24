import { IPipelineVisitor } from './IPipelineVisitor';

export interface IPipelineStep {
    accept(pipelineStepVisitor: IPipelineVisitor): void;
}
