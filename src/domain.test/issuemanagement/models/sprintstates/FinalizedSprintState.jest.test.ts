import { FinalizedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinalizedSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';

describe('FinalizedSprintState', () => {
    let sprint: Sprint;
    let finalizedState: FinalizedSprintState;

    beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: jest.fn().mockReturnValue('Scrum Master') } as any,
            { sprintFinishStrategy: jest.fn() } as any,
        );

        finalizedState = new FinalizedSprintState(sprint);
        sprint.changeState(finalizedState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('start() should throw an error that the sprint is already finalized', () => {
        expect(() => finalizedState.start()).toThrow(/already finalized/);
    });

    test('finish() should throw an error that the sprint is already finalized', () => {
        expect(() => finalizedState.finish()).toThrow(/already finalized/);
    });

    test('finalize() should throw an error that the sprint is already finalized', () => {
        expect(() => finalizedState.finalize()).toThrow(/already finalized/);
    });

    test('cancel() should throw an error that the sprint is already finalized', () => {
        expect(() => finalizedState.cancel()).toThrow(/already finalized/);
    });
});
