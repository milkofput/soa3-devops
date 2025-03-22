import { UserRoleEnum } from '../enums/UserRoleEnum';

export class User {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly email: string,
        private role: UserRoleEnum,
    ) { }

    hasRole(role: UserRoleEnum): boolean {
        return this.role === role;
    }

    addRole(role: UserRoleEnum): void {
        this.role = role;
    }

    // getters
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

    toString(): string {
        return `${this.name} <${this.email}>`;
    }
}
