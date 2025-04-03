import { TodoState } from '../../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { DoingState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoingState';
import { BacklogItem } from '../../../../domain/issuemanagement/models/BacklogItem';

describe('UT-F6-1 & UT-F6-2 (deel) TodoState', () => {
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let todoState: TodoState;

    beforeEach(() => {
        mockBacklogItem = {
            getTitle: jest.fn().mockReturnValue('Test Backlog Item'),
            changeState: jest.fn(),
        } as unknown as jest.Mocked<BacklogItem>;

        todoState = new TodoState(mockBacklogItem);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('moveToBacklog() should throw an error', () => {
        expect(() => todoState.moveToBacklog()).toThrow(/🚫 Test Backlog Item already in backlog/);
    });

    test('startDevelopment() should transition to DoingState', () => {
        todoState.startDevelopment();

        expect(mockBacklogItem.changeState).toHaveBeenCalledTimes(1);
        const newState = mockBacklogItem.changeState.mock.calls[0][0];
        expect(newState).toBeInstanceOf(DoingState);
    });

    test('markReadyForTesting() should throw an error', () => {
        expect(() => todoState.markReadyForTesting()).toThrow(
            /🚫 Test Backlog Item not in progress/,
        );
    });

    test('beginTesting() should throw an error', () => {
        expect(() => todoState.beginTesting()).toThrow(/🚫 Test Backlog Item not in progress/);
    });

    test('completeTesting() should throw an error', () => {
        expect(() => todoState.completeTesting()).toThrow(/🚫 Test Backlog Item not in progress/);
    });

    test('markAsDone() should throw an error', () => {
        expect(() => todoState.markAsDone()).toThrow(/🚫 Test Backlog Item not in progress/);
    });
});
