import { IPipelineVisitor } from '../../../domain/cicd/interfaces/IPipelineVisitor';
import { Pipeline } from '../../../domain/cicd/models/Pipeline';
import { UserRoleEnum } from '../../../domain/common/enums/UserRoleEnum';
import { Project } from '../../../domain/common/models/Project';
import { User } from '../../../domain/common/models/User';
import { ISprintState } from '../../../domain/issuemanagement/interfaces/ISprintState';
import { ISprintStrategy } from '../../../domain/issuemanagement/interfaces/ISprintStrategy';
import { BacklogItem } from '../../../domain/issuemanagement/models/BacklogItem';
import { Sprint } from '../../../domain/issuemanagement/models/Sprint';
import { CancelledSprintState } from '../../../domain/issuemanagement/models/sprintstates/CancelledSprintState';
import { CreatedSprintState } from '../../../domain/issuemanagement/models/sprintstates/CreatedSprintState';
import { FinalizedSprintState } from '../../../domain/issuemanagement/models/sprintstates/FinalizedSprintState';
import { FinishedSprintState } from '../../../domain/issuemanagement/models/sprintstates/FinishedSprintState';
import { StartedSprintState } from '../../../domain/issuemanagement/models/sprintstates/StartedSprintState';
import { ReviewSprintStrategy } from '../../../domain/issuemanagement/models/sprintstrategies/ReviewSprintStrategy';
import { IEvent } from '../../../domain/notifications/interfaces/IEvent';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';
import { IObserver } from '../../../domain/notifications/interfaces/IObserver';

describe('Sprint', () => {
    let sprint: Sprint;
    let mockObserver: jest.Mocked<IObserver<Sprint>>;
    let mockBacklogItem: jest.Mocked<BacklogItem>;
    let mockProject: jest.Mocked<Project>;
    let mockTeamMembers: User[];
    let mockSprintState: jest.Mocked<ISprintState>;
    let mockScrumMaster: User;
    let mockStrategy: jest.Mocked<ISprintStrategy>;
    let mockNotificationChannel: jest.Mocked<INotificationChannel>;
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

        mockNotificationChannel = {
            sendNotification: jest.fn(),
        } as jest.Mocked<INotificationChannel>;

        mockScrumMaster = new User(
            'sm1',
            'Scrum Master',
            'sm@test.com',
            UserRoleEnum.SCRUMMASTER,
            mockNotificationChannel,
        );

        mockStrategy = {
            sprintFinishStrategy: jest.fn(),
        } as jest.Mocked<ISprintStrategy>;

        mockEvent = {} as IEvent;
    });

    test('(UT-F4-1) Create a sprint', () => {
        const sprint = new Sprint(
            'sprint-1',
            'Sprint 1',
            new Date('2025-01-01'),
            new Date('2025-01-14'),
            mockScrumMaster,
            mockStrategy,
        );

        expect(sprint.getName()).toBe('Sprint 1');
        expect(sprint.getStartDate().toISOString().split('T')[0]).toBe('2025-01-01');
        expect(sprint.getEndDate().toISOString().split('T')[0]).toBe('2025-01-14');
        expect(sprint.getState()).toBeInstanceOf(CreatedSprintState);
    });

    test('(UT-F4-2) Link backlog item to sprint', () => {
        const sprint = new Sprint(
            'sprint-1',
            'Sprint 1',
            new Date('2025-01-01'),
            new Date('2025-01-14'),
            mockScrumMaster,
            mockStrategy,
        );

        const backlogItem = new BacklogItem(
            'item-1',
            'Inloggen',
            'Login functionaliteit',
            5,
            {} as Project,
        );

        sprint.addBacklogItems(backlogItem);
        expect(sprint.getBacklogItems()).toContain(backlogItem);
        expect(backlogItem.getSprint()).toBe(sprint);
    });

    test('(UT-F11-1) (UT-F11-2) Cancel sprint', () => {
        const sprint = new Sprint(
            'sprint-1',
            'Sprint 1',
            new Date('2025-01-01'),
            new Date('2025-01-14'),
            mockScrumMaster,
            mockStrategy,
        );
        sprint.start();

        sprint.cancel();
        expect(sprint.getState()).toBeInstanceOf(CancelledSprintState);
    });

    test('(UT-F11-3) Finalized sprint cannot be canceled', () => {
        let emptyFinishStrategy = {
            sprintFinishStrategy: jest.fn(),
        } as unknown as ISprintStrategy;
        const sprint = new Sprint(
            'sprint-1',
            'Sprint 1',
            new Date('2025-01-01'),
            new Date('2025-01-14'),
            mockScrumMaster,
            emptyFinishStrategy,
        );
        emptyFinishStrategy.sprintFinishStrategy = jest.fn(() => {
            sprint.changeState(new FinalizedSprintState(sprint));
        });
        sprint.start();
        sprint.finish();
        sprint.finalize();

        expect(sprint.getState()).toBeInstanceOf(FinalizedSprintState);

        expect(() => sprint.cancel()).toThrow(/already finalized/);
    });

    test('(UT-F10-2) Pipeline can be run at end of (=finished) release sprint', () => {
        const sprint = new Sprint(
            'sprint-1',
            'Sprint 1',
            new Date('2025-01-01'),
            new Date('2025-01-14'),
            mockScrumMaster,
            mockStrategy,
        );
        let mockPipeline = {
            run: jest.fn(),
        } as unknown as Pipeline;
        sprint.start();
        sprint.finish();
        sprint.setPipeline(mockPipeline);
        sprint.runPipeline({} as IPipelineVisitor);
        expect(mockPipeline.run).toHaveBeenCalled();
    });

    test('(UT-F5-1) can create release sprint', () => {
        const sprint = new Sprint(
            'sprint-1',
            'Sprint 1',
            new Date('2025-01-01'),
            new Date('2025-01-14'),
            mockScrumMaster,
            mockStrategy,
        );
        expect(sprint.getState()).toBeInstanceOf(CreatedSprintState);
        expect(sprint.getStrategy()).toBe(mockStrategy);
        expect(sprint.getScrumMaster()).toBe(mockScrumMaster);
    });

    test('(UT-F5-2) can create review sprint', () => {
        const sprint = new Sprint(
            'sprint-1',
            'Sprint 1',
            new Date('2025-01-01'),
            new Date('2025-01-14'),
            mockScrumMaster,
            new ReviewSprintStrategy(),
        );
        expect(sprint.getState()).toBeInstanceOf(CreatedSprintState);
        expect(sprint.getStrategy()).toBeInstanceOf(ReviewSprintStrategy);
        expect(sprint.getScrumMaster()).toBe(mockScrumMaster);
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
