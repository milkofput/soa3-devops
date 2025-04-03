import { ReleaseSprintStrategy } from '../../../../domain/issuemanagement/models/sprintstrategies/ReleaseSprintStrategy';
import { FinalizedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinalizedSprintState';
import { PipelineStatusEnum } from '../../../../domain/cicd/enums/PipelineStatusEnum';

describe('ReleaseSprintStrategy', () => {
    let sprintMock: any;
    let pipelineMock: any;
    let visitorMock: any;
    let releaseStrategy: ReleaseSprintStrategy;

    beforeEach(() => {
        pipelineMock = {
            getStatus: jest.fn(),
        };

        sprintMock = {
            getName: jest.fn().mockReturnValue('Test Sprint'),
            runPipeline: jest.fn(),
            getReleasePipeline: jest.fn(),
            changeState: jest.fn(),
        };

        visitorMock = {};
        releaseStrategy = new ReleaseSprintStrategy(visitorMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('(UT-F10-3) should run the pipeline and transition to FinalizedSprintState if pipeline succeeds', () => {
        pipelineMock.getStatus.mockReturnValue(PipelineStatusEnum.SUCCEEDED);
        sprintMock.getReleasePipeline.mockReturnValue(pipelineMock);

        releaseStrategy.sprintFinishStrategy(sprintMock);

        expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
        expect(sprintMock.changeState).toHaveBeenCalled();

        const stateArg = sprintMock.changeState.mock.calls[0][0];
        expect(stateArg).toBeInstanceOf(FinalizedSprintState);
    });

    test('(UT-F5-3) should throw an error if the pipeline fails', () => {
        pipelineMock.getStatus.mockReturnValue(PipelineStatusEnum.FAILED);
        sprintMock.getReleasePipeline.mockReturnValue(pipelineMock);

        expect(() => releaseStrategy.sprintFinishStrategy(sprintMock)).toThrow(/Pipeline failed/);
        expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
        expect(sprintMock.changeState).not.toHaveBeenCalled();

        pipelineMock.getStatus.mockReturnValue(PipelineStatusEnum.SUCCEEDED);
        releaseStrategy.sprintFinishStrategy(sprintMock);
        expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
        expect(sprintMock.changeState).toHaveBeenCalled();
    });

    test('should handle null or undefined release pipeline (no state transition)', () => {
        sprintMock.getReleasePipeline.mockReturnValue(null);

        expect(() => releaseStrategy.sprintFinishStrategy(sprintMock)).toThrow(
            /No release pipeline found/,
        );
        expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
        expect(sprintMock.changeState).not.toHaveBeenCalled();
    });

    describe('UT-F10-4: Pipeline error handling', () => {
        test('should allow retrying after pipeline failure', () => {
            // First attempt - Pipeline fails
            pipelineMock.getStatus
                .mockReturnValueOnce(PipelineStatusEnum.FAILED) // First call fails
                .mockReturnValueOnce(PipelineStatusEnum.SUCCEEDED); // Second call succeeds

            sprintMock.getReleasePipeline.mockReturnValue(pipelineMock);

            // First attempt should fail
            expect(() => {
                releaseStrategy.sprintFinishStrategy(sprintMock);
            }).toThrow('🚫 Pipeline failed, sprint is not released');

            // Verify pipeline was run but state wasn't changed
            expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
            expect(sprintMock.changeState).not.toHaveBeenCalled();

            // Reset call count for runPipeline
            sprintMock.runPipeline.mockClear();

            // Second attempt should succeed
            releaseStrategy.sprintFinishStrategy(sprintMock);

            // Verify pipeline was run again and state was changed
            expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
            expect(sprintMock.changeState).toHaveBeenCalled();

            const stateArg = sprintMock.changeState.mock.calls[0][0];
            expect(stateArg).toBeInstanceOf(FinalizedSprintState);
        });

        test('should allow canceling after pipeline failure', () => {
            pipelineMock.getStatus.mockReturnValue(PipelineStatusEnum.FAILED);
            sprintMock.getReleasePipeline.mockReturnValue(pipelineMock);

            // Attempt should fail
            expect(() => {
                releaseStrategy.sprintFinishStrategy(sprintMock);
            }).toThrow('🚫 Pipeline failed, sprint is not released');

            // Verify pipeline was run but state wasn't changed
            expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
            expect(sprintMock.changeState).not.toHaveBeenCalled();
        });
    });
});
