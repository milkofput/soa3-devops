import sinon from 'sinon';
import { SprintEventNotifier } from '../../../domain/notifications/models/SprintEventNotifier';
import { PipelineOutcomeEvent } from '../../../domain/notifications/models/events/PipelineOutcomeEvent';
import { PipelineStatusEnum } from '../../../domain/cicd/enums/PipelineStatusEnum';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';

describe('SprintEventNotifier', () => {
    let scrumMasterNotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;
    let productOwnerNotificationChannel: sinon.SinonStubbedInstance<INotificationChannel>;

    let scrumMaster: any;
    let productOwner: any;
    let project: any;
    let backlogItem: any;
    let pipeline: any;
    let sprint: any;
    let notifier: SprintEventNotifier;

    beforeEach(() => {
        scrumMasterNotificationChannel = { sendNotification: sinon.stub() };
        productOwnerNotificationChannel = { sendNotification: sinon.stub() };

        scrumMaster = {
            getName: sinon.stub().returns('Scrum Master'),
            getPreferredNotificationChannel: sinon.stub().returns(scrumMasterNotificationChannel),
        };

        productOwner = {
            getName: sinon.stub().returns('Product Owner'),
            getPreferredNotificationChannel: sinon.stub().returns(productOwnerNotificationChannel),
        };

        project = {
            getName: sinon.stub().returns('Test Project'),
            getProductOwner: sinon.stub().returns(productOwner),
        };

        backlogItem = {
            getTitle: sinon.stub().returns('Test Backlog Item'),
            getId: sinon.stub().returns('BLI-123'),
            getProject: sinon.stub().returns(project),
        };

        pipeline = {
            getName: sinon.stub().returns('Release Pipeline'),
            getStatus: sinon.stub().returns(PipelineStatusEnum.SUCCEEDED),
        };

        sprint = {
            getName: sinon.stub().returns('Sprint 1'),
            getScrumMaster: sinon.stub().returns(scrumMaster),
            getBacklogItems: sinon.stub().returns([backlogItem]),
            getReleasePipeline: sinon.stub().returns(pipeline),
        };

        notifier = new SprintEventNotifier();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('handlePipelineNotification', () => {
        beforeEach(() => {
            scrumMasterNotificationChannel.sendNotification.reset();
            productOwnerNotificationChannel.sendNotification.reset();
        });

        test('Path 1: No pipeline', () => {
            const noPipelineSprint = {
                ...sprint,
                getReleasePipeline: sinon.stub().returns(null),
            };

            const event = new PipelineOutcomeEvent(noPipelineSprint);

            notifier.update(noPipelineSprint, event);

            expect(scrumMasterNotificationChannel.sendNotification.called).toBeFalsy();
            expect(productOwnerNotificationChannel.sendNotification.called).toBeFalsy();
        });

        test('Path 2: Not failed OR succeeded', () => {
            pipeline.getStatus.returns(PipelineStatusEnum.RUNNING);

            const event = new PipelineOutcomeEvent(sprint);

            notifier.update(sprint, event);

            expect(scrumMasterNotificationChannel.sendNotification.called).toBeFalsy();
            expect(productOwnerNotificationChannel.sendNotification.called).toBeFalsy();
        });

        test('Path 3: Pipeline failed', () => {
            pipeline.getStatus.returns(PipelineStatusEnum.FAILED);

            const event = new PipelineOutcomeEvent(sprint);

            notifier.update(sprint, event);

            expect(scrumMasterNotificationChannel.sendNotification.called).toBeTruthy();

            const call = scrumMasterNotificationChannel.sendNotification.getCall(0);
            expect(call.args[1]).toMatch(
                /Pipeline 'Release Pipeline' for sprint 'Sprint 1' has failed!/,
            );

            expect(productOwnerNotificationChannel.sendNotification.called).toBeFalsy();
        });

        test('Path 4: Pipeline succeeded but no product owner', () => {
            pipeline.getStatus.returns(PipelineStatusEnum.SUCCEEDED);

            const noProductOwnerProject = {
                ...project,
                getProductOwner: sinon.stub().returns(null),
            };

            const noProductOwnerBacklogItem = {
                ...backlogItem,
                getProject: sinon.stub().returns(noProductOwnerProject),
            };

            const noProductOwnerSprint = {
                ...sprint,
                getBacklogItems: sinon.stub().returns([noProductOwnerBacklogItem]),
            };

            const event = new PipelineOutcomeEvent(noProductOwnerSprint);

            notifier.update(noProductOwnerSprint, event);

            expect(scrumMasterNotificationChannel.sendNotification.called).toBeTruthy();

            expect(productOwnerNotificationChannel.sendNotification.called).toBeFalsy();
        });

        test('Path 5: Pipeline succeeded with product owner', () => {
            pipeline.getStatus.returns(PipelineStatusEnum.SUCCEEDED);

            const event = new PipelineOutcomeEvent(sprint);

            notifier.update(sprint, event);

            expect(scrumMasterNotificationChannel.sendNotification.called).toBeTruthy();

            expect(productOwnerNotificationChannel.sendNotification.called).toBeTruthy();

            const scrumMasterCall = scrumMasterNotificationChannel.sendNotification.getCall(0);
            expect(scrumMasterCall.args[1]).toMatch(
                /Pipeline 'Release Pipeline' for sprint 'Sprint 1' has succeeded!/,
            );

            const productOwnerCall = productOwnerNotificationChannel.sendNotification.getCall(0);
            expect(productOwnerCall.args[1]).toMatch(
                /Pipeline 'Release Pipeline' for sprint 'Sprint 1' has succeeded!/,
            );
        });
    });
});
