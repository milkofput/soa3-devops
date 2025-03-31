import tap from 'tap';
import sinon from 'sinon';
import { ReviewSprintStrategy } from '../../../../domain/issuemanagement/models/sprintstrategies/ReviewSprintStrategy';
import { FinalizedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinalizedSprintState';
import { ISprintState } from '../../../../domain/issuemanagement/interfaces/ISprintState';

tap.test('ReviewSprintStrategy', (t) => {
    let sprintMock: any;
    let reviewStrategy: ReviewSprintStrategy;

    t.beforeEach(() => {
        sprintMock = {
            getName: sinon.stub().returns('Test Sprint'),
            getDocument: sinon.stub(),
            setState: sinon.stub(),
        };
        reviewStrategy = new ReviewSprintStrategy();
    });

    t.afterEach(() => {
        sinon.restore();
    });

    t.test('should transition to FinalizedSprintState if a document is present', (t) => {
        sprintMock.getDocument.returns(true);

        reviewStrategy.sprintFinishStrategy(sprintMock);

        t.ok(
            sprintMock.setState.calledWithMatch(
                (state: ISprintState) => state instanceof FinalizedSprintState,
            ),
            'Should transition to FinalizedSprintState',
        );
        t.end();
    });

    t.test('should throw an error if no document is present', (t) => {
        sprintMock.getDocument.returns(false);

        t.throws(
            () => reviewStrategy.sprintFinishStrategy(sprintMock),
            /Document is required/,
            'Should throw an error indicating a document is required',
        );
        t.notOk(
            sprintMock.setState.called,
            'Should not transition to FinalizedSprintState if no document is present',
        );
        t.end();
    });

    t.end();
});
