import { DoingState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoingState';
import { ReadyForTestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/ReadyForTestingState';
import { BacklogStatusChangedEvent } from '../../../../domain/notifications/models/events/BacklogStatusChangedEvent';
import { BacklogItem } from '../../../../domain/issuemanagement/models/BacklogItem';

describe('DoingState', () => {
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let doingState: DoingState;

    beforeEach(() => {
        mockBacklogItem = {
            getTitle: jest.fn().mockReturnValue('Test Backlog Item'),
            changeState: jest.fn(),
            notifyObservers: jest.fn(),
        } as unknown as jest.Mocked<BacklogItem>;

        doingState = new DoingState(mockBacklogItem);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('moveToBacklog() should throw an error', () => {
        expect(() => doingState.moveToBacklog()).toThrow(
            /🚫 Test Backlog Item can't move while in progress/,
        );
    });

    test('startDevelopment() should throw an error', () => {
        expect(() => doingState.startDevelopment()).toThrow(
            /🚫 Test Backlog Item already in progress/,
        );
    });

    test('markReadyForTesting() should transition to ReadyForTestingState and notify observers', () => {
        doingState.markReadyForTesting();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(ReadyForTestingState);

        expect(mockBacklogItem.notifyObservers).toHaveBeenCalledTimes(1);
        const event = mockBacklogItem.notifyObservers.mock.calls[0][0] as any;
        expect(event).toBeInstanceOf(BacklogStatusChangedEvent);
        expect(event.state.constructor.name).toBe('ReadyForTestingState');
        expect(event.backlogItem).toBe(mockBacklogItem);
    });

    test('beginTesting() should throw an error', () => {
        expect(() => doingState.beginTesting()).toThrow(/🚫 Test Backlog Item has not been tested/);
    });

    test('completeTesting() should throw an error', () => {
        expect(() => doingState.completeTesting()).toThrow(
            /🚫 Test Backlog Item has not been tested/,
        );
    });

    test('markAsDone() should throw an error', () => {
        expect(() => doingState.markAsDone()).toThrow(/🚫 Test Backlog Item has not been tested/);
    });
});
