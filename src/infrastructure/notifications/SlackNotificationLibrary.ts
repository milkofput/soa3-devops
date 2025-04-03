export class SlackNotificationLibrary {
    sendSlackMessage(username: string, message: string): void {
        console.log(`💬 Sending slack message to ${username} with content: ${message}`);
    }
}