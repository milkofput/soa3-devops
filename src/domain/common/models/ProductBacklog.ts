import { BacklogItem } from '../../issuemanagement/models/BacklogItem';

export class ProductBacklog {
    constructor(
        private readonly id: string,
        private backlogItems: BacklogItem[] = [],
    ) {}

    addBacklogItems(...items: BacklogItem[]): void {
        this.backlogItems.push(...items);
    }

    removeBacklogItems(...backlogItems: BacklogItem[]): void {
        this.backlogItems = this.backlogItems.filter(
            (item) => !backlogItems.some((backlogItem) => backlogItem.getId() === item.getId()),
        );
    }

    getId(): string {
        return this.id;
    }

    getItems(): BacklogItem[] {
        return this.backlogItems;
    }
}
