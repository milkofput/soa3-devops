import { ReadyForTestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/ReadyForTestingState';
import { TestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestingState';
import { BacklogItem } from '../../../../domain/issuemanagement/models/BacklogItem';

describe('UT-F6-1 & UT-F6-2 (deel) ReadyForTestingState', () => {
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let readyForTestingState: ReadyForTestingState;

    beforeEach(() => {
        mockBacklogItem = {
            getTitle: jest.fn().mockReturnValue('Test Backlog Item'),
            changeState: jest.fn(),
            notifyObservers: jest.fn(),
        } as unknown as jest.Mocked<BacklogItem>;

        readyForTestingState = new ReadyForTestingState(mockBacklogItem);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('moveToBacklog() should throw an error', () => {
        expect(() => readyForTestingState.moveToBacklog()).toThrow(
            /🚫 Test Backlog Item already ready for testing/,
        );
    });

    test('startDevelopment() should throw an error', () => {
        expect(() => readyForTestingState.startDevelopment()).toThrow(
            /🚫 Test Backlog Item already ready for testing/,
        );
    });

    test('markReadyForTesting() should throw an error', () => {
        expect(() => readyForTestingState.markReadyForTesting()).toThrow(
            /🚫 Test Backlog Item already ready for testing/,
        );
    });

    test('beginTesting() should transition to TestingState', () => {
        readyForTestingState.beginTesting();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(TestingState);

        expect(mockBacklogItem.notifyObservers).not.toHaveBeenCalled();
    });

    test('completeTesting() should throw an error', () => {
        expect(() => readyForTestingState.completeTesting()).toThrow(
            /🚫 Test Backlog Item testing has not started/,
        );
    });

    test('markAsDone() should throw an error', () => {
        expect(() => readyForTestingState.markAsDone()).toThrow(
            /🚫 Test Backlog Item testing has not started/,
        );
    });
});
