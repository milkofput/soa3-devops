export class EmailNotificationLibrary {
    sendEmail(name: String, emailAddress: String, subject: String, body: String): void {
        console.log(`✉️  Sending email to ${name} <${emailAddress}> with subject: ${subject} and body: ${body}`);
    }
}