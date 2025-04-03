import { IPipelineBuilder } from '../interfaces/IPipelineBuilder';
import { Pipeline } from '../models/Pipeline';
import { StandardPipelineBuilder } from './StandardPipelineBuilder';

export class ReleasePipelineBuilder {
    private readonly pipelineBuilder: IPipelineBuilder;
    private readonly name: string;

    constructor(sprintName: string) {
        this.pipelineBuilder = new StandardPipelineBuilder();
        this.name = `${sprintName} Release Pipeline`;
        this.pipelineBuilder.composite(this.name);
    }

    private addStage(stageName: string, commands: string[]): this {
        this.pipelineBuilder.composite(stageName);
        commands.forEach((cmd) => this.pipelineBuilder.command(cmd));
        this.pipelineBuilder.end();
        return this;
    }

    public addSource(...commands: string[]): this {
        return this.addStage('Source', commands);
    }

    public addBuild(...commands: string[]): this {
        return this.addStage('Build', commands);
    }

    public addTest(...commands: string[]): this {
        return this.addStage('Test', commands);
    }

    public addAnalyze(...commands: string[]): this {
        return this.addStage('Analyze', commands);
    }

    public addDeploy(...commands: string[]): this {
        return this.addStage('Deploy', commands);
    }

    public addPackage(...commands: string[]): this {
        return this.addStage('Package', commands);
    }

    public addUtility(...commands: string[]): this {
        return this.addStage('Utility', commands);
    }

    public build(): Pipeline {
        this.pipelineBuilder.end();
        return this.pipelineBuilder.build();
    }
}
