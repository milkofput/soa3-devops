import { IPipelineBuilder } from '../interface/IPipelineBuilder';
import { IPipelineStep } from '../interface/IPipelineStep';
import { Stack } from '../utils/Stack';
import { CommandPipelineStep } from './CommandPipelineStep';
import { CompositePipelineStep } from './CompositePipelineStep';
import { Pipeline } from './Pipeline';
import { PipelineStatusEnum } from '../enums/PipelineStatusEnum';

export class StandardPipelineBuilder implements IPipelineBuilder {
    private pointerStack?: Stack<CompositePipelineStep> = undefined;
    private root?: IPipelineStep = undefined;

    command(commandStr: string): this {
        let command = new CommandPipelineStep(commandStr);

        if (this.pointerStack?.peek()) {
            this.pointerStack?.peek()?.addChildrenPipelineStep(command);
        }

        return this;
    }

    // CC = 4
    composite(groupStr: string): this {
        let newPipelineStep = new CompositePipelineStep(groupStr);
        if (!this.root) {
            this.pointerStack = new Stack<CompositePipelineStep>();
            this.pointerStack.push(newPipelineStep);
            this.root = newPipelineStep;
        } else if (this.pointerStack) {
            const parentStep = this.pointerStack.peek();
            if (parentStep) {
                parentStep.addChildrenPipelineStep(newPipelineStep);
            }
            this.pointerStack.push(newPipelineStep);
        }
        return this;
    }

    end(): this {
        if (this.pointerStack && !this.pointerStack.isEmpty()) {
            this.pointerStack.pop();
        }
        return this;
    }

    build(): Pipeline {
        if (!this.root) {
            throw new Error('Cannot build a pipeline with no steps. Call composite() first.');
        }

        return new Pipeline(
            'Pipeline-' + new Date().toISOString(),
            PipelineStatusEnum.NOT_STARTED,
            new Date(),
            this.root,
        );
    }
}
