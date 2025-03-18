import { User } from '../../common/models/User';

export class Message {
    constructor(
        private readonly id: string,
        private readonly text: string,
        private readonly author: User,
        private readonly timestamp: Date,
    ) {}

    getId(): string {
        return this.id;
    }

    getText(): string {
        return this.text;
    }

    getAuthor(): User {
        return this.author;
    }

    getTimestamp(): Date {
        return this.timestamp;
    }
}
