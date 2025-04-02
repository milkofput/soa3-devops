import tap from 'tap';
import { FinishedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinishedSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';
import { CancelledSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';
import { ISprintStrategy } from '../../../../domain/issuemanagement/interfaces/ISprintStrategy';

class MockFinishStrategy implements ISprintStrategy {
    called: boolean = false;

    sprintFinishStrategy() {
        this.called = true;
    }
    getFinishStrategy() {
        return this.sprintFinishStrategy;
    }
}
tap.test('FinishedSprintState', (t) => {
    let mockFinishStrategy: any;
    let sprint: Sprint;
    let finishedState: FinishedSprintState;

    t.beforeEach(() => {
        mockFinishStrategy = new MockFinishStrategy();
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: () => 'Scrum Master' } as any,
            mockFinishStrategy,
        );
        finishedState = new FinishedSprintState(sprint);
        sprint.changeState(finishedState);
    });

    t.test('start() should throw an error that the sprint is already finished', (t) => {
        t.throws(
            () => finishedState.start(),
            /already finished/,
            'Should throw an error indicating the sprint is already finished',
        );
        t.end();
    });

    t.test('finish() should throw an error that the sprint is already finished', (t) => {
        t.throws(
            () => finishedState.finish(),
            /already finished/,
            'Should throw an error indicating the sprint is already finished',
        );
        t.end();
    });

    t.test('finalize() should call the sprintFinishStrategy', (t) => {
        t.notOk(mockFinishStrategy.called, 'Should not call the sprintFinishStrategy yet');
        finishedState.finalize();
        t.ok(mockFinishStrategy.called, 'Should call the sprintFinishStrategy');
        t.end();
    });

    t.test('cancel() should transition to CancelledSprintState', (t) => {
        finishedState.cancel();
        t.ok(
            sprint.getState() instanceof CancelledSprintState,
            'Should transition to CancelledSprintState',
        );
        t.end();
    });

    t.end();
});
