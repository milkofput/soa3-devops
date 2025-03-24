import { Sprint } from "../../../issuemanagement/models/Sprint";
import { IEvent } from "../../interfaces/IEvent";

export class PipelineOutcomeEvent implements IEvent {
    public readonly timestamp: Date = new Date();
    public readonly eventType: string = 'PIPELINE_OUTCOME';

    constructor(
        public readonly sprint: Sprint
    ) { }
}