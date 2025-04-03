import { UserRoleEnum } from '../../../domain/common/enums/UserRoleEnum';
import { ProductBacklog } from '../../../domain/common/models/ProductBacklog';
import { Project } from '../../../domain/common/models/Project';
import { User } from '../../../domain/common/models/User';
import { ActivityStatusEnum } from '../../../domain/issuemanagement/enums/ActivityStatusEnum';
import { Activity } from '../../../domain/issuemanagement/models/Activity';
import { BacklogItem } from '../../../domain/issuemanagement/models/BacklogItem';
import { DoneState } from '../../../domain/issuemanagement/models/backlogitemstates/DoneState';
import { IEvent } from '../../../domain/notifications/interfaces/IEvent';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';
import { IObserver } from '../../../domain/notifications/interfaces/IObserver';

describe('BacklogItem', () => {
    let backlogItem: BacklogItem;
    let mockObserver: jest.Mocked<IObserver<BacklogItem>>;
    let mockEvent: IEvent;

    beforeEach(() => {
        backlogItem = new BacklogItem('id1', 'Test Item', 'Description', 3, {} as Project);

        mockObserver = {
            update: jest.fn(),
        };

        mockEvent = {} as IEvent;
    });

    describe('UT-F2-1: Backlog-item aanmaken', () => {
        test('Een backlog-item kan worden aangemaakt met naam “Inloggen”, beschrijving “Inlogfunctionaliteit”, id “test-id” en 7 story points, en kan toegevoegd worden aan een product backlog.', () => {
            const backlogItem = new BacklogItem(
                'test-id',
                'Inloggen',
                'Inlogfunctionaliteit',
                7,
                {} as Project,
            );
            expect(backlogItem.getId()).toBe('test-id');
            expect(backlogItem.getTitle()).toBe('Inloggen');
            expect(backlogItem.getDescription()).toBe('Inlogfunctionaliteit');
            expect(backlogItem.getStoryPoints()).toBe(7);
            let productBacklog = new ProductBacklog('test-backlog-id');
            productBacklog.addBacklogItems(backlogItem);
            expect(productBacklog.getId()).toBe('test-backlog-id');
            expect(productBacklog.getItems()).toContain(backlogItem);
        });
    });

    describe('UT-F2-2: Backlog-item wijzigen', () => {
        test('Een backlogitem kan hernoemd worden naar "Verbeterd inloggen" en de beschrijving kan gewijzigd worden naar "Uitgebreide inlogfunctionaliteit".', () => {
            backlogItem.setTitle('Verbeterd inloggen');
            backlogItem.setDescription('Uitgebreide inlogfunctionaliteit');

            expect(backlogItem.getTitle()).toBe('Verbeterd inloggen');
            expect(backlogItem.getDescription()).toBe('Uitgebreide inlogfunctionaliteit');
        });
    });

    test('(UT-F2-3) Deleting backlog item', () => {
        const backlogItemToRemove = new BacklogItem(
            'test-id',
            'Inloggen',
            'Inlogfunctionaliteit',
            7,
            {} as Project,
        );
        let productBacklog = new ProductBacklog('test-backlog-id');
        productBacklog.addBacklogItems(backlogItemToRemove);
        expect(productBacklog.getItems()).toContain(backlogItemToRemove);

        productBacklog.removeBacklogItems(backlogItemToRemove);
        expect(productBacklog.getItems()).not.toContain(backlogItemToRemove);
    });

    test('(UT-F3-1) Adding activity', () => {
        const activity = {
            id: 'activity-id',
            description: 'Database verbinding maken',
            timestamp: new Date(),
        } as unknown as Activity;

        backlogItem.addActivity(activity);

        expect(backlogItem.getActivities()).toContain(activity);
    });

    test('(UT-F3-2) Only save backlog item if all activities are done', () => {
        const activity1 = {
            id: 'activity-id-1',
            description: 'Activity 1',
            timestamp: new Date(),
            getStatus: () => ActivityStatusEnum.TODO,
        } as unknown as Activity;
        const activity2 = {
            id: 'activity-id-2',
            description: 'Activity 2',
            timestamp: new Date(),
            getStatus: () => ActivityStatusEnum.DONE,
        } as unknown as Activity;

        backlogItem.addActivity(activity1);
        backlogItem.addActivity(activity2);

        expect(() => {
            backlogItem.startDevelopment();
            backlogItem.markReadyForTesting();
            backlogItem.beginTesting();
            backlogItem.completeTesting();
            backlogItem.markAsDone();
        }).toThrow('🚫 Test Item not all activities are done');
    });

    test('(UT-F3-3) Finish backlog item', () => {
        const activity1 = new Activity(
            'activity-id-1',
            'Activity 1',
            {} as User,
            ActivityStatusEnum.DONE,
        );

        const activity2 = new Activity(
            'activity-id-2',
            'Activity 2',
            {} as User,
            ActivityStatusEnum.DONE,
        );

        backlogItem.addActivity(activity1);
        backlogItem.addActivity(activity2);

        // State transitions
        backlogItem.startDevelopment();
        backlogItem.markReadyForTesting();
        backlogItem.beginTesting();
        backlogItem.completeTesting();
        backlogItem.markAsDone();

        expect(backlogItem.getState()).toBeInstanceOf(DoneState);
    });

    test('(UT-F4-3) Item can be assigned to "John"', () => {
        const john = new User(
            'john-id',
            'John',
            'john@test.com',
            UserRoleEnum.DEVELOPER,
            {} as INotificationChannel,
        );

        backlogItem.assignTo(john);

        expect(backlogItem.getAssignee()).toBe(john);
    });

    test('(UT-F4-4) Item assigned to "John" cannot be directly reassigned to "Jane"', () => {
        const john = new User(
            'john-id',
            'John',
            'john@test.com',
            UserRoleEnum.DEVELOPER,
            {} as INotificationChannel,
        );

        const jane = new User(
            'jane-id',
            'Jane',
            'jane@test.com',
            UserRoleEnum.DEVELOPER,
            {} as INotificationChannel,
        );

        backlogItem.assignTo(john);

        expect(() => {
            backlogItem.assignTo(jane);
        }).toThrow('Backlog item is already assigned to John');

        expect(backlogItem.getAssignee()).toBe(john);
    });

    test('should add observer', () => {
        backlogItem.addObserver(mockObserver);
        backlogItem.notifyObservers(mockEvent);
        expect(mockObserver.update).toHaveBeenCalledWith(backlogItem, mockEvent);
    });

    test('should not add same observer twice', () => {
        backlogItem.addObserver(mockObserver);
        backlogItem.addObserver(mockObserver);
        backlogItem.notifyObservers(mockEvent);
        expect(mockObserver.update).toHaveBeenCalledTimes(1);
    });

    test('should remove observer', () => {
        backlogItem.addObserver(mockObserver);
        backlogItem.removeObserver(mockObserver);
        backlogItem.notifyObservers(mockEvent);
        expect(mockObserver.update).not.toHaveBeenCalled();
    });

    test('should not fail when removing non-existent observer', () => {
        expect(() => backlogItem.removeObserver(mockObserver)).not.toThrow();
    });
});
