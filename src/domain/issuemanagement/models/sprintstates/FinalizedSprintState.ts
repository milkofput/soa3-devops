import { ISprintState } from '../../interfaces/ISprintState';
import { Sprint } from '../Sprint';

export class FinalizedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public start(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already finalized`);
    }

    public finish(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already finalized`);
    }

    public finalize(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already finalized`);
    }

    public cancel(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already finalized`);
    }
}
