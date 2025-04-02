import tap from 'tap';
import sinon from 'sinon';
import { TestedState } from '../../../../domain/issuemanagement/models/backlogitemstates/TestedState';
import { TodoState } from '../../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { BacklogStatusChangedEvent } from '../../../../domain/notifications/models/events/BacklogStatusChangedEvent';
import { DoneState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoneState';
import { ActivityStatusEnum } from '../../../../domain/issuemanagement/enums/ActivityStatusEnum';

tap.test('TestedState', (t) => {
    let mockBacklogItem: any;
    let testedState: TestedState;
    let mockActivities: any[];

    t.beforeEach(() => {
        // Create mock activities with DONE status
        mockActivities = [
            { getStatus: sinon.stub().returns(ActivityStatusEnum.DONE) },
            { getStatus: sinon.stub().returns(ActivityStatusEnum.DONE) },
        ];

        // Create a mock backlog item
        mockBacklogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            changeState: sinon.stub(),
            notifyObservers: sinon.stub(),
            getActivities: sinon.stub().returns(mockActivities),
        };

        // Create a TestedState instance with the mock
        testedState = new TestedState(mockBacklogItem);
    });

    t.afterEach(() => {
        // Clean up sinon stubs
        sinon.restore();
    });

    t.test('moveToBacklog() should transition to TodoState and notify observers', (t) => {
        // Call the method to test
        testedState.moveToBacklog();

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
            () => testedState.startDevelopment(),
            /🚫 Test Backlog Item already tested/,
            'Should throw error indicating item is already tested',
        );
        t.end();
    });

    t.test(
        'markReadyForTesting() should transition to TestedState (self-transition) and notify observers',
        (t) => {
            // Call the method to test
            testedState.markReadyForTesting();

            // Verify changeState was called with TestedState (self-transition)
            t.ok(mockBacklogItem.changeState.calledOnce, 'Should call changeState once');

            const newState = mockBacklogItem.changeState.getCall(0).args[0];
            t.ok(
                newState instanceof TestedState,
                'Should transition to TestedState (self-transition)',
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
                'TestedState',
                'Event should contain TestedState',
            );

            t.end();
        },
    );

    t.test('beginTesting() should throw an error', (t) => {
        t.throws(
            () => testedState.beginTesting(),
            /🚫 Test Backlog Item already tested/,
            'Should throw error indicating item is already tested',
        );
        t.end();
    });

    t.test('completeTesting() should throw an error', (t) => {
        t.throws(
            () => testedState.completeTesting(),
            /🚫 Test Backlog Item already tested/,
            'Should throw error indicating item is already tested',
        );
        t.end();
    });

    t.test('markAsDone() should transition to DoneState when all activities are done', (t) => {
        // Call the method to test
        testedState.markAsDone();

        // Verify changeState was called with DoneState
        t.ok(mockBacklogItem.changeState.calledOnce, 'Should call changeState once');

        const newState = mockBacklogItem.changeState.getCall(0).args[0];
        t.ok(newState instanceof DoneState, 'Should transition to DoneState');

        // Verify getActivities was called to check activity status
        t.ok(mockBacklogItem.getActivities.calledOnce, 'Should call getActivities to check status');

        // Verify notifyObservers was NOT called (not in the implementation)
        t.notOk(
            mockBacklogItem.notifyObservers.called,
            'Should not call notifyObservers for markAsDone',
        );

        t.end();
    });

    t.test('markAsDone() should throw error when some activities are not done', (t) => {
        // Create activities with mixed status
        const mixedActivities = [
            { getStatus: sinon.stub().returns(ActivityStatusEnum.DONE) },
            { getStatus: sinon.stub().returns(ActivityStatusEnum.TODO) },
        ];

        // Override the getActivities method to return activities with mixed status
        mockBacklogItem.getActivities.returns(mixedActivities);

        // Call should throw error
        t.throws(
            () => testedState.markAsDone(),
            /🚫 Test Backlog Item not all activities are done/,
            'Should throw error when not all activities are done',
        );

        // Verify getActivities was called
        t.ok(mockBacklogItem.getActivities.calledOnce, 'Should call getActivities to check status');

        // Verify changeState was NOT called
        t.notOk(
            mockBacklogItem.changeState.called,
            'Should not call changeState when activities are not all done',
        );

        t.end();
    });

    t.test('markAsDone() should transition to DoneState when there are no activities', (t) => {
        // Override the getActivities method to return an empty array
        mockBacklogItem.getActivities.returns([]);

        // Call the method to test
        testedState.markAsDone();

        // Verify changeState was called with DoneState
        t.ok(
            mockBacklogItem.changeState.calledOnce,
            'Should call changeState once when no activities exist',
        );

        const newState = mockBacklogItem.changeState.getCall(0).args[0];
        t.ok(
            newState instanceof DoneState,
            'Should transition to DoneState when no activities exist',
        );

        t.end();
    });

    t.end();
});
