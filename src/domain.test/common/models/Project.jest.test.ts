import { Project } from '../../../domain/common/models/Project';
import { ProductBacklog } from '../../../domain/common/models/ProductBacklog';
import { User } from '../../../domain/common/models/User';
import { BacklogItem } from '../../../domain/issuemanagement/models/BacklogItem';
import { Sprint } from '../../../domain/issuemanagement/models/Sprint';
import { UserRoleEnum } from '../../../domain/common/enums/UserRoleEnum';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';

describe('Project', () => {
    let project: Project;
    let mockProductOwner: User;
    let mockBacklog: jest.Mocked<ProductBacklog>;
    let mockNotificationChannel: jest.Mocked<INotificationChannel>;

    beforeEach(() => {
        mockNotificationChannel = {
            sendNotification: jest.fn(),
        } as jest.Mocked<INotificationChannel>;

        mockProductOwner = new User(
            'po1',
            'Product Owner',
            'po@test.com',
            UserRoleEnum.PRODUCTOWNER,
            mockNotificationChannel,
        );

        mockBacklog = {
            addBacklogItems: jest.fn(),
            removeBacklogItems: jest.fn(),
        } as unknown as jest.Mocked<ProductBacklog>;

        project = new Project('p1', 'Test Project', mockBacklog, mockProductOwner);
    });

    describe('UT-F1-1: Project aanmaken', () => {
        test('Een project kan worden aangemaakt met naam “Testproject”, beschrijving “Dit is een project” en id “test-id”. Deze zijn later uit te lezen.', () => {
            const project = new Project(
                'test-id',
                'Testproject',
                mockBacklog,
                mockProductOwner,
                'Dit is een project',
            );
            expect(project.getId()).toBe('test-id');
            expect(project.getName()).toBe('Testproject');
            expect(project.getDescription()).toBe('Dit is een project');
        });
    });

    describe('addMembers', () => {
        test('should add single member', () => {
            const member = new User(
                'm1',
                'Member 1',
                'member1@test.com',
                UserRoleEnum.DEVELOPER,
                mockNotificationChannel,
            );

            project.addMembers(member);

            expect(project.getMembers()).toContain(member);
            expect(project.getMembers()).toHaveLength(1);
        });

        test('should add multiple members', () => {
            const member1 = new User(
                'm1',
                'Member 1',
                'member1@test.com',
                UserRoleEnum.DEVELOPER,
                mockNotificationChannel,
            );
            const member2 = new User(
                'm2',
                'Member 2',
                'member2@test.com',
                UserRoleEnum.TESTER,
                mockNotificationChannel,
            );

            project.addMembers(member1, member2);

            expect(project.getMembers()).toContain(member1);
            expect(project.getMembers()).toContain(member2);
            expect(project.getMembers()).toHaveLength(2);
        });
    });

    describe('addSprint', () => {
        test('should add sprint to project', () => {
            const mockSprint = {
                getId: jest.fn().mockReturnValue('s1'),
            } as unknown as jest.Mocked<Sprint>;

            project.addSprint(mockSprint);

            expect(project.getSprints()).toContain(mockSprint);
            expect(project.getSprints()).toHaveLength(1);
        });
    });

    describe('backlog items', () => {
        test('should add backlog items to backlog', () => {
            const items = [{} as BacklogItem, {} as BacklogItem];

            project.addBacklogItems(...items);

            expect(mockBacklog.addBacklogItems).toHaveBeenCalledWith(...items);
        });

        test('should remove backlog items from backlog', () => {
            const items = [{} as BacklogItem, {} as BacklogItem];

            project.removeBacklogItems(...items);

            expect(mockBacklog.removeBacklogItems).toHaveBeenCalledWith(...items);
        });
    });

    describe('getters', () => {
        test('should return correct project data', () => {
            expect(project.getId()).toBe('p1');
            expect(project.getName()).toBe('Test Project');
            expect(project.getDescription()).toBe('');
            expect(project.getProductOwner()).toBe(mockProductOwner);
        });
    });
});
