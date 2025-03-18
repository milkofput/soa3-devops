import { BacklogItemStatusEnum } from '../../issuemanagement/enums/BacklogItemStatusEnum';
import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { IObserver } from '../interfaces/IObserver';

export class BacklogItemNotifier implements IObserver<BacklogItem> {
    private previousStatus: BacklogItemStatusEnum | undefined;
    update(data: BacklogItem): void {
        const currentStatus = data.getStatus();
        const previousStatus = this.previousStatus;

        // Case 1: Item moved to testing
        if (currentStatus === BacklogItemStatusEnum.TESTING) {
            console.log('\n🧪 TESTING NOTIFICATION 🧪');
            console.log(`Item "${data.getTitle()}" has been moved to Testing!`);
            console.log(`Assigned to: ${data.getAssignee()?.getName() ?? 'Unassigned'}`);
        }

        // Case 2: Item regressed (moved to an earlier stage in the workflow)
        if (!previousStatus) {
            this.previousStatus = currentStatus;
            return;
        }

        const statusValues = Object.values(BacklogItemStatusEnum);
        const currentIndex = statusValues.indexOf(currentStatus);
        const previousIndex = statusValues.indexOf(previousStatus);

        if (currentIndex < previousIndex) {
            console.log('\n⚠️ REGRESSION ALERT ⚠️');
            console.log(`Item "${data.getTitle()}" has regressed!`);
            console.log(`From: ${previousStatus} → To: ${currentStatus}`);
        }

        this.previousStatus = currentStatus;
    }
}
