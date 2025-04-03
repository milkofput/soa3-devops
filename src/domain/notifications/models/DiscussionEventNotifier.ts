import { Discussion } from '../../issuemanagement/models/Discussion';
import { IEvent } from '../interfaces/IEvent';
import { IObserver } from '../interfaces/IObserver';
import { DiscussionMessageAddedEvent } from './events/DiscussionMessageAddedEvent';

export class DiscussionEventNotifier implements IObserver<Discussion> {
    update(discussion: Discussion, event?: IEvent): void {
        if (event instanceof DiscussionMessageAddedEvent) {
            console.log('\n💬 SENDING DISCUSSION NOTIFICATIONS 💬');
            const message = `New message in discussion "${discussion.getTitle()}" from ${event.message.getAuthor().getName()}`;

            discussion.getParticipants().forEach((participant) => {
                if (participant.getId() !== event.message.getAuthor().getId()) {
                    participant
                        .getPreferredNotificationChannel()
                        .sendNotification(participant, message);
                }
            });
        }
    }
}
