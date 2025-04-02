import tap from 'tap';
import sinon from 'sinon';
import { DoingState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoingState';
import { ReadyForTestingState } from '../../../../domain/issuemanagement/models/backlogitemstates/ReadyForTestingState';
import { BacklogStatusChangedEvent } from '../../../../domain/notifications/models/events/BacklogStatusChangedEvent';

tap.test('DoingState', (t) => {
    let mockBacklogItem: any;
    let doingState: DoingState;

    t.beforeEach(() => {
        // Create a mock backlog item
        mockBacklogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            changeState: sinon.stub(),
            notifyObservers: sinon.stub(),
        };

        // Create a DoingState instance with the mock
        doingState = new DoingState(mockBacklogItem);
    });

    t.afterEach(() => {
        // Clean up sinon stubs
        sinon.restore();
    });

    t.test('moveToBacklog() should throw an error', (t) => {
        t.throws(
            () => doingState.moveToBacklog(),
            /🚫 Test Backlog Item can't move while in progress/,
            'Should throw error indicating item cannot move while in progress',
        );
        t.end();
    });

    t.test('startDevelopment() should throw an error', (t) => {
        t.throws(
            () => doingState.startDevelopment(),
            /🚫 Test Backlog Item already in progress/,
            'Should throw error indicating item is already in progress',
        );
        t.end();
    });

    t.test(
        'markReadyForTesting() should transition to ReadyForTestingState and notify observers',
        (t) => {
            // Call the method to test
            doingState.markReadyForTesting();

            // Verify changeState was called with ReadyForTestingState
            t.ok(mockBacklogItem.changeState.calledOnce, 'Should call changeState once');

            const newState = mockBacklogItem.changeState.getCall(0).args[0];
            t.ok(
                newState instanceof ReadyForTestingState,
                'Should transition to ReadyForTestingState',
            );

            // Verify notifyObservers was called with BacklogStatusChangedEvent
            t.ok(mockBacklogItem.notifyObservers.calledOnce, 'Should call notifyObservers once');

            const event = mockBacklogItem.notifyObservers.getCall(0).args[0];
            t.ok(
                event instanceof BacklogStatusChangedEvent,
                'Should notify with BacklogStatusChangedEvent',
            );
            t.equal(
                event.state.constructor.name,
                'ReadyForTestingState',
                'Event should contain ReadyForTestingState',
            );
            t.equal(event.backlogItem, mockBacklogItem, 'Event should reference the backlog item');

            t.end();
        },
    );

    t.test('beginTesting() should throw an error', (t) => {
        t.throws(
            () => doingState.beginTesting(),
            /🚫 Test Backlog Item has not been tested/,
            'Should throw error indicating item has not been tested',
        );
        t.end();
    });

    t.test('completeTesting() should throw an error', (t) => {
        t.throws(
            () => doingState.completeTesting(),
            /🚫 Test Backlog Item has not been tested/,
            'Should throw error indicating item has not been tested',
        );
        t.end();
    });

    t.test('markAsDone() should throw an error', (t) => {
        t.throws(
            () => doingState.markAsDone(),
            /🚫 Test Backlog Item has not been tested/,
            'Should throw error indicating item has not been tested',
        );
        t.end();
    });

    t.end();
});
