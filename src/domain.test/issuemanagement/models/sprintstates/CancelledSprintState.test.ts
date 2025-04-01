import tap from 'tap';
import { CancelledSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';

tap.test('CancelledSprintState', (t) => {
    let sprint: Sprint;
    let cancelledState: CancelledSprintState;

    t.beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: () => 'Scrum Master' } as any,
            { sprintFinishStrategy: () => { } } as any,
        );
        cancelledState = new CancelledSprintState(sprint);
        sprint.changeState(cancelledState);
    });

    t.test('create() should throw an error that the sprint is already cancelled', (t) => {
        t.throws(
            () => cancelledState.create(),
            /already cancelled/,
            'Should throw an error indicating the sprint is already cancelled',
        );
        t.end();
    });

    t.test('start() should throw an error that the sprint is already cancelled', (t) => {
        t.throws(
            () => cancelledState.start(),
            /already cancelled/,
            'Should throw an error indicating the sprint is already cancelled',
        );
        t.end();
    });

    t.test('finish() should throw an error that the sprint is already cancelled', (t) => {
        t.throws(
            () => cancelledState.finish(),
            /already cancelled/,
            'Should throw an error indicating the sprint is already cancelled',
        );
        t.end();
    });

    t.test('finalize() should throw an error that the sprint is already cancelled', (t) => {
        t.throws(
            () => cancelledState.finalize(),
            /already cancelled/,
            'Should throw an error indicating the sprint is already cancelled',
        );
        t.end();
    });

    t.test('cancel() should throw an error that the sprint is already cancelled', (t) => {
        t.throws(
            () => cancelledState.cancel(),
            /already cancelled/,
            'Should throw an error indicating the sprint is already cancelled',
        );
        t.end();
    });

    t.end();
});
