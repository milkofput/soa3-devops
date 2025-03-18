import { UserRoleEnum } from '../enums/UserRoleEnum';

export class User {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly email: string,
        private readonly role: UserRoleEnum,
    ) {}

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getRole(): string {
        return this.role;
    }
}
