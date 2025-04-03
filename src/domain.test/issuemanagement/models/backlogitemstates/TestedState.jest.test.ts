import { TestedState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestedState';
import { TodoState } from '../../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { BacklogStatusChangedEvent } from '../../../../domain/notifications/models/events/BacklogStatusChangedEvent';
import { DoneState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoneState';
import { ActivityStatusEnum } from '../../../../domain/issuemanagement/enums/ActivityStatusEnum';
import { BacklogItem } from '../../../../domain/issuemanagement/models/BacklogItem';

describe('UT-F6-1 & UT-F6-2 (deel) TestedState', () => {
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let testedState: TestedState;
    let mockActivities;

    beforeEach(() => {
        mockActivities = [
            { getStatus: jest.fn().mockReturnValue(ActivityStatusEnum.DONE) },
            { getStatus: jest.fn().mockReturnValue(ActivityStatusEnum.DONE) },
        ];

        mockBacklogItem = {
            getTitle: jest.fn().mockReturnValue('Test Backlog Item'),
            changeState: jest.fn(),
            notifyObservers: jest.fn(),
            getActivities: jest.fn().mockReturnValue(mockActivities),
        } as unknown as jest.Mocked<BacklogItem>;

        testedState = new TestedState(mockBacklogItem);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('moveToBacklog() should transition to TodoState and notify observers', () => {
        testedState.moveToBacklog();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(TodoState);

        expect(mockBacklogItem.notifyObservers).toHaveBeenCalledTimes(1);
        const event = mockBacklogItem.notifyObservers.mock.calls[0][0] as any;
        expect(event).toBeInstanceOf(BacklogStatusChangedEvent);
        expect(event.state.constructor.name).toBe('TodoState');
        expect(event.backlogItem).toBe(mockBacklogItem);
    });

    test('startDevelopment() should throw an error', () => {
        expect(() => testedState.startDevelopment()).toThrow(/🚫 Test Backlog Item already tested/);
    });

    test('markReadyForTesting() should transition to TestedState (self-transition) and notify observers', () => {
        testedState.markReadyForTesting();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(TestedState);

        expect(mockBacklogItem.notifyObservers).toHaveBeenCalledTimes(1);
        const event = mockBacklogItem.notifyObservers.mock.calls[0][0] as any;
        expect(event).toBeInstanceOf(BacklogStatusChangedEvent);
        expect(event.state.constructor.name).toBe('TestedState');
    });

    test('beginTesting() should throw an error', () => {
        expect(() => testedState.beginTesting()).toThrow(/🚫 Test Backlog Item already tested/);
    });

    test('completeTesting() should throw an error', () => {
        expect(() => testedState.completeTesting()).toThrow(/🚫 Test Backlog Item already tested/);
    });

    test('markAsDone() should transition to DoneState when all activities are done', () => {
        testedState.markAsDone();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(DoneState);

        expect(mockBacklogItem.getActivities).toHaveBeenCalledTimes(1);
        expect(mockBacklogItem.notifyObservers).not.toHaveBeenCalled();
    });

    test('markAsDone() should throw error when some activities are not done', () => {
        const mixedActivities = [
            { getStatus: jest.fn().mockReturnValue(ActivityStatusEnum.DONE) },
            { getStatus: jest.fn().mockReturnValue(ActivityStatusEnum.TODO) },
        ] as any;

        mockBacklogItem.getActivities.mockReturnValue(mixedActivities);

        expect(() => testedState.markAsDone()).toThrow(
            /🚫 Test Backlog Item not all activities are done/,
        );
        expect(mockBacklogItem.getActivities).toHaveBeenCalledTimes(1);
        expect(mockBacklogItem.changeState).not.toHaveBeenCalled();
    });

    test('markAsDone() should transition to DoneState when there are no activities', () => {
        mockBacklogItem.getActivities.mockReturnValue([]);

        testedState.markAsDone();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(DoneState);
    });
});
