import { User } from '../../common/models/User';
import { ActivityStatusEnum } from '../enums/ActivityStatusEnum';

export class Activity {
    constructor(
        private readonly id: string,
        private readonly description: string,
        private assignee: User,
        private status: ActivityStatusEnum,
    ) { }

    setStatus(status: ActivityStatusEnum): void {
        this.status = status;
    }

    assignTo(user: User): void {
        this.assignee = user;
    }

    // getters
    getId(): string {
        return this.id;
    }

    getDescription(): string {
        return this.description;
    }

    getAssignee(): User {
        return this.assignee;
    }

    getStatus(): ActivityStatusEnum {
        return this.status;
    }
}
