import { User } from '../../../common/models/User';
import { BacklogItemStatusEnum } from '../../../issuemanagement/enums/BacklogItemStatusEnum';
import { BacklogItem } from '../../../issuemanagement/models/BacklogItem';
import { IEvent } from '../../interfaces/IEvent';

export class BacklogStatusChangedEvent implements IEvent {
    public readonly timestamp: Date = new Date();
    public readonly eventType: string = 'BACKLOG_STATUS_CHANGED';

    constructor(
        public readonly backlogItem: BacklogItem,
        public readonly previousStatus: BacklogItemStatusEnum,
        public readonly newStatus: BacklogItemStatusEnum,
    ) {}
}
