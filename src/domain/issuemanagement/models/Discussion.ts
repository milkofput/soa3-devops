import { BacklogItem } from './BacklogItem';
import { Message } from './Message';

export class Discussion {
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly relatedItem: BacklogItem,
        private isActive: boolean = true,
        private readonly messages: Message[] = [],
    ) { }

    addMessage(message: Message): void {
        this.messages.push(message);
    }

    // set unactive when discussion is closed when related item is done
    closeDiscussion(): void {
        this.isActive = false;
    }

    reopenDiscussion(): void {
        this.isActive = true;
    }

    // getters
    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getRelatedItem(): BacklogItem {
        return this.relatedItem;
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getMessages(): Message[] {
        return this.messages;
    }
}
