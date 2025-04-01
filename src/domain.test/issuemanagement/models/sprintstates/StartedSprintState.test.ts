import tap from 'tap';
import { StartedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/StartedSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';
import { FinishedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinishedSprintState';
import { CancelledSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';

tap.test('StartedSprintState', (t) => {
    let sprint: Sprint;
    let startedState: StartedSprintState;

    t.beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: () => 'Scrum Master' } as any,
            { sprintFinishStrategy: () => { } } as any,
        );
        startedState = new StartedSprintState(sprint);
        sprint.changeState(startedState);
    });

    t.test('create() should throw an error that the sprint is already started', (t) => {
        t.throws(
            () => startedState.create(),
            /already started/,
            'Should throw an error indicating the sprint is already started',
        );
        t.end();
    });

    t.test('start() should throw an error that the sprint is already started', (t) => {
        t.throws(
            () => startedState.start(),
            /already started/,
            'Should throw an error indicating the sprint is already started',
        );
        t.end();
    });

    t.test('finish() should transition to FinishedSprintState', (t) => {
        startedState.finish();
        t.ok(
            sprint.getState() instanceof FinishedSprintState,
            'Should transition to FinishedSprintState',
        );
        t.end();
    });

    t.test('finalize() should throw an error that the sprint is not finished yet', (t) => {
        t.throws(
            () => startedState.finalize(),
            /not finished yet/,
            'Should throw an error indicating the sprint is not finished yet',
        );
        t.end();
    });

    t.test('cancel() should transition to CancelledSprintState', (t) => {
        startedState.cancel();
        t.ok(
            sprint.getState() instanceof CancelledSprintState,
            'Should transition to CancelledSprintState',
        );
        t.end();
    });

    t.end();
});
