import { Discussion } from '../../../issuemanagement/models/Discussion';
import { Message } from '../../../issuemanagement/models/Message';
import { IEvent } from '../../interfaces/IEvent';

export class DiscussionMessageAddedEvent implements IEvent {
    public readonly timestamp: Date = new Date();
    public readonly eventType: string = 'DISCUSSION_MESSAGE_ADDED';

    constructor(
        public readonly discussion: Discussion,
        public readonly message: Message,
    ) {}
}
