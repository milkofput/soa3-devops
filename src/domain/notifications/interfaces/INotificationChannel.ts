import { User } from "../../common/models/User";

export interface INotificationChannel {
    sendNotification(user: User, message: String): void;
}