import tap from 'tap';
import { CreatedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CreatedSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';
import { StartedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/StartedSprintState';
import { CancelledSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';

tap.test('CreatedSprintState', (t) => {
    let sprint: Sprint;
    let createdState: CreatedSprintState;

    t.beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: () => 'Scrum Master' } as any, // Mock User
            { sprintFinishStrategy: () => {} } as any, // Mock ISprintStrategy
        );
        createdState = new CreatedSprintState(sprint);
        sprint.changeState(createdState);
    });

    t.test('start() should transition to StartedSprintState', (t) => {
        createdState.start();

        t.ok(
            sprint.getState() instanceof StartedSprintState,
            'Should transition to StartedSprintState',
        );
        t.end();
    });

    t.test('finish() should throw an error that the sprint is not started yet', (t) => {
        t.throws(
            () => createdState.finish(),
            /not started yet/,
            'Should throw an error indicating the sprint is not started yet',
        );
        t.end();
    });

    t.test('finalize() should throw an error that the sprint is not started yet', (t) => {
        t.throws(
            () => createdState.finalize(),
            /not started yet/,
            'Should throw an error indicating the sprint is not started yet',
        );
        t.end();
    });

    t.test('cancel() should transition to CancelledSprintState', (t) => {
        createdState.cancel();

        t.ok(
            sprint.getState() instanceof CancelledSprintState,
            'Should transition to CancelledSprintState',
        );
        t.end();
    });

    t.end();
});
