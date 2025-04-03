import { SlackNotificationLibrary } from './SlackNotificationLibrary';
import { User } from '../../domain/common/models/User';
import { INotificationChannel } from '../../domain/notifications/interfaces/INotificationChannel';

export class SlackNotificationAdapter implements INotificationChannel {
    private slackNotificationLibrary = new SlackNotificationLibrary();

    public sendNotification(user: User, message: string): void {
        this.slackNotificationLibrary.sendSlackMessage(user.getName(), message);
    }
}
