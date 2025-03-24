import { SlackNotificationLibrary } from "../../../infrastructure/libraries/SlackNotificationLibrary";
import { User } from "../../common/models/User";
import { INotificationChannel } from "../interfaces/INotificationChannel";

export class SlackNotificationAdapter implements INotificationChannel {
    private slackNotificationLibrary = new SlackNotificationLibrary();

    public sendNotification(user: User, message: String): void {
        this.slackNotificationLibrary.sendSlackMessage(user.getName(), message);
    }
}