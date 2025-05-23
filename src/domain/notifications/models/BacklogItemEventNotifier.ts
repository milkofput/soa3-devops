import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { IObserver } from '../interfaces/IObserver';
import { IEvent } from '../interfaces/IEvent';
import { BacklogStatusChangedEvent } from './events/BacklogStatusChangedEvent';
import { UserRoleEnum } from '../../common/enums/UserRoleEnum';
import { ReadyForTestingState } from '../../issuemanagement/models/backlogitemstates/ReadyForTestingState';
import { TodoState } from '../../issuemanagement/models/backlogitemstates/TodoState';

export class BacklogItemEventNotifier implements IObserver<BacklogItem> {
    update(subject: BacklogItem, event?: IEvent): void {
        if (event && event instanceof BacklogStatusChangedEvent) {
            this.handleTestingNotification(subject, event);
            this.handleRegressionAlert(subject, event);
        }
    }

    // CC = 4
    private handleTestingNotification(subject: BacklogItem, event: BacklogStatusChangedEvent): void {
        if (event.state instanceof ReadyForTestingState) {
            console.log('\n🧪 SENDING TESTING NOTIFICATIONS 🧪');
            const message = `Item "${subject.getTitle()}" has been moved to Testing!`;
            subject
                .getProject()
                .getMembers()
                .forEach((member) => {
                    if (member.getRole() === UserRoleEnum.TESTER) {
                        member.getPreferredNotificationChannel().sendNotification(member, message);
                    }
                });
        }
    }

    // CC = 4
    private handleRegressionAlert(subject: BacklogItem, event: BacklogStatusChangedEvent): void {
        if (event.state instanceof TodoState) {
            console.log('\n⚠️  SENDING REGRESSION NOTIFICATIONS ⚠️');
            const message = `Item "${subject.getTitle()}" has been moved to todo!`;
            const scrumMaster = subject.getSprint()?.getScrumMaster();
            scrumMaster?.getPreferredNotificationChannel().sendNotification(scrumMaster, message);
        }
    }
}
