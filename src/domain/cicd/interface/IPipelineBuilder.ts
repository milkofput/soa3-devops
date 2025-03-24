import { Pipeline } from '../models/Pipeline';

export interface IPipelineBuilder {
    command(commandStr: string): this;
    composite(groupStr: string): this;
    end(): this;
    build(): Pipeline;
}
