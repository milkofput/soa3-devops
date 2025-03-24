import { INotificationChannel } from '../../notifications/interfaces/INotificationChannel';
import { UserRoleEnum } from '../enums/UserRoleEnum';

export class User {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly email: string,
        private role: UserRoleEnum,
        private readonly preferredNotificationChannel: INotificationChannel
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

    getPreferredNotificationChannel(): INotificationChannel {
        return this.preferredNotificationChannel;
    }

    toString(): string {
        return `${this.name} <${this.email}>`;
    }
}
