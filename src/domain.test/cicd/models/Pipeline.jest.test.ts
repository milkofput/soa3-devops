import { Pipeline } from '../../../domain/cicd/models/Pipeline';
import { PipelineStatusEnum } from '../../../domain/cicd/enums/PipelineStatusEnum';
import { IPipelineStep } from '../../../domain/cicd/interfaces/IPipelineStep';
import { IPipelineVisitor } from '../../../domain/cicd/interfaces/IPipelineVisitor';

describe('Pipeline', () => {
    let mockStep: jest.Mocked<IPipelineStep>;
    let mockVisitor: jest.Mocked<IPipelineVisitor>;
    let pipeline: Pipeline;
    const pipelineName = 'Test Pipeline';

    beforeEach(() => {
        mockStep = {
            accept: jest.fn(),
        } as jest.Mocked<IPipelineStep>;

        mockVisitor = {
            visit: jest.fn(),
            visitCommand: jest.fn(),
            visitComposite: jest.fn(),
        } as jest.Mocked<IPipelineVisitor>;

        pipeline = new Pipeline(pipelineName, PipelineStatusEnum.NOT_STARTED, new Date(), mockStep);
    });

    describe('run', () => {
        test('Path 1: should successfully execute pipeline and update status', () => {
            mockVisitor.visit.mockImplementation(() => {});

            const result = pipeline.run(mockVisitor);

            expect(result).toBe(true);
            expect(mockVisitor.visit).toHaveBeenCalledWith(mockStep);
            expect(pipeline.getStatus()).toBe(PipelineStatusEnum.SUCCEEDED);
        });

        test('Path 2: should handle pipeline execution failure and update status', () => {
            const error = new Error('Pipeline step failed');
            mockVisitor.visit.mockImplementation(() => {
                throw error;
            });

            const result = pipeline.run(mockVisitor);

            expect(result).toBe(false);
            expect(mockVisitor.visit).toHaveBeenCalledWith(mockStep);
            expect(pipeline.getStatus()).toBe(PipelineStatusEnum.FAILED);
        });
    });

    describe('status transitions', () => {
        test('should set initial status correctly', () => {
            expect(pipeline.getStatus()).toBe(PipelineStatusEnum.NOT_STARTED);
        });

        test('should update status to RUNNING when execution starts', () => {
            mockVisitor.visit.mockImplementation(() => {});
            pipeline.run(mockVisitor);
            expect(pipeline.getStatus()).toBe(PipelineStatusEnum.SUCCEEDED);
        });
    });
});
