import tap from 'tap';
import sinon from 'sinon';
import { DoneState } from '../../../../domain/issuemanagement/models/backlogitemstates/DoneState';

tap.test('DoneState', (t) => {
    let mockBacklogItem: any;
    let doneState: DoneState;

    t.beforeEach(() => {
        // Create a mock backlog item
        mockBacklogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            changeState: sinon.stub(),
            notifyObservers: sinon.stub(),
        };

        // Create a DoneState instance with the mock
        doneState = new DoneState(mockBacklogItem);
    });

    t.afterEach(() => {
        // Clean up sinon stubs
        sinon.restore();
    });

    t.test('moveToBacklog() should throw an error', (t) => {
        t.throws(
            () => doneState.moveToBacklog(),
            /🚫 Test Backlog Item already done/,
            'Should throw error indicating item is already done',
        );
        t.end();
    });

    t.test('startDevelopment() should throw an error', (t) => {
        t.throws(
            () => doneState.startDevelopment(),
            /🚫 Test Backlog Item already done/,
            'Should throw error indicating item is already done',
        );
        t.end();
    });

    t.test('markReadyForTesting() should throw an error', (t) => {
        t.throws(
            () => doneState.markReadyForTesting(),
            /🚫 Test Backlog Item already done/,
            'Should throw error indicating item is already done',
        );
        t.end();
    });

    t.test('beginTesting() should throw an error', (t) => {
        t.throws(
            () => doneState.beginTesting(),
            /🚫 Test Backlog Item already done/,
            'Should throw error indicating item is already done',
        );
        t.end();
    });

    t.test('completeTesting() should throw an error', (t) => {
        t.throws(
            () => doneState.completeTesting(),
            /🚫 Test Backlog Item already done/,
            'Should throw error indicating item is already done',
        );
        t.end();
    });

    t.test('markAsDone() should throw an error', (t) => {
        t.throws(
            () => doneState.markAsDone(),
            /🚫 Test Backlog Item already done/,
            'Should throw error indicating item is already done',
        );
        t.end();
    });

    t.test('should not call any state-changing methods', (t) => {
        // Test that no methods on the backlog item are called
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

        // Verify no methods were called on the backlog item
        t.notOk(mockBacklogItem.changeState.called, 'Should not call changeState for any method');
        t.notOk(
            mockBacklogItem.notifyObservers.called,
            'Should not call notifyObservers for any method',
        );

        t.end();
    });

    t.end();
});
