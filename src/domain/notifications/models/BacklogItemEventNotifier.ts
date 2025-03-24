import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { IObserver } from '../interfaces/IObserver';
import { IEvent } from '../interfaces/IEvent';
import { BacklogItemStatusEnum } from '../../issuemanagement/enums/BacklogItemStatusEnum';
import { BacklogStatusChangedEvent } from './events/BacklogStatusChangedEvent';

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
            console.log('\n🧪 TESTING NOTIFICATION 🧪');
            console.log(`Item "${subject.getTitle()}" has been moved to Testing!`);
            console.log(`Assigned to: ${subject.getAssignee()?.getName() ?? 'Unassigned'}`);
        }
    }

    private handleRegressionAlert(subject: BacklogItem, event: BacklogStatusChangedEvent): void {
        const statusValues = Object.values(BacklogItemStatusEnum);
        const currentIndex = statusValues.indexOf(event.newStatus);
        const previousIndex = statusValues.indexOf(event.previousStatus);

        if (currentIndex < previousIndex) {
            console.log('\n⚠️ REGRESSION ALERT ⚠️');
            console.log(`Item "${subject.getTitle()}" has regressed!`);
            console.log(`From: ${event.previousStatus} → To: ${event.newStatus}`);
        }
    }
}
