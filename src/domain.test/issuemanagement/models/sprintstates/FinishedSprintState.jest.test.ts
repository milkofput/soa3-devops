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

describe('FinishedSprintState', () => {
    let mockFinishStrategy: MockFinishStrategy;
    let sprint: Sprint;
    let finishedState: FinishedSprintState;

    beforeEach(() => {
        mockFinishStrategy = new MockFinishStrategy();

        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: jest.fn().mockReturnValue('Scrum Master') } as any,
            mockFinishStrategy,
        );

        finishedState = new FinishedSprintState(sprint);
        sprint.changeState(finishedState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('start() should throw an error that the sprint is already finished', () => {
        expect(() => finishedState.start()).toThrow(/already finished/);
    });

    test('finish() should throw an error that the sprint is already finished', () => {
        expect(() => finishedState.finish()).toThrow(/already finished/);
    });

    test('finalize() should call the sprintFinishStrategy', () => {
        expect(mockFinishStrategy.called).toBe(false);

        finishedState.finalize();

        expect(mockFinishStrategy.called).toBe(true);
    });

    test('cancel() should transition to CancelledSprintState', () => {
        finishedState.cancel();

        expect(sprint.getState()).toBeInstanceOf(CancelledSprintState);
    });
});
