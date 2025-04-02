import { CreatedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CreatedSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';
import { StartedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/StartedSprintState';
import { CancelledSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';

describe('CreatedSprintState', () => {
    let sprint: Sprint;
    let createdState: CreatedSprintState;

    beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: jest.fn().mockReturnValue('Scrum Master') } as any,
            { sprintFinishStrategy: jest.fn() } as any,
        );

        createdState = new CreatedSprintState(sprint);
        sprint.changeState(createdState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('start() should transition to StartedSprintState', () => {
        createdState.start();

        expect(sprint.getState()).toBeInstanceOf(StartedSprintState);
    });

    test('finish() should throw an error that the sprint is not started yet', () => {
        expect(() => createdState.finish()).toThrow(/not started yet/);
    });

    test('finalize() should throw an error that the sprint is not started yet', () => {
        expect(() => createdState.finalize()).toThrow(/not started yet/);
    });

    test('cancel() should transition to CancelledSprintState', () => {
        createdState.cancel();

        expect(sprint.getState()).toBeInstanceOf(CancelledSprintState);
    });
});
