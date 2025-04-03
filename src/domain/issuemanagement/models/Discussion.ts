import { BacklogItem } from './BacklogItem';
import { Message } from './Message';
import { User } from '../../common/models/User';
import { IEvent } from '../../notifications/interfaces/IEvent';
import { IObserver } from '../../notifications/interfaces/IObserver';
import { ISubject } from '../../notifications/interfaces/ISubject';
import { DoneState } from './backlogitemstates/DoneState';
import { DiscussionMessageAddedEvent } from '../../notifications/models/events/DiscussionMessageAddedEvent';

export class Discussion implements ISubject<Discussion> {
    private readonly observers: IObserver<Discussion>[] = [];
    private readonly participants: Set<User> = new Set();
    private readonly messages: Message[] = [];

    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly relatedItem: BacklogItem,
    ) {}

    addMessage(message: Message): void {
        if (this.isClosed()) {
            throw new Error(`Cannot add message - discussion "${this.title}" is closed`);
        }

        if (this.relatedItem.getState() instanceof DoneState) {
            throw new Error(
                `Cannot add message - backlog item ${this.relatedItem.getTitle()} is done`,
            );
        }

        this.messages.push(message);
        if (!this.participants.has(message.getAuthor())) {
            this.participants.add(message.getAuthor());
        }
        this.notifyObservers(new DiscussionMessageAddedEvent(this, message));
    }

    isClosed(): boolean {
        return this.relatedItem.getState() instanceof DoneState;
    }

    addObserver(observer: IObserver<Discussion>): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    removeObserver(observer: IObserver<Discussion>): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(event?: IEvent): void {
        this.observers.forEach((observer) => observer.update(this, event));
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getRelatedItem(): BacklogItem {
        return this.relatedItem;
    }

    getMessages(): Message[] {
        return [...this.messages];
    }

    getParticipants(): Set<User> {
        return new Set(this.participants);
    }
}
