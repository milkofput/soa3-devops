import { IPipelineVisitor } from '../../../domain/cicd/interfaces/IPipelineVisitor';
import { Pipeline } from '../../../domain/cicd/models/Pipeline';
import { Project } from '../../../domain/common/models/Project';
import { User } from '../../../domain/common/models/User';
import { ISprintState } from '../../../domain/issuemanagement/interfaces/ISprintState';
import { ISprintStrategy } from '../../../domain/issuemanagement/interfaces/ISprintStrategy';
import { BacklogItem } from '../../../domain/issuemanagement/models/BacklogItem';
import { Sprint } from '../../../domain/issuemanagement/models/Sprint';
import { IEvent } from '../../../domain/notifications/interfaces/IEvent';
import { IObserver } from '../../../domain/notifications/interfaces/IObserver';

describe('Sprint', () => {
    let sprint: Sprint;
    let mockObserver: jest.Mocked<IObserver<Sprint>>;
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let mockProject: jest.Mocked<Project>;
    let mockTeamMembers: User[];
    let mockSprintState: jest.Mocked<ISprintState>;
    let mockEvent: IEvent;

    beforeEach(() => {
        sprint = new Sprint(
            'sprint1',
            'Sprint 1',
            new Date(),
            new Date(),
            {} as User,
            {} as ISprintStrategy,
        );

        mockTeamMembers = [{ id: 'user1' } as unknown as User, { id: 'user2' } as unknown as User];

        mockProject = {
            getMembers: jest.fn().mockReturnValue(mockTeamMembers),
        } as unknown as jest.Mocked<Project>;

        mockBacklogItem = {
            getProject: jest.fn().mockReturnValue(mockProject),
            setSprint: jest.fn(),
        } as unknown as jest.Mocked<BacklogItem>;

        mockObserver = {
            update: jest.fn(),
        };

        mockEvent = {} as IEvent;
    });

    test('should add observer', () => {
        sprint.addObserver(mockObserver);
        sprint.notifyObservers(mockEvent);
        expect(mockObserver.update).toHaveBeenCalledWith(sprint, mockEvent);
    });

    test('should not add same observer twice', () => {
        sprint.addObserver(mockObserver);
        sprint.addObserver(mockObserver);
        sprint.notifyObservers(mockEvent);
        expect(mockObserver.update).toHaveBeenCalledTimes(1);
    });

    test('should remove observer', () => {
        sprint.addObserver(mockObserver);
        sprint.removeObserver(mockObserver);
        sprint.notifyObservers(mockEvent);
        expect(mockObserver.update).not.toHaveBeenCalled();
    });

    test('should not fail when removing non-existent observer', () => {
        expect(() => sprint.removeObserver(mockObserver)).not.toThrow();
    });

    describe('getTeamMembers', () => {
        test('Path 1: should return empty array when no backlog items', () => {
            const result = sprint.getTeamMembers();
            expect(result).toEqual([]);
        });

        test("Path 2: should return team members from first backlog item's project", () => {
            sprint.addBacklogItems(mockBacklogItem);

            const result = sprint.getTeamMembers();

            expect(result).toBe(mockTeamMembers);
            expect(mockBacklogItem.getProject).toHaveBeenCalled();
            expect(mockProject.getMembers).toHaveBeenCalled();
        });
    });

    describe('runPipeline', () => {
        test('Path 1: should not run pipeline if releasePipeline is null', () => {
            sprint.addObserver(mockObserver); // Add observer first
            const mockVisitor = {} as unknown as IPipelineVisitor;
            sprint.runPipeline(mockVisitor);
            expect(mockObserver.update).not.toHaveBeenCalled();
        });

        test('Path 2: should run pipeline and notify observers', () => {
            sprint.addObserver(mockObserver); // Add observer first
            const mockVisitor = {} as unknown as IPipelineVisitor;
            const mockPipeline = {
                run: jest.fn(),
            } as unknown as jest.Mocked<Pipeline>;

            (sprint as any).releasePipeline = mockPipeline;

            sprint.runPipeline(mockVisitor);

            expect(mockPipeline.run).toHaveBeenCalledWith(mockVisitor);
            expect(mockObserver.update).toHaveBeenCalledWith(
                sprint,
                expect.objectContaining({
                    eventType: 'PIPELINE_OUTCOME',
                }),
            );
        });
    });
});
