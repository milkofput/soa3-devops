import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { IObserver } from '../interfaces/IObserver';
import { IEvent } from '../interfaces/IEvent';
import { BacklogItemStatusEnum } from '../../issuemanagement/enums/BacklogItemStatusEnum';
import { BacklogStatusChangedEvent } from './events/BacklogStatusChangedEvent';
import { UserRoleEnum } from '../../common/enums/UserRoleEnum';

export class BacklogItemNotifier implements IObserver<BacklogItem> {
    update(subject: BacklogItem, event?: IEvent): void {
        if (event && event instanceof BacklogStatusChangedEvent) {
            this.handleTestingNotification(subject, event);
            this.handleRegressionAlert(subject, event);
        }
    }

    private handleTestingNotification(
        subject: BacklogItem,
        event: BacklogStatusChangedEvent,
    ): void {
        if (
            event.newStatus === BacklogItemStatusEnum.TESTING &&
            event.previousStatus !== BacklogItemStatusEnum.TESTING
        ) {
            console.log('\n🧪 SENDING TESTING NOTIFICATIONS 🧪');
            const message = `Item "${subject.getTitle()}" has been moved to Testing!`;
            subject.getProject().getMembers().forEach((member) => {
                if (member.getRole() === UserRoleEnum.TESTER) {
                    member.getPreferredNotificationChannel().sendNotification(member, message)
                }
            });
        }
    }

    private handleRegressionAlert(subject: BacklogItem, event: BacklogStatusChangedEvent): void {
        const statusValues = Object.values(BacklogItemStatusEnum);
        const currentIndex = statusValues.indexOf(event.newStatus);
        const previousIndex = statusValues.indexOf(event.previousStatus);

        if (currentIndex < previousIndex) {
            console.log('\n⚠️  SENDING REGRESSION NOTIFICATIONS ⚠️');
            const message = `Item "${subject.getTitle()}" has regressed from: ${event.previousStatus} → to: ${event.newStatus}!`;
            const scrumMaster = subject.getSprint()?.getScrumMaster();
            scrumMaster?.getPreferredNotificationChannel().sendNotification(scrumMaster, message);
        }
    }
}
