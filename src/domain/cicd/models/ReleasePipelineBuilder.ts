import { IPipelineBuilder } from '../interfaces/IPipelineBuilder';
import { Pipeline } from '../models/Pipeline';
import { StandardPipelineBuilder } from './StandardPipelineBuilder';

export class ReleasePipelineBuilder {
    private pipelineBuilder: IPipelineBuilder;
    private name: string;

    constructor(sprintName: string) {
        this.pipelineBuilder = new StandardPipelineBuilder();
        this.name = `${sprintName} Release Pipeline`;
        this.pipelineBuilder.composite(this.name);
    }

    private addStage(stageName: string, commands: string[]): ReleasePipelineBuilder {
        this.pipelineBuilder.composite(stageName);
        commands.forEach((cmd) => this.pipelineBuilder.command(cmd));
        this.pipelineBuilder.end();
        return this;
    }

    public addSource(...commands: string[]): ReleasePipelineBuilder {
        return this.addStage('Source', commands);
    }

    public addBuild(...commands: string[]): ReleasePipelineBuilder {
        return this.addStage('Build', commands);
    }

    public addTest(...commands: string[]): ReleasePipelineBuilder {
        return this.addStage('Test', commands);
    }

    public addAnalyze(...commands: string[]): ReleasePipelineBuilder {
        return this.addStage('Analyze', commands);
    }

    public addDeploy(...commands: string[]): ReleasePipelineBuilder {
        return this.addStage('Deploy', commands);
    }

    public build(): Pipeline {
        this.pipelineBuilder.end();
        return this.pipelineBuilder.build();
    }
}
