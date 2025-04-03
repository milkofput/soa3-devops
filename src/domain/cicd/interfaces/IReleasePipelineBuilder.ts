import { Pipeline } from '../models/Pipeline';

export interface IReleasePipelineBuilder {
    addSource(...commands: string[]): IReleasePipelineBuilder;
    addBuild(...commands: string[]): IReleasePipelineBuilder;
    addTest(...commands: string[]): IReleasePipelineBuilder;
    addAnalyze(...commands: string[]): IReleasePipelineBuilder;
    addDeploy(...commands: string[]): IReleasePipelineBuilder;
    build(): Pipeline;
}
