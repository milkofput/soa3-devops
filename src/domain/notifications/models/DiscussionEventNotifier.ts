import { Discussion } from '../../issuemanagement/models/Discussion';
import { IEvent } from '../interfaces/IEvent';
import { IObserver } from '../interfaces/IObserver';
import { DiscussionMessageAddedEvent } from './events/DiscussionMessageAddedEvent';

export class DiscussionEventNotifier implements IObserver<Discussion> {
    update(subject: Discussion, event?: IEvent): void {
        if (event instanceof DiscussionMessageAddedEvent) {
            this.handleDiscussionNotification(subject, event);
        }
    }

    private handleDiscussionNotification(subject: Discussion, event: DiscussionMessageAddedEvent): void {
        console.log('\n💬 SENDING DISCUSSION NOTIFICATIONS 💬');
        const message = `New message in discussion "${subject.getTitle()}" from ${event.message.getAuthor().getName()}`;

        subject.getParticipants().forEach((participant) => {
            if (participant.getId() !== event.message.getAuthor().getId()) {
                participant
                    .getPreferredNotificationChannel()
                    .sendNotification(participant, message);
            }
        });
    }
}
