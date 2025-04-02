import tap from 'tap';
import sinon from 'sinon';
import { SprintEventNotifier } from '../../../domain/notifications/models/SprintEventNotifier';
import { PipelineOutcomeEvent } from '../../../domain/notifications/models/events/PipelineOutcomeEvent';
import { PipelineStatusEnum } from '../../../domain/cicd/enums/PipelineStatusEnum';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';

tap.test('SprintEventNotifier', (t) => {
    let scrumMasterNotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;
    let productOwnerNotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;

    let scrumMaster: any;
    let productOwner: any;
    let project: any;
    let backlogItem: any;
    let pipeline: any;
    let sprint: any;
    let notifier: SprintEventNotifier;

    t.beforeEach(() => {
        // Create stub notification channels
        scrumMasterNotificationChannel = { sendNotification: sinon.stub() };
        productOwnerNotificationChannel = { sendNotification: sinon.stub() };

        // Create users
        scrumMaster = {
            getName: sinon.stub().returns('Scrum Master'),
            getPreferredNotificationChannel: sinon.stub().returns(scrumMasterNotificationChannel),
        };

        productOwner = {
            getName: sinon.stub().returns('Product Owner'),
            getPreferredNotificationChannel: sinon.stub().returns(productOwnerNotificationChannel),
        };

        // Create project
        project = {
            getName: sinon.stub().returns('Test Project'),
            getProductOwner: sinon.stub().returns(productOwner),
        };

        // Create backlog item
        backlogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            getId: sinon.stub().returns('BLI-123'),
            getProject: sinon.stub().returns(project),
        };

        // Create pipeline with default status
        pipeline = {
            getName: sinon.stub().returns('Release Pipeline'),
            getStatus: sinon.stub().returns(PipelineStatusEnum.SUCCEEDED),
        };

        // Create sprint
        sprint = {
            getName: sinon.stub().returns('Sprint 1'),
            getScrumMaster: sinon.stub().returns(scrumMaster),
            getBacklogItems: sinon.stub().returns([backlogItem]),
            getReleasePipeline: sinon.stub().returns(pipeline),
        };

        // Create notifier
        notifier = new SprintEventNotifier();
    });

    t.afterEach(() => {
        sinon.restore();
    });

    t.test('handlePipelineNotification', (t) => {
        t.afterEach(() => {
            // Reset stubs between tests
            scrumMasterNotificationChannel.sendNotification.reset();
            productOwnerNotificationChannel.sendNotification.reset();
        });

        t.test('Path 1: No pipeline', (t) => {
            // Set up sprint with no pipeline
            const noPipelineSprint = {
                ...sprint,
                getReleasePipeline: sinon.stub().returns(null),
            };

            const event = new PipelineOutcomeEvent(noPipelineSprint);

            notifier.update(noPipelineSprint, event);

            t.notOk(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should not send notification to scrum master when sprint has no pipeline',
            );
            t.notOk(
                productOwnerNotificationChannel.sendNotification.called,
                'Should not send notification to product owner when sprint has no pipeline',
            );

            t.end();
        });

        t.test('Path 2: Not failed OR succeeded', (t) => {
            pipeline.getStatus.returns(PipelineStatusEnum.RUNNING);

            const event = new PipelineOutcomeEvent(sprint);

            notifier.update(sprint, event);

            t.notOk(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should not send notification to scrum master when pipeline status is neither FAILED nor SUCCEEDED',
            );
            t.notOk(
                productOwnerNotificationChannel.sendNotification.called,
                'Should not send notification to product owner when pipeline status is neither FAILED nor SUCCEEDED',
            );

            t.end();
        });

        t.test('Path 3: Pipeline failed', (t) => {
            // Set pipeline status to FAILED
            pipeline.getStatus.returns(PipelineStatusEnum.FAILED);

            const event = new PipelineOutcomeEvent(sprint);

            notifier.update(sprint, event);

            // Verify scrum master was notified
            t.ok(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should send notification to scrum master when pipeline fails',
            );

            // Verify notification message content
            const call = scrumMasterNotificationChannel.sendNotification.getCall(0);
            t.match(
                call.args[1],
                /Pipeline 'Release Pipeline' for sprint 'Sprint 1' has failed!/,
                'Notification message should contain pipeline name and sprint name',
            );

            // Verify product owner was not notified
            t.notOk(
                productOwnerNotificationChannel.sendNotification.called,
                'Should not send notification to product owner when pipeline fails',
            );

            t.end();
        });

        t.test('Path 4: Pipeline succeeded but no product owner', (t) => {
            // Set pipeline status to SUCCEEDED
            pipeline.getStatus.returns(PipelineStatusEnum.SUCCEEDED);

            // Create project with no product owner
            const noProductOwnerProject = {
                ...project,
                getProductOwner: sinon.stub().returns(null),
            };

            // Create backlog item with project that has no product owner
            const noProductOwnerBacklogItem = {
                ...backlogItem,
                getProject: sinon.stub().returns(noProductOwnerProject),
            };

            // Create sprint with backlog item that has no product owner
            const noProductOwnerSprint = {
                ...sprint,
                getBacklogItems: sinon.stub().returns([noProductOwnerBacklogItem]),
            };

            const event = new PipelineOutcomeEvent(noProductOwnerSprint);

            notifier.update(noProductOwnerSprint, event);

            // Verify scrum master was notified
            t.ok(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should send notification to scrum master when pipeline succeeds',
            );

            // Verify product owner was NOT notified
            t.notOk(
                productOwnerNotificationChannel.sendNotification.called,
                'Should not send notification to product owner when project has no product owner',
            );

            t.end();
        });

        t.test('Path 5: Pipeline succeeded with product owner', (t) => {
            // Set pipeline status to SUCCEEDED
            pipeline.getStatus.returns(PipelineStatusEnum.SUCCEEDED);

            const event = new PipelineOutcomeEvent(sprint);

            notifier.update(sprint, event);

            // Verify scrum master was notified
            t.ok(
                scrumMasterNotificationChannel.sendNotification.called,
                'Should send notification to scrum master when pipeline succeeds',
            );

            // Verify product owner was notified
            t.ok(
                productOwnerNotificationChannel.sendNotification.called,
                'Should send notification to product owner when pipeline succeeds',
            );

            // Verify notification message content
            const scrumMasterCall = scrumMasterNotificationChannel.sendNotification.getCall(0);
            t.match(
                scrumMasterCall.args[1],
                /Pipeline 'Release Pipeline' for sprint 'Sprint 1' has succeeded!/,
                'Notification message to scrum master should contain pipeline name and sprint name',
            );

            const productOwnerCall = productOwnerNotificationChannel.sendNotification.getCall(0);
            t.match(
                productOwnerCall.args[1],
                /Pipeline 'Release Pipeline' for sprint 'Sprint 1' has succeeded!/,
                'Notification message to product owner should contain pipeline name and sprint name',
            );

            t.end();
        });

        t.end();
    });

    t.end();
});
