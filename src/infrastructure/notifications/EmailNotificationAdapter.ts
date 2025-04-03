import { EmailNotificationLibrary } from './EmailNotificationLibrary';
import { User } from '../../domain/common/models/User';
import { INotificationChannel } from '../../domain/notifications/interfaces/INotificationChannel';

export class EmailNotificationAdapter implements INotificationChannel {
    private readonly emailNotificationLibrary = new EmailNotificationLibrary();

    public sendNotification(user: User, message: string): void {
        this.emailNotificationLibrary.sendEmail(
            user.getName(),
            user.getEmail(),
            'Notification',
            message,
        );
    }
}
