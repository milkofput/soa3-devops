import { StartedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/StartedSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';
import { FinishedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinishedSprintState';
import { CancelledSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';

describe('StartedSprintState', () => {
    let sprint: Sprint;
    let startedState: StartedSprintState;

    beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: jest.fn().mockReturnValue('Scrum Master') } as any,
            { sprintFinishStrategy: jest.fn() } as any,
        );

        startedState = new StartedSprintState(sprint);
        sprint.changeState(startedState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('start() should throw an error that the sprint is already started', () => {
        // Act & Assert
        expect(() => startedState.start()).toThrow(/already started/);
    });

    test('finish() should transition to FinishedSprintState', () => {
        // Act
        startedState.finish();

        // Assert
        expect(sprint.getState()).toBeInstanceOf(FinishedSprintState);
    });

    test('finalize() should throw an error that the sprint is not finished yet', () => {
        // Act & Assert
        expect(() => startedState.finalize()).toThrow(/not finished yet/);
    });

    test('cancel() should transition to CancelledSprintState', () => {
        // Act
        startedState.cancel();

        // Assert
        expect(sprint.getState()).toBeInstanceOf(CancelledSprintState);
    });
});
