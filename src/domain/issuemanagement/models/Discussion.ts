import { BacklogItem } from './BacklogItem';
import { Message } from './Message';

export class Discussion {
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly relatedItem: BacklogItem,
        private readonly isActive: boolean,
        private readonly messages: Message[] = [],
    ) {}
}
