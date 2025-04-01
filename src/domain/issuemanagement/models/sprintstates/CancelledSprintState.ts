import { ISprintState } from '../../interfaces/ISprintState';
import { Sprint } from '../Sprint';

export class CancelledSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public start(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }

    public finish(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }

    public finalize(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }

    public cancel(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already cancelled`);
    }
}
