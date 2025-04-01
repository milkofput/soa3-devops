import { PipelineStatusEnum } from '../../cicd/enums/PipelineStatusEnum';
import { User } from '../../common/models/User';
import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { Sprint } from '../../issuemanagement/models/Sprint';
import { IEvent } from '../interfaces/IEvent';
import { IObserver } from '../interfaces/IObserver';
import { PipelineOutcomeEvent } from './events/PipelineOutcomeEvent';

export class SprintEventNotifier implements IObserver<Sprint> {

    update(sprint: Sprint, event?: IEvent): void {
        if (event && event instanceof PipelineOutcomeEvent) {
            this.handlePipelineNotification(sprint, event);
        }
    }

    // CC = 6
    private handlePipelineNotification(sprint: Sprint, event: PipelineOutcomeEvent): void {

        const pipeline = sprint.getReleasePipeline();
        if (pipeline) {
            if (pipeline.getStatus() === PipelineStatusEnum.FAILED) {
                console.log('\n⚠️ SENDING PIPELINE FAILURE NOTIFICATION ⚠️');
                const scrumMaster = sprint.getScrumMaster();
                const message = `Pipeline '${pipeline.getName()}' for sprint '${sprint.getName()}' has failed!`;
                scrumMaster.getPreferredNotificationChannel().sendNotification(scrumMaster, message);
            } else if (pipeline.getStatus() === PipelineStatusEnum.SUCCEEDED) {
                console.log('\n✅ SENDING PIPELINE SUCCESS NOTIFICATION ✅');
                const scrumMaster = sprint.getScrumMaster();
                const productOwner = sprint.getBacklogItems()[0]?.getProject().getProductOwner();
                const message = `Pipeline '${pipeline.getName()}' for sprint '${sprint.getName()}' has succeeded!`;

                if (scrumMaster) {
                    scrumMaster.getPreferredNotificationChannel().sendNotification(scrumMaster, message);
                }

                if (productOwner) {
                    productOwner.getPreferredNotificationChannel().sendNotification(productOwner, message);
                }
            }
        }
    }


}
