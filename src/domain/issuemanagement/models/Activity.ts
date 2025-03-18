import { User } from '../../common/models/User';
import { ActivityStatusEnum } from '../enums/ActivityStatusEnum';

export class Activity {
    constructor(
        private readonly id: string,
        private readonly description: string,
        private readonly assignee: User,
        private readonly status: ActivityStatusEnum,
    ) {}
}
