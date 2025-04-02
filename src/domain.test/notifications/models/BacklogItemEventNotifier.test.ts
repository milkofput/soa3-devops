import tap from 'tap';
import sinon from 'sinon';
import { TodoState } from '../../../domain/issuemanagement/models/backlogitemstates/TodoState';
import { DoingState } from '../../../domain/issuemanagement/models/backlogitemstates/DoingState';
import { ReadyForTestingState } from '../../../domain/issuemanagement/models/backlogitemstates/ReadyForTestingState';
import { TestingState } from '../../../domain/issuemanagement/models/backlogitemstates/TestingState';
import { TestedState } from '../../../domain/issuemanagement/models/backlogitemstates/TestedState';
import { DoneState } from '../../../domain/issuemanagement/models/backlogitemstates/DoneState';
import { BacklogItemEventNotifier } from '../../../domain/notifications/models/BacklogItemEventNotifier';
import { UserRoleEnum } from '../../../domain/common/enums/UserRoleEnum';
import { BacklogStatusChangedEvent } from '../../../domain/notifications/models/events/BacklogStatusChangedEvent';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';

tap.test('BacklogItemEventNotifier', (t) => {
    let scrumMasterNotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;
    let tester1NotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;
    let tester2NotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;
    let developerNotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;

    let scrumMaster: any;
    let tester1: any;
    let tester2: any;
    let developer: any;
    let sprint: any;
    let project: any;
    let backlogItem: any;
    let notifier: BacklogItemEventNotifier;

    t.beforeEach(() => {
        // Create stub notification channels
        scrumMasterNotificationChannel = { sendNotification: sinon.stub() };
        tester1NotificationChannel = { sendNotification: sinon.stub() };
        tester2NotificationChannel = { sendNotification: sinon.stub() };
        developerNotificationChannel = { sendNotification: sinon.stub() };

        // Create users
        scrumMaster = {
            getName: sinon.stub().returns('Scrum Master'),
            getRole: sinon.stub().returns(UserRoleEnum.SCRUMMASTER),
            getPreferredNotificationChannel: sinon.stub().returns(scrumMasterNotificationChannel),
        };

        tester1 = {
            getName: sinon.stub().returns('Tester One'),
            getRole: sinon.stub().returns(UserRoleEnum.TESTER),
            getPreferredNotificationChannel: sinon.stub().returns(tester1NotificationChannel),
        };

        tester2 = {
            getName: sinon.stub().returns('Tester Two'),
            getRole: sinon.stub().returns(UserRoleEnum.TESTER),
            getPreferredNotificationChannel: sinon.stub().returns(tester2NotificationChannel),
        };

        developer = {
            getName: sinon.stub().returns('Developer'),
            getRole: sinon.stub().returns(UserRoleEnum.DEVELOPER),
            getPreferredNotificationChannel: sinon.stub().returns(developerNotificationChannel),
        };

        // Setup sprint
        sprint = {
            getScrumMaster: sinon.stub().returns(scrumMaster),
        };

        // Default project with all members
        project = {
            getMembers: sinon.stub().returns([scrumMaster, tester1, tester2, developer]),
        };

        // Default backlog item
        backlogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            getId: sinon.stub().returns('BLI-123'),
            getProject: sinon.stub().returns(project),
            getSprint: sinon.stub().returns(sprint),
        };

        notifier = new BacklogItemEventNotifier();
    });

    t.afterEach(() => {
        sinon.restore();
    });

    t.test('handleTestingNotification', (t) => {
        t.afterEach(() => {
            console.log('Finished a handleTestingNotification subtest');
        });

        t.test(
            'Path 1: State is ReadyForTestingState, there is a member, and they are a tester',
            (t) => {
                console.log('Starting test: Path 1');
                const newState = new ReadyForTestingState(backlogItem);
                const event = new BacklogStatusChangedEvent(backlogItem, newState);

                notifier.update(backlogItem, event);

                t.ok(
                    tester1NotificationChannel.sendNotification.called,
                    'Should send notification to tester1',
                );
                t.ok(
                    tester2NotificationChannel.sendNotification.called,
                    'Should send notification to tester2',
                );

                t.notOk(
                    developerNotificationChannel.sendNotification.called,
                    'Should not send notification to developers',
                );
                t.notOk(
                    scrumMasterNotificationChannel.sendNotification.called,
                    'Should not send notification to scrum master for this event',
                );

                console.log('Completing test: Path 1');
                t.end();
            },
        );

        t.test('Path 2: State is not ReadyForTestingState', (t) => {
            console.log('Starting test: Path 2');
            const newState = new TestingState(backlogItem);
            const event = new BacklogStatusChangedEvent(backlogItem, newState);

            notifier.update(backlogItem, event);

            t.notOk(
                tester1NotificationChannel.sendNotification.called,
                'Should not send notification to testers when state is not ReadyForTesting',
            );
            t.notOk(
                tester2NotificationChannel.sendNotification.called,
                'Should not send notification to testers when state is not ReadyForTesting',
            );
            t.notOk(
                developerNotificationChannel.sendNotification.called,
                'Should not send notification to developers',
            );
            t.notOk(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should not send notification to scrum master',
            );

            console.log('Completing test: Path 2');
            t.end();
        });

        t.test('Path 3: State is ReadyForTestingState, there are no members', (t) => {
            console.log('Starting test: Path 3');
            const emptyProject = {
                getMembers: sinon.stub().returns([]),
            };

            const emptyProjectBacklogItem = {
                getTitle: sinon.stub().returns('Empty Project Item'),
                getId: sinon.stub().returns('BLI-456'),
                getProject: sinon.stub().returns(emptyProject),
                getSprint: sinon.stub().returns(sprint),
            } as any;

            const newState = new ReadyForTestingState(emptyProjectBacklogItem);
            const event = new BacklogStatusChangedEvent(emptyProjectBacklogItem, newState);

            notifier.update(emptyProjectBacklogItem, event);

            t.notOk(
                tester1NotificationChannel.sendNotification.called,
                'Should not send notification when project has no members',
            );
            t.notOk(
                tester2NotificationChannel.sendNotification.called,
                'Should not send notification when project has no members',
            );
            t.notOk(
                developerNotificationChannel.sendNotification.called,
                'Should not send notification to developers',
            );
            t.notOk(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should not send notification to scrum master for this event',
            );

            console.log('Completing test: Path 3');
            t.end();
        });

        t.test(
            'Path 4: State is ReadyForTestingState, there are members, but none are testers',
            (t) => {
                console.log('Starting test: Path 4');
                const noTesterProject = {
                    getMembers: sinon.stub().returns([scrumMaster, developer]),
                };

                const noTesterBacklogItem = {
                    getTitle: sinon.stub().returns('No Tester Item'),
                    getId: sinon.stub().returns('BLI-789'),
                    getProject: sinon.stub().returns(noTesterProject),
                    getSprint: sinon.stub().returns(sprint),
                } as any;

                const newState = new ReadyForTestingState(noTesterBacklogItem);
                const event = new BacklogStatusChangedEvent(noTesterBacklogItem, newState);

                notifier.update(noTesterBacklogItem, event);

                t.notOk(
                    tester1NotificationChannel.sendNotification.called,
                    'Should not send notification to tester1 since there are no testers in project',
                );
                t.notOk(
                    tester2NotificationChannel.sendNotification.called,
                    'Should not send notification to tester2 since there are no testers in project',
                );
                t.notOk(
                    developerNotificationChannel.sendNotification.called,
                    'Should not send notification to developers',
                );
                t.notOk(
                    scrumMasterNotificationChannel.sendNotification.called,
                    'Should not send notification to scrum master for this event',
                );

                console.log('Completing test: Path 4');
                t.end();
            },
        );

        console.log('Ending parent handleTestingNotification test');
        t.end();
    });

    t.test('handleRegressionAlert', (t) => {
        t.afterEach(() => {
            console.log('Finished a handleRegressionAlert subtest');
        });

        t.test('Path 1: State is not TodoState', (t) => {
            console.log('Starting test: Regression Path 1');
            const newState = new DoingState(backlogItem);
            const event = new BacklogStatusChangedEvent(backlogItem, newState);

            notifier.update(backlogItem, event);

            t.notOk(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should not send regression notification to scrum master when state is not TodoState',
            );

            console.log('Completing test: Regression Path 1');
            t.end();
        });

        t.test('Path 2: State is TodoState but getSprint() returns null', (t) => {
            console.log('Starting test: Regression Path 2');

            // Backlog item with no sprint
            const noSprintBacklogItem = {
                getTitle: sinon.stub().returns('No Sprint Item'),
                getId: sinon.stub().returns('BLI-456'),
                getProject: sinon.stub().returns(project),
                getSprint: sinon.stub().returns(null), // No sprint!
            } as any;

            const newState = new TodoState(noSprintBacklogItem);
            const event = new BacklogStatusChangedEvent(noSprintBacklogItem, newState);

            notifier.update(noSprintBacklogItem, event);

            t.notOk(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should not send regression notification when backlog item has no sprint',
            );

            console.log('Completing test: Regression Path 2');
            t.end();
        });

        t.test(
            'Path 3: State is TodoState, getSprint() returns a value, but getScrumMaster() returns null',
            (t) => {
                console.log('Starting test: Regression Path 3');

                // Sprint with no scrum master
                const noScrumMasterSprint = {
                    getScrumMaster: sinon.stub().returns(null), // No scrum master!
                };

                // Backlog item with sprint that has no scrum master
                const noScrumMasterBacklogItem = {
                    getTitle: sinon.stub().returns('No Scrum Master Item'),
                    getId: sinon.stub().returns('BLI-789'),
                    getProject: sinon.stub().returns(project),
                    getSprint: sinon.stub().returns(noScrumMasterSprint),
                } as any;

                const newState = new TodoState(noScrumMasterBacklogItem);
                const event = new BacklogStatusChangedEvent(noScrumMasterBacklogItem, newState);

                notifier.update(noScrumMasterBacklogItem, event);

                t.notOk(
                    scrumMasterNotificationChannel.sendNotification.called,
                    'Should not send regression notification when sprint has no scrum master',
                );

                console.log('Completing test: Regression Path 3');
                t.end();
            },
        );

        t.test(
            'Path 4: Happy path - State is TodoState with valid sprint and scrum master',
            (t) => {
                console.log('Starting test: Regression Path 4');

                const newState = new TodoState(backlogItem);
                const event = new BacklogStatusChangedEvent(backlogItem, newState);

                notifier.update(backlogItem, event);

                t.ok(
                    scrumMasterNotificationChannel.sendNotification.called,
                    'Should send regression notification to scrum master',
                );

                // Verify message content
                const call = scrumMasterNotificationChannel.sendNotification.getCall(0);
                t.match(
                    call.args[1],
                    /Test Backlog Item/,
                    'Notification message should include the backlog item title',
                );

                // Verify that other members were not notified
                t.notOk(
                    tester1NotificationChannel.sendNotification.called,
                    'Should not send regression notification to testers',
                );
                t.notOk(
                    tester2NotificationChannel.sendNotification.called,
                    'Should not send regression notification to testers',
                );
                t.notOk(
                    developerNotificationChannel.sendNotification.called,
                    'Should not send regression notification to developers',
                );

                console.log('Completing test: Regression Path 4');
                t.end();
            },
        );

        console.log('Ending parent handleRegressionAlert test');
        t.end();
    });

    t.end();
});
