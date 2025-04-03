import { CompositePipelineStep } from '../../../domain/cicd/models/CompositePipelineStep';
import { Pipeline } from '../../../domain/cicd/models/Pipeline';
import { StandardPipelineBuilder } from '../../../domain/cicd/models/StandardPipelineBuilder';
import { Stack } from '../../../domain/cicd/utils/Stack';

describe('StandardPipelineBuilder', () => {
    describe('composite', () => {
        test('should initialize root and stack if root is null', () => {
            // Arrange
            const builder = new StandardPipelineBuilder();

            // Act
            const result = builder.composite('Group1');

            // Assert
            expect(result).toBe(builder);
            expect(builder.getRoot()).not.toBeNull();
            expect(builder.getRoot()).toBeInstanceOf(CompositePipelineStep);
            expect((builder.getRoot() as CompositePipelineStep).getGroupName()).toBe('Group1');
            expect(builder.getPointerStack()).not.toBeNull();
            expect(builder.getPointerStack()?.peek()).toBe(builder.getRoot());
        });

        test('should add child to parent when root and pointerStack exist', () => {
            // Arrange
            const builder = new StandardPipelineBuilder();
            builder.composite('Group1');

            // Act
            const result = builder.composite('Group2');

            // Assert
            expect(result).toBe(builder);
            expect(
                (builder.getRoot() as CompositePipelineStep).getChildrenPipelineSteps().length,
            ).toBe(1);
            expect(
                (
                    (
                        builder.getRoot() as CompositePipelineStep
                    ).getChildrenPipelineSteps()[0] as CompositePipelineStep
                ).getGroupName(),
            ).toBe('Group2');
            expect(builder.getPointerStack()?.size()).toBe(2);
            expect(builder.getPointerStack()?.peek()?.getGroupName()).toBe('Group2');
        });

        test('should work even if stack is empty', () => {
            // Arrange
            const builder = new StandardPipelineBuilder();
            (builder as any).root = new CompositePipelineStep('Root');
            (builder as any).pointerStack = new Stack();

            // Act
            const result = builder.composite('Group');

            // Assert
            expect(result).toBe(builder);
            expect(
                (builder.getRoot() as CompositePipelineStep).getChildrenPipelineSteps().length,
            ).toBe(0);
            expect(builder.getPointerStack()?.size()).toBe(1);
            expect(builder.getPointerStack()?.peek()?.getGroupName()).toBe('Group');
        });

        test('should do nothing but return this when root exists but pointerStack is null', () => {
            // Arrange
            const builder = new StandardPipelineBuilder();
            (builder as any).root = new CompositePipelineStep('Root');
            (builder as any).pointerStack = null;

            // Act
            const originalRoot = (builder as any).root;
            const result = builder.composite('Group4');

            // Assert
            expect(result).toBe(builder);
            expect(builder.getRoot()).toBe(originalRoot);
            expect(
                (builder.getRoot() as CompositePipelineStep).getChildrenPipelineSteps().length,
            ).toBe(0);
            expect(builder.getPointerStack()).toBeNull();
        });
    });

    describe('build', () => {
        test('should throw error if root is null', () => {
            const builder = new StandardPipelineBuilder();
            expect(() => builder.build()).toThrow(
                'Cannot build a pipeline with no steps. Call composite() first.',
            );
        });

        test('return pipeline if root is not null', () => {
            const builder = new StandardPipelineBuilder();
            builder.composite('Group1');
            const pipeline = builder.build();
            expect(pipeline).toBeInstanceOf(Pipeline);
        });
    });

    describe('end', () => {
        test('should pop from stack if not empty', () => {
            const builder = new StandardPipelineBuilder();
            builder.composite('Group1');
            builder.composite('Group2');
            builder.end();
            expect(builder.getPointerStack()?.size()).toBe(1);
            expect(builder.getPointerStack()?.peek()?.getGroupName()).toBe('Group1');
        });

        test('should do nothing if stack is empty', () => {
            const builder = new StandardPipelineBuilder();
            builder.end();
            expect(builder.getPointerStack()).toBeUndefined();
        });
    });

    describe('command', () => {
        test('should add command to the current composite step', () => {
            const builder = new StandardPipelineBuilder();
            builder.composite('Group1');
            builder.command('Command1');
            expect(
                (builder.getRoot() as CompositePipelineStep).getChildrenPipelineSteps().length,
            ).toBe(1);
        });

        test('should do nothing if stack is empty', () => {
            const builder = new StandardPipelineBuilder();
            builder.command('Command1');
            expect(builder.getPointerStack()).toBeUndefined();
        });
    });
});
