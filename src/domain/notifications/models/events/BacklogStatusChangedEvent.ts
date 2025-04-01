import { IBacklogItemState } from '../../../issuemanagement/interfaces/IBacklogItemState';
import { BacklogItem } from '../../../issuemanagement/models/BacklogItem';
import { IEvent } from '../../interfaces/IEvent';

export class BacklogStatusChangedEvent implements IEvent {
    public readonly timestamp: Date = new Date();
    public readonly eventType: string = 'BACKLOG_STATUS_CHANGED';

    constructor(
        public readonly backlogItem: BacklogItem,
        public readonly state: IBacklogItemState
    ) { }
}
