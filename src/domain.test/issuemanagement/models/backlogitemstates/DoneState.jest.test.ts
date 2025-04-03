import { DoneState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoneState';
import { BacklogItem } from '../../../../domain/issuemanagement/models/BacklogItem';

describe('UT-F6-1 & UT-F6-2 (deel) DoneState', () => {
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let doneState: DoneState;

    beforeEach(() => {
        mockBacklogItem = {
            getTitle: jest.fn().mockReturnValue('Test Backlog Item'),
            changeState: jest.fn(),
            notifyObservers: jest.fn(),
        } as unknown as jest.Mocked<BacklogItem>;

        doneState = new DoneState(mockBacklogItem);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('moveToBacklog() should throw an error', () => {
        expect(() => doneState.moveToBacklog()).toThrow(/🚫 Test Backlog Item already done/);
    });

    test('startDevelopment() should throw an error', () => {
        expect(() => doneState.startDevelopment()).toThrow(/🚫 Test Backlog Item already done/);
    });

    test('markReadyForTesting() should throw an error', () => {
        expect(() => doneState.markReadyForTesting()).toThrow(/🚫 Test Backlog Item already done/);
    });

    test('beginTesting() should throw an error', () => {
        expect(() => doneState.beginTesting()).toThrow(/🚫 Test Backlog Item already done/);
    });

    test('completeTesting() should throw an error', () => {
        expect(() => doneState.completeTesting()).toThrow(/🚫 Test Backlog Item already done/);
    });

    test('markAsDone() should throw an error', () => {
        expect(() => doneState.markAsDone()).toThrow(/🚫 Test Backlog Item already done/);
    });

    test('should not call any state-changing methods', () => {
        try {
            doneState.moveToBacklog();
        } catch (e) {
            // Expected to throw
        }
        try {
            doneState.startDevelopment();
        } catch (e) {
            // Expected to throw
        }
        try {
            doneState.markReadyForTesting();
        } catch (e) {
            // Expected to throw
        }
        try {
            doneState.beginTesting();
        } catch (e) {
            // Expected to throw
        }
        try {
            doneState.completeTesting();
        } catch (e) {
            // Expected to throw
        }
        try {
            doneState.markAsDone();
        } catch (e) {
            // Expected to throw
        }

        expect(mockBacklogItem.changeState).not.toHaveBeenCalled();
        expect(mockBacklogItem.notifyObservers).not.toHaveBeenCalled();
    });
});
