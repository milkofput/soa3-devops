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

    test('should run the pipeline and transition to FinalizedSprintState if pipeline succeeds', () => {
        pipelineMock.getStatus.mockReturnValue(PipelineStatusEnum.SUCCEEDED);
        sprintMock.getReleasePipeline.mockReturnValue(pipelineMock);

        releaseStrategy.sprintFinishStrategy(sprintMock);

        expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
        expect(sprintMock.changeState).toHaveBeenCalled();

        const stateArg = sprintMock.changeState.mock.calls[0][0];
        expect(stateArg).toBeInstanceOf(FinalizedSprintState);
    });

    test('should throw an error if the pipeline fails', () => {
        pipelineMock.getStatus.mockReturnValue(PipelineStatusEnum.FAILED);
        sprintMock.getReleasePipeline.mockReturnValue(pipelineMock);

        expect(() => releaseStrategy.sprintFinishStrategy(sprintMock)).toThrow(/Pipeline failed/);
        expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
        expect(sprintMock.changeState).not.toHaveBeenCalled();
    });

    test('should handle null or undefined release pipeline (no state transition)', () => {
        sprintMock.getReleasePipeline.mockReturnValue(null);

        expect(() => releaseStrategy.sprintFinishStrategy(sprintMock)).toThrow(
            /No release pipeline found/,
        );
        expect(sprintMock.runPipeline).toHaveBeenCalledWith(visitorMock);
        expect(sprintMock.changeState).not.toHaveBeenCalled();
    });
});
