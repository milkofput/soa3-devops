import { CancelledSprintState } from '../../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';

describe('UT-F4-5 (deel) CancelledSprintState', () => {
    let sprint: Sprint;
    let cancelledState: CancelledSprintState;

    beforeEach(() => {
        sprint = new Sprint(
            'sprint-1',
            'Test Sprint',
            new Date(),
            new Date(Date.now() + 86400000),
            { getName: jest.fn().mockReturnValue('Scrum Master') } as any,
            { sprintFinishStrategy: jest.fn() } as any,
        );

        cancelledState = new CancelledSprintState(sprint);
        sprint.changeState(cancelledState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('start() should throw an error that the sprint is already cancelled', () => {
        expect(() => cancelledState.start()).toThrow(/already cancelled/);
    });

    test('finish() should throw an error that the sprint is already cancelled', () => {
        expect(() => cancelledState.finish()).toThrow(/already cancelled/);
    });

    test('finalize() should throw an error that the sprint is already cancelled', () => {
        expect(() => cancelledState.finalize()).toThrow(/already cancelled/);
    });

    test('cancel() should throw an error that the sprint is already cancelled', () => {
        expect(() => cancelledState.cancel()).toThrow(/already cancelled/);
    });
});
