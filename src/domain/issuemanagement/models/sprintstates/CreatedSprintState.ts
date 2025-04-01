import { Sprint } from '../Sprint';
import { ISprintState } from '../../interfaces/ISprintState';
import { StartedSprintState } from './StartedSprintState';
import { CancelledSprintState } from './CancelledSprintState';

export class CreatedSprintState implements ISprintState {
    constructor(private readonly sprint: Sprint) { }

    public start(): void {
        this.sprint.changeState(new StartedSprintState(this.sprint));
        console.log(`\n=============================================`);
        console.log(`\n🚀 ${this.sprint.getName()} is started`);
    }

    public finish(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} not started yet`);
    }

    public finalize(): void {
        throw new Error(`\n🚫 ${this.sprint.getName()} not started yet`);
    }

    public cancel(): void {
        this.sprint.changeState(new CancelledSprintState(this.sprint));
        console.log(`\n🗑️ ${this.sprint.getName()} cancelled`);
    }
}
