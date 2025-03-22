import { User } from "../../common/models/User";

export class ReviewDocument {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly author: User,
        private readonly createdAt: Date,
    ) { }

    // getters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getAuthor(): User {
        return this.author;
    }

    getAuthorString(): string {
        return this.author.toString();
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }
}