import tap from 'tap';
import sinon from 'sinon';
import { ReadyForTestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/ReadyForTestingState';
import { TestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestingState';

tap.test('ReadyForTestingState', (t) => {
    let mockBacklogItem: any;
    let readyForTestingState: ReadyForTestingState;

    t.beforeEach(() => {
        // Create a mock backlog item
        mockBacklogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            changeState: sinon.stub(),
            notifyObservers: sinon.stub(),
        };

        // Create a ReadyForTestingState instance with the mock
        readyForTestingState = new ReadyForTestingState(mockBacklogItem);
    });

    t.afterEach(() => {
        // Clean up sinon stubs
        sinon.restore();
    });

    t.test('moveToBacklog() should throw an error', (t) => {
        t.throws(
            () => readyForTestingState.moveToBacklog(),
            /🚫 Test Backlog Item already ready for testing/,
            'Should throw error indicating item is already ready for testing',
        );
        t.end();
    });

    t.test('startDevelopment() should throw an error', (t) => {
        t.throws(
            () => readyForTestingState.startDevelopment(),
            /🚫 Test Backlog Item already ready for testing/,
            'Should throw error indicating item is already ready for testing',
        );
        t.end();
    });

    t.test('markReadyForTesting() should throw an error', (t) => {
        t.throws(
            () => readyForTestingState.markReadyForTesting(),
            /🚫 Test Backlog Item already ready for testing/,
            'Should throw error indicating item is already ready for testing',
        );
        t.end();
    });

    t.test('beginTesting() should transition to TestingState', (t) => {
        // Call the method to test
        readyForTestingState.beginTesting();

        // Verify changeState was called with TestingState
        t.ok(mockBacklogItem.changeState.calledOnce, 'Should call changeState once');

        const newState = mockBacklogItem.changeState.getCall(0).args[0];
        t.ok(newState instanceof TestingState, 'Should transition to TestingState');

        // Verify notifyObservers was NOT called (not in the implementation)
        t.notOk(
            mockBacklogItem.notifyObservers.called,
            'Should not call notifyObservers for beginTesting',
        );

        t.end();
    });

    t.test('completeTesting() should throw an error', (t) => {
        t.throws(
            () => readyForTestingState.completeTesting(),
            /🚫 Test Backlog Item testing has not started/,
            'Should throw error indicating testing has not started',
        );
        t.end();
    });

    t.test('markAsDone() should throw an error', (t) => {
        t.throws(
            () => readyForTestingState.markAsDone(),
            /🚫 Test Backlog Item testing has not started/,
            'Should throw error indicating testing has not started',
        );
        t.end();
    });

    t.end();
});
