import tap from 'tap';
import sinon from 'sinon';
import { ReleaseSprintStrategy } from '../../../../domain/issuemanagement/models/sprintstrategies/ReleaseSprintStrategy';
import { FinalizedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinalizedSprintState';
import { PipelineStatusEnum } from '../../../../domain/cicd/enums/PipelineStatusEnum';

tap.test('ReleaseSprintStrategy', (t) => {
    let sprintMock: any;
    let pipelineMock: any;
    let visitorMock: any;
    let releaseStrategy: ReleaseSprintStrategy;

    t.beforeEach(() => {
        pipelineMock = {
            getStatus: sinon.stub(),
        };
        sprintMock = {
            getName: sinon.stub().returns('Test Sprint'),
            runPipeline: sinon.stub(),
            getReleasePipeline: sinon.stub(),
            setState: sinon.stub(),
        };
        visitorMock = {};
        releaseStrategy = new ReleaseSprintStrategy(visitorMock);
    });

    t.afterEach(() => {
        sinon.restore();
    });

    t.test(
        'should run the pipeline and transition to FinalizedSprintState if pipeline succeeds',
        (t) => {
            pipelineMock.getStatus.returns(PipelineStatusEnum.SUCCEEDED);
            sprintMock.getReleasePipeline.returns(pipelineMock);

            releaseStrategy.sprintFinishStrategy(sprintMock);

            t.ok(
                sprintMock.runPipeline.calledWith(visitorMock),
                'Should run the pipeline with the visitor',
            );
            t.ok(
                sprintMock.setState.calledWithMatch(
                    (state: any) => state instanceof FinalizedSprintState,
                ),
                'Should transition to FinalizedSprintState',
            );
            t.end();
        },
    );

    t.test('should throw an error if the pipeline fails', (t) => {
        pipelineMock.getStatus.returns(PipelineStatusEnum.FAILED);
        sprintMock.getReleasePipeline.returns(pipelineMock);

        t.throws(
            () => releaseStrategy.sprintFinishStrategy(sprintMock),
            /Pipeline failed/,
            'Should throw an error indicating the pipeline failed',
        );
        t.ok(
            sprintMock.runPipeline.calledWith(visitorMock),
            'Should run the pipeline with the visitor',
        );
        t.notOk(
            sprintMock.setState.called,
            'Should not transition to FinalizedSprintState if pipeline fails',
        );
        t.end();
    });

    t.test('should handle null or undefined release pipeline (no state transition)', (t) => {
        sprintMock.getReleasePipeline.returns(null);

        t.throws(
            () => releaseStrategy.sprintFinishStrategy(sprintMock),
            /No release pipeline found/,
            'Should throw an error indicating no release pipeline found',
        );

        t.ok(
            sprintMock.runPipeline.calledWith(visitorMock),
            'Should run the pipeline with the visitor',
        );
        t.notOk(
            sprintMock.setState.called,
            'Should not transition to FinalizedSprintState if release pipeline is null',
        );
        t.end();
    });

    t.end();
});
