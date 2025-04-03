import { ReleasePipelineBuilder } from '../../../domain/cicd/models/ReleasePipelineBuilder';
import { StandardPipelineBuilder } from '../../../domain/cicd/models/StandardPipelineBuilder';
import { Pipeline } from '../../../domain/cicd/models/Pipeline';
import { PipelineStatusEnum } from '../../../domain/cicd/enums/PipelineStatusEnum';
import { CompositePipelineStep } from '../../../domain/cicd/models/CompositePipelineStep';

jest.mock('../../../domain/cicd/models/StandardPipelineBuilder');

describe('ReleasePipelineBuilder', () => {
    let builder: ReleasePipelineBuilder;
    let mockStandardBuilder: jest.Mocked<StandardPipelineBuilder>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockStandardBuilder = {
            composite: jest.fn().mockReturnThis(),
            command: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis(),
            build: jest.fn(),
        } as unknown as jest.Mocked<StandardPipelineBuilder>;

        (StandardPipelineBuilder as jest.Mock).mockImplementation(() => mockStandardBuilder);

        builder = new ReleasePipelineBuilder('Test Sprint');
    });

    describe('constructor', () => {
        test('should create pipeline with correct name and root composite', () => {
            expect(StandardPipelineBuilder).toHaveBeenCalled();
            expect(mockStandardBuilder.composite).toHaveBeenCalledWith(
                'Test Sprint Release Pipeline',
            );
        });
    });

    test('(UT-F10-1) Creating a pipeline with Sources, Package, Build, Test, Analyze, Deploy, Utility', () => {
        builder.addSource('Source Command 1', 'Source Command 2');
        builder.addPackage('Package Command 1', 'Package Command 2');
        builder.addBuild('Build Command 1', 'Build Command 2');
        builder.addTest('Test Command 1', 'Test Command 2');
        builder.addAnalyze('Analyze Command 1', 'Analyze Command 2');
        builder.addDeploy('Deploy Command 1', 'Deploy Command 2');
        builder.addUtility('Utility Command 1', 'Utility Command 2');
        builder.build();

        expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Source');
        expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Package');
        expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Build');
        expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Test');
        expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Analyze');
        expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Deploy');
        expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Utility');
    });

    describe('addStage', () => {
        test('should add stage with commands correctly', () => {
            const commands = ['cmd1', 'cmd2'];
            builder.addSource(...commands);

            expect(mockStandardBuilder.composite).toHaveBeenCalledWith('Source');
            commands.forEach((cmd) => {
                expect(mockStandardBuilder.command).toHaveBeenCalledWith(cmd);
            });
            expect(mockStandardBuilder.end).toHaveBeenCalled();
        });
    });

    describe('build', () => {
        test('should finalize pipeline build correctly', () => {
            const mockPipeline = new Pipeline(
                'Test Pipeline',
                PipelineStatusEnum.NOT_STARTED,
                new Date(),
                new CompositePipelineStep('root'),
            );
            mockStandardBuilder.build.mockReturnValue(mockPipeline);

            const result = builder.build();

            expect(mockStandardBuilder.end).toHaveBeenCalled();
            expect(mockStandardBuilder.build).toHaveBeenCalled();
            expect(result).toBe(mockPipeline);
        });
    });
});
