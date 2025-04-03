import { TestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestingState';
import { TodoState } from '../../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { BacklogStatusChangedEvent } from '../../../../domain/notifications/models/events/BacklogStatusChangedEvent';
import { TestedState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestedState';
import { BacklogItem } from '../../../../domain/issuemanagement/models/BacklogItem';

describe('UT-F6-1 & UT-F6-2 (deel) TestingState', () => {
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let testingState: TestingState;

    beforeEach(() => {
        mockBacklogItem = {
            getTitle: jest.fn().mockReturnValue('Test Backlog Item'),
            changeState: jest.fn(),
            notifyObservers: jest.fn(),
        } as unknown as jest.Mocked<BacklogItem>;

        testingState = new TestingState(mockBacklogItem);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('moveToBacklog() should transition to TodoState and notify observers', () => {
        testingState.moveToBacklog();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(TodoState);

        expect(mockBacklogItem.notifyObservers).toHaveBeenCalledTimes(1);
        const event = mockBacklogItem.notifyObservers.mock.calls[0][0];
        expect(event).toBeInstanceOf(BacklogStatusChangedEvent);
        expect((event as any).state.constructor.name).toBe('TodoState');
        expect((event as any).backlogItem).toBe(mockBacklogItem);
    });

    test('startDevelopment() should throw an error', () => {
        expect(() => testingState.startDevelopment()).toThrow(
            /🚫 Test Backlog Item already in testing/,
        );
    });

    test('markReadyForTesting() should throw an error', () => {
        expect(() => testingState.markReadyForTesting()).toThrow(
            /🚫 Test Backlog Item already in testing/,
        );
    });

    test('beginTesting() should throw an error', () => {
        expect(() => testingState.beginTesting()).toThrow(
            /🚫 Test Backlog Item already in testing/,
        );
    });

    test('completeTesting() should transition to TestedState', () => {
        testingState.completeTesting();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(TestedState);

        expect(mockBacklogItem.notifyObservers).not.toHaveBeenCalled();
    });

    test('markAsDone() should throw an error', () => {
        expect(() => testingState.markAsDone()).toThrow(
            /🚫 Test Backlog Item testing has not completed/,
        );
    });
});
