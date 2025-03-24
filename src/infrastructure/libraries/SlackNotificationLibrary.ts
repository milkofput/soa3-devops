export class SlackNotificationLibrary {
    sendSlackMessage(username: String, message: String): void {
        console.log(`💬 Sending slack message to ${username} with content: ${message}`);
    }
}