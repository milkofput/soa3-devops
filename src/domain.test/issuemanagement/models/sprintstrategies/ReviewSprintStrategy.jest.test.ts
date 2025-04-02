import { ReviewSprintStrategy } from '../../../../domain/issuemanagement/models/sprintstrategies/ReviewSprintStrategy';
import { FinalizedSprintState } from '../../../../domain/issuemanagement/models/sprintstates/FinalizedSprintState';
import { ISprintState } from '../../../../domain/issuemanagement/interfaces/ISprintState';
import { Sprint } from '../../../../domain/issuemanagement/models/Sprint';
import { ReviewDocument } from '../../../../domain/issuemanagement/models/ReviewDocument';

describe('ReviewSprintStrategy', () => {
    let sprintMock: jest.Mocked<Sprint>;
    let documentMock: jest.Mocked<ReviewDocument>;
    let reviewStrategy: ReviewSprintStrategy;

    beforeEach(() => {
        sprintMock = {
            getName: jest.fn().mockReturnValue('Test Sprint'),
            getDocument: jest.fn(),
            changeState: jest.fn(),
        } as any;

        documentMock = {
            getName: jest.fn().mockReturnValue('Test Document'),
            getContent: jest.fn().mockReturnValue('Test Content'),
        } as any;

        reviewStrategy = new ReviewSprintStrategy();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should transition to FinalizedSprintState if a document is present', () => {
        // Arrange
        sprintMock.getDocument.mockReturnValue(documentMock);

        // Act
        reviewStrategy.sprintFinishStrategy(sprintMock);

        // Assert
        expect(sprintMock.changeState).toHaveBeenCalled();

        // Check that the argument passed to changeState is an instance of FinalizedSprintState
        const stateArg = sprintMock.changeState.mock.calls[0][0];
        expect(stateArg).toBeInstanceOf(FinalizedSprintState);
    });

    test('should throw an error if no document is present', () => {
        // Arrange
        sprintMock.getDocument.mockReturnValue(undefined);

        // Act & Assert
        expect(() => reviewStrategy.sprintFinishStrategy(sprintMock)).toThrow(
            /Document is required/,
        );
        expect(sprintMock.changeState).not.toHaveBeenCalled();
    });
});
