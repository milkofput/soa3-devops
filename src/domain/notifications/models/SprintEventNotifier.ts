import { PipelineStatusEnum } from '../../cicd/enums/PipelineStatusEnum';
import { Sprint } from '../../issuemanagement/models/Sprint';
import { IEvent } from '../interfaces/IEvent';
import { IObserver } from '../interfaces/IObserver';
import { PipelineOutcomeEvent } from './events/PipelineOutcomeEvent';

export class SprintEventNotifier implements IObserver<Sprint> {
    update(subject: Sprint, event?: IEvent): void {
        if (event && event instanceof PipelineOutcomeEvent) {
            this.handlePipelineNotification(subject);
        }
    }

    // CC = 5
    private handlePipelineNotification(subject: Sprint): void {
        const pipeline = subject.getReleasePipeline();
        if (pipeline) {
            if (pipeline.getStatus() === PipelineStatusEnum.FAILED) {
                console.log('\n⚠️ SENDING PIPELINE FAILURE NOTIFICATION ⚠️');
                const scrumMaster = subject.getScrumMaster();
                const message = `Pipeline '${pipeline.getName()}' for sprint '${subject.getName()}' has failed!`;
                scrumMaster
                    .getPreferredNotificationChannel()
                    .sendNotification(scrumMaster, message);
            } else if (pipeline.getStatus() === PipelineStatusEnum.SUCCEEDED) {
                console.log('\n✅ SENDING PIPELINE SUCCESS NOTIFICATION ✅');
                const scrumMaster = subject.getScrumMaster();
                const productOwner = subject.getBacklogItems()[0]?.getProject().getProductOwner();
                const message = `Pipeline '${pipeline.getName()}' for sprint '${subject.getName()}' has succeeded!`;
                scrumMaster
                    .getPreferredNotificationChannel()
                    .sendNotification(scrumMaster, message);

                if (productOwner) {
                    productOwner
                        .getPreferredNotificationChannel()
                        .sendNotification(productOwner, message);
                }
            }
        }
    }
}
