import tap from 'tap';
import { FinalizedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinalizedSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';

tap.test('FinalizedSprintState', (t) => {
    let sprint: Sprint;
    let finalizedState: FinalizedSprintState;

    t.beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: () => 'Scrum Master' } as any,
            { sprintFinishStrategy: () => {} } as any,
        );
        finalizedState = new FinalizedSprintState(sprint);
        sprint.setState(finalizedState);
    });

    t.test('create() should throw an error that the sprint is already finalized', (t) => {
        t.throws(
            () => finalizedState.create(),
            /already finalized/,
            'Should throw an error indicating the sprint is already finalized',
        );
        t.end();
    });

    t.test('start() should throw an error that the sprint is already finalized', (t) => {
        t.throws(
            () => finalizedState.start(),
            /already finalized/,
            'Should throw an error indicating the sprint is already finalized',
        );
        t.end();
    });

    t.test('finish() should throw an error that the sprint is already finalized', (t) => {
        t.throws(
            () => finalizedState.finish(),
            /already finalized/,
            'Should throw an error indicating the sprint is already finalized',
        );
        t.end();
    });

    t.test('finalize() should throw an error that the sprint is already finalized', (t) => {
        t.throws(
            () => finalizedState.finalize(),
            /already finalized/,
            'Should throw an error indicating the sprint is already finalized',
        );
        t.end();
    });

    t.test('cancel() should throw an error that the sprint is already finalized', (t) => {
        t.throws(
            () => finalizedState.cancel(),
            /already finalized/,
            'Should throw an error indicating the sprint is already finalized',
        );
        t.end();
    });

    t.end();
});
