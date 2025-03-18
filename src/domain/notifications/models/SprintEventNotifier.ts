import { User } from '../../common/models/User';
import { BacklogItem } from '../../issuemanagement/models/BacklogItem';
import { Sprint } from '../../issuemanagement/models/Sprint';
import { IObserver } from '../interfaces/IObserver';

export class SprintEventNotifier implements IObserver<Sprint> {
    private oldBacklogItems: BacklogItem[] = [];
    update(data: Sprint): void {
        if (this.oldBacklogItems.length > data.getBacklogItems().length) {
            const removedBacklogItems = this.oldBacklogItems.filter(
                (oldBacklogItem) =>
                    !data
                        .getBacklogItems()
                        .some(
                            (newBacklogItem) => newBacklogItem.getId() === oldBacklogItem.getId(),
                        ),
            );
            this.notifyBacklogItemsRemoved(removedBacklogItems, data.getScrumMaster());
        } else if (this.oldBacklogItems.length < data.getBacklogItems().length) {
            const addedBacklogItems = data
                .getBacklogItems()
                .filter(
                    (newBacklogItem) =>
                        !this.oldBacklogItems.some(
                            (oldBacklogItem) => oldBacklogItem.getId() === newBacklogItem.getId(),
                        ),
                );
            this.notifyBacklogItemsAdded(addedBacklogItems, data.getScrumMaster());
        }
        this.oldBacklogItems = data.getBacklogItems();
    }

    notifyBacklogItemsAdded(backlogItems: BacklogItem[], user: User): void {
        console.log(`Message for ${user.getName()}:`);
        console.log(`Backlog items added:`);
        backlogItems.forEach((item) => {
            console.log(`- ${item.getTitle()} (${item.getId()})`);
        });
        console.log('----------------------------------');
    }

    notifyBacklogItemsRemoved(backlogItems: BacklogItem[], user: User): void {
        console.log(`Message for ${user.getName()}:`);
        console.log(`Backlog items removed:`);
        backlogItems.forEach((item) => {
            console.log(`- ${item.getTitle()} (${item.getId()})`);
        });
        console.log('----------------------------------');
    }
}
