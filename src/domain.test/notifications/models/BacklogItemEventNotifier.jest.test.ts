import { TodoState } from '../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { DoingState } from '../../../domain/issuemanagement/models/backlogitemstates/DoingState';
import { ReadyForTestingState } from '../../../domain/issuemanagement/models/backlogitemstates/ReadyForTestingState';
import { TestingState } from '../../../domain/issuemanagement/models/backlogitemstates/TestingState';
import { BacklogItemEventNotifier } from '../../../domain/notifications/models/BacklogItemEventNotifier';
import { UserRoleEnum } from '../../../domain/common/enums/UserRoleEnum';
import { BacklogStatusChangedEvent } from '../../../domain/notifications/models/events/BacklogStatusChangedEvent';

describe('BacklogItemEventNotifier', () => {
    let scrumMasterNotificationChannel: any;
    let tester1NotificationChannel: any;
    let tester2NotificationChannel: any;
    let developerNotificationChannel: any;

    let scrumMaster: any;
    let tester1: any;
    let tester2: any;
    let developer: any;
    let sprint: any;
    let project: any;
    let backlogItem: any;
    let notifier: BacklogItemEventNotifier;

    beforeEach(() => {
        scrumMasterNotificationChannel = { sendNotification: jest.fn() };
        tester1NotificationChannel = { sendNotification: jest.fn() };
        tester2NotificationChannel = { sendNotification: jest.fn() };
        developerNotificationChannel = { sendNotification: jest.fn() };

        scrumMaster = {
            getName: jest.fn().mockReturnValue('Scrum Master'),
            getRole: jest.fn().mockReturnValue(UserRoleEnum.SCRUMMASTER),
            getPreferredNotificationChannel: jest
                .fn()
                .mockReturnValue(scrumMasterNotificationChannel),
        };

        tester1 = {
            getName: jest.fn().mockReturnValue('Tester One'),
            getRole: jest.fn().mockReturnValue(UserRoleEnum.TESTER),
            getPreferredNotificationChannel: jest.fn().mockReturnValue(tester1NotificationChannel),
        };

        tester2 = {
            getName: jest.fn().mockReturnValue('Tester Two'),
            getRole: jest.fn().mockReturnValue(UserRoleEnum.TESTER),
            getPreferredNotificationChannel: jest.fn().mockReturnValue(tester2NotificationChannel),
        };

        developer = {
            getName: jest.fn().mockReturnValue('Developer'),
            getRole: jest.fn().mockReturnValue(UserRoleEnum.DEVELOPER),
            getPreferredNotificationChannel: jest
                .fn()
                .mockReturnValue(developerNotificationChannel),
        };

        sprint = {
            getScrumMaster: jest.fn().mockReturnValue(scrumMaster),
        };

        project = {
            getMembers: jest.fn().mockReturnValue([scrumMaster, tester1, tester2, developer]),
        };

        backlogItem = {
            getTitle: jest.fn().mockReturnValue('Test Backlog Item'),
            getId: jest.fn().mockReturnValue('BLI-123'),
            getProject: jest.fn().mockReturnValue(project),
            getSprint: jest.fn().mockReturnValue(sprint),
        };

        notifier = new BacklogItemEventNotifier();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('handleTestingNotification', () => {
        afterEach(() => {
            console.log('Finished a handleTestingNotification subtest');
        });

        test('Path 1: State is ReadyForTestingState, there is a member, and they are a tester', () => {
            const newState = new ReadyForTestingState(backlogItem);
            const event = new BacklogStatusChangedEvent(backlogItem, newState);

            notifier.update(backlogItem, event);

            expect(tester1NotificationChannel.sendNotification.mock.calls.length).toBe(1);
            expect(tester2NotificationChannel.sendNotification.mock.calls.length).toBe(1);

            expect(developerNotificationChannel.sendNotification.mock.calls.length).toBe(0);
            expect(scrumMasterNotificationChannel.sendNotification.mock.calls.length).toBe(0);
        });

        test('Path 2: State is not ReadyForTestingState', () => {
            const newState = new TestingState(backlogItem);
            const event = new BacklogStatusChangedEvent(backlogItem, newState);

            notifier.update(backlogItem, event);

            expect(tester1NotificationChannel.sendNotification.mock.calls.length).toBe(0);
            expect(tester2NotificationChannel.sendNotification.mock.calls.length).toBe(0);
            expect(developerNotificationChannel.sendNotification.mock.calls.length).toBe(0);
            expect(scrumMasterNotificationChannel.sendNotification.mock.calls.length).toBe(0);
        });

        test('Path 3: State is ReadyForTestingState, there are no members', () => {
            const emptyProject = {
                getMembers: jest.fn().mockReturnValue([]),
            };

            const emptyProjectBacklogItem = {
                getTitle: jest.fn().mockReturnValue('Empty Project Item'),
                getId: jest.fn().mockReturnValue('BLI-456'),
                getProject: jest.fn().mockReturnValue(emptyProject),
                getSprint: jest.fn().mockReturnValue(sprint),
            } as any;

            const newState = new ReadyForTestingState(emptyProjectBacklogItem);
            const event = new BacklogStatusChangedEvent(emptyProjectBacklogItem, newState);

            notifier.update(emptyProjectBacklogItem, event);

            expect(tester1NotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(tester2NotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(developerNotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(scrumMasterNotificationChannel.sendNotification.mock.calls.length).toBe(0);
        });

        test('Path 4: State is ReadyForTestingState, there are members, but none are testers', () => {
            const noTesterProject = {
                getMembers: jest.fn().mockReturnValue([scrumMaster, developer]),
            };

            const noTesterBacklogItem = {
                getTitle: jest.fn().mockReturnValue('No Tester Item'),
                getId: jest.fn().mockReturnValue('BLI-789'),
                getProject: jest.fn().mockReturnValue(noTesterProject),
                getSprint: jest.fn().mockReturnValue(sprint),
            } as any;

            const newState = new ReadyForTestingState(noTesterBacklogItem);
            const event = new BacklogStatusChangedEvent(noTesterBacklogItem, newState);

            notifier.update(noTesterBacklogItem, event);

            expect(tester1NotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(tester2NotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(developerNotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(scrumMasterNotificationChannel.sendNotification).not.toHaveBeenCalled();

            console.log('Completing test: Path 4');
        });

        console.log('Ending parent handleTestingNotification test');
    });

    describe('handleRegressionAlert', () => {
        afterEach(() => {
            console.log('Finished a handleRegressionAlert subtest');
        });

        test('Path 1: State is not TodoState', () => {
            const newState = new DoingState(backlogItem);
            const event = new BacklogStatusChangedEvent(backlogItem, newState);

            notifier.update(backlogItem, event);

            expect(scrumMasterNotificationChannel.sendNotification).not.toHaveBeenCalled();
        });

        test('Path 2: State is TodoState but getSprint() returns null', () => {
            const noSprintBacklogItem = {
                getTitle: jest.fn().mockReturnValue('No Sprint Item'),
                getId: jest.fn().mockReturnValue('BLI-456'),
                getProject: jest.fn().mockReturnValue(project),
                getSprint: jest.fn().mockReturnValue(null), // No sprint!
            } as any;

            const newState = new TodoState(noSprintBacklogItem);
            const event = new BacklogStatusChangedEvent(noSprintBacklogItem, newState);

            notifier.update(noSprintBacklogItem, event);

            expect(scrumMasterNotificationChannel.sendNotification).not.toHaveBeenCalled();
        });

        test('Path 3: State is TodoState, getSprint() returns a value, but getScrumMaster() returns null', () => {
            console.log('Starting test: Regression Path 3');

            const noScrumMasterSprint = {
                getScrumMaster: jest.fn().mockReturnValue(null), // No scrum master!
            };

            const noScrumMasterBacklogItem = {
                getTitle: jest.fn().mockReturnValue('No Scrum Master Item'),
                getId: jest.fn().mockReturnValue('BLI-789'),
                getProject: jest.fn().mockReturnValue(project),
                getSprint: jest.fn().mockReturnValue(noScrumMasterSprint),
            } as any;

            const newState = new TodoState(noScrumMasterBacklogItem);
            const event = new BacklogStatusChangedEvent(noScrumMasterBacklogItem, newState);

            notifier.update(noScrumMasterBacklogItem, event);

            expect(scrumMasterNotificationChannel.sendNotification).not.toHaveBeenCalled();
        });

        test('Path 4: Happy path - State is TodoState with valid sprint and scrum master', () => {
            const newState = new TodoState(backlogItem);
            const event = new BacklogStatusChangedEvent(backlogItem, newState);

            notifier.update(backlogItem, event);

            expect(scrumMasterNotificationChannel.sendNotification.mock.calls.length).toBe(1);

            const call = scrumMasterNotificationChannel.sendNotification.mock.calls[0];
            expect(call[1]).toContain(`has been moved to todo`);

            expect(tester1NotificationChannel.sendNotification.mock.calls.length).toBe(0);
            expect(tester2NotificationChannel.sendNotification.mock.calls.length).toBe(0);
            expect(developerNotificationChannel.sendNotification.mock.calls.length).toBe(0);
        });
    });
});
