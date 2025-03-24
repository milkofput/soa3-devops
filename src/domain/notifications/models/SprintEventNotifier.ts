import { User } from '../../common/models/User';
import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { Sprint } from '../../issuemanagement/models/Sprint';
import { IObserver } from '../interfaces/IObserver';

export class SprintEventNotifier implements IObserver<Sprint> {
    private oldBacklogItems: BacklogItem[] = [];
    update(data: Sprint): void {
        // notify scrummaster when pipeline fails


        // notify scrummasten en product owner when pipeline succeeds
    }


}
