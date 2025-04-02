import tap from 'tap';
import sinon from 'sinon';
import { TestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestingState';
import { TodoState } from '../../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { BacklogStatusChangedEvent } from '../../../../domain/notifications/models/events/BacklogStatusChangedEvent';
import { TestedState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestedState';

tap.test('TestingState', (t) => {
    let mockBacklogItem: any;
    let testingState: TestingState;

    t.beforeEach(() => {
        // Create a mock backlog item
        mockBacklogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            changeState: sinon.stub(),
            notifyObservers: sinon.stub(),
        };

        // Create a TestingState instance with the mock
        testingState = new TestingState(mockBacklogItem);
    });

    t.afterEach(() => {
        // Clean up sinon stubs
        sinon.restore();
    });

    t.test('moveToBacklog() should transition to TodoState and notify observers', (t) => {
        // Call the method to test
        testingState.moveToBacklog();

        // Verify changeState was called with TodoState
        t.ok(mockBacklogItem.changeState.calledOnce, 'Should call changeState once');

        const newState = mockBacklogItem.changeState.getCall(0).args[0];
        t.ok(newState instanceof TodoState, 'Should transition to TodoState');

        // Verify notifyObservers was called with BacklogStatusChangedEvent
        t.ok(mockBacklogItem.notifyObservers.calledOnce, 'Should call notifyObservers once');

        const event = mockBacklogItem.notifyObservers.getCall(0).args[0];
        t.ok(
            event instanceof BacklogStatusChangedEvent,
            'Should notify with BacklogStatusChangedEvent',
        );
        t.equal(event.state.constructor.name, 'TodoState', 'Event should contain TodoState');
        t.equal(event.backlogItem, mockBacklogItem, 'Event should reference the backlog item');

        t.end();
    });

    t.test('startDevelopment() should throw an error', (t) => {
        t.throws(
            () => testingState.startDevelopment(),
            /🚫 Test Backlog Item already in testing/,
            'Should throw error indicating item is already in testing',
        );
        t.end();
    });

    t.test('markReadyForTesting() should throw an error', (t) => {
        t.throws(
            () => testingState.markReadyForTesting(),
            /🚫 Test Backlog Item already in testing/,
            'Should throw error indicating item is already in testing',
        );
        t.end();
    });

    t.test('beginTesting() should throw an error', (t) => {
        t.throws(
            () => testingState.beginTesting(),
            /🚫 Test Backlog Item already in testing/,
            'Should throw error indicating item is already in testing',
        );
        t.end();
    });

    t.test('completeTesting() should transition to TestedState', (t) => {
        // Call the method to test
        testingState.completeTesting();

        // Verify changeState was called with TestedState
        t.ok(mockBacklogItem.changeState.calledOnce, 'Should call changeState once');

        const newState = mockBacklogItem.changeState.getCall(0).args[0];
        t.ok(newState instanceof TestedState, 'Should transition to TestedState');

        // Note: This method doesn't notify observers, unlike moveToBacklog()
        t.notOk(mockBacklogItem.notifyObservers.called, 'Should not call notifyObservers');

        t.end();
    });

    t.test('markAsDone() should throw an error', (t) => {
        t.throws(
            () => testingState.markAsDone(),
            /🚫 Test Backlog Item testing has not completed/,
            'Should throw error indicating testing has not completed',
        );
        t.end();
    });

    t.end();
});
