export class EmailNotificationLibrary {
    sendEmail(name: string, emailAddress: string, subject: string, body: string): void {
        console.log(`✉️  Sending email to ${name} <${emailAddress}> with subject: ${subject} and body: ${body}`);
    }
}