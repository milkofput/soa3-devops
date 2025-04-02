import tap from 'tap';
import sinon from 'sinon';
import { TodoState } from '../../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { DoingState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoingState';

tap.test('TodoState', (t) => {
    let mockBacklogItem: any;
    let todoState: TodoState;

    t.beforeEach(() => {
        // Create a mock backlog item
        mockBacklogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            changeState: sinon.stub(),
        };

        // Create a TodoState instance with the mock
        todoState = new TodoState(mockBacklogItem);
    });

    t.afterEach(() => {
        // Clean up sinon stubs
        sinon.restore();
    });

    t.test('moveToBacklog() should throw an error', (t) => {
        t.throws(
            () => todoState.moveToBacklog(),
            /🚫 Test Backlog Item already in backlog/,
            'Should throw error indicating item is already in backlog',
        );
        t.end();
    });

    t.test('startDevelopment() should transition to DoingState', (t) => {
        // Call the method to test
        todoState.startDevelopment();

        // Verify that changeState was called with a DoingState instance
        t.ok(mockBacklogItem.changeState.calledOnce, 'Should call changeState once');

        const newState = mockBacklogItem.changeState.getCall(0).args[0];
        t.ok(newState instanceof DoingState, 'Should transition to DoingState');

        t.end();
    });

    t.test('markReadyForTesting() should throw an error', (t) => {
        t.throws(
            () => todoState.markReadyForTesting(),
            /🚫 Test Backlog Item not in progress/,
            'Should throw error indicating item is not in progress',
        );
        t.end();
    });

    t.test('beginTesting() should throw an error', (t) => {
        t.throws(
            () => todoState.beginTesting(),
            /🚫 Test Backlog Item not in progress/,
            'Should throw error indicating item is not in progress',
        );
        t.end();
    });

    t.test('completeTesting() should throw an error', (t) => {
        t.throws(
            () => todoState.completeTesting(),
            /🚫 Test Backlog Item not in progress/,
            'Should throw error indicating item is not in progress',
        );
        t.end();
    });

    t.test('markAsDone() should throw an error', (t) => {
        t.throws(
            () => todoState.markAsDone(),
            /🚫 Test Backlog Item not in progress/,
            'Should throw error indicating item is not in progress',
        );
        t.end();
    });

    t.end();
});
