import { EmailNotificationLibrary } from "../../../infrastructure/libraries/EmailNotificationLibrary";
import { User } from "../../common/models/User";
import { INotificationChannel } from "../interfaces/INotificationChannel";

export class EmailNotificationAdapter implements INotificationChannel {
    private emailNotificationLibrary = new EmailNotificationLibrary();

    public sendNotification(user: User, message: String): void {
        this.emailNotificationLibrary.sendEmail(user.getName(), user.getEmail(), 'Notification', message);
    }
}