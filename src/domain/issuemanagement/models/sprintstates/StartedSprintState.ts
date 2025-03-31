import { ISprintState } from '../../interfaces/ISprintState';
import { Sprint } from '../Sprint';
import { CancelledSprintState } from './CancelledSprintState';
import { FinishedSprintState } from './FinishedSprintState';

export class StartedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) {}

    public create(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already started`);
    }

    public start(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} already started`);
    }

    public finish(): void {
        this.sprint.setState(new FinishedSprintState(this.sprint));
        console.log(`\n🏁 ${this.sprint.getName()} finished`);
    }

    public finalize(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} not finished yet`);
    }

    public cancel(): void {
        this.sprint.setState(new CancelledSprintState(this.sprint));
        console.log(`\n🗑️ ${this.sprint.getName()} cancelled`);
    }
}
