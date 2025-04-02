import { IPipelineBuilder } from './domain/cicd/interfaces/IPipelineBuilder';
import { ExecutionVisitor } from './domain/cicd/models/ExecutionVisitor';
import { FailingExecutionVisitor } from './domain/cicd/models/FailingExecutionVisitor';
import { StandardPipelineBuilder } from './domain/cicd/models/StandardPipelineBuilder';
import { UserRoleEnum } from './domain/common/enums/UserRoleEnum';
import { ProductBacklog } from './domain/common/models/ProductBacklog';
import { Project } from './domain/common/models/Project';
import { User } from './domain/common/models/User';
import { BacklogItem } from './domain/issuemanagement/models/BacklogItem';
import { ReviewDocument } from './domain/issuemanagement/models/ReviewDocument';
import { Sprint } from './domain/issuemanagement/models/Sprint';
import { ReleaseSprintStrategy } from './domain/issuemanagement/models/sprintstrategies/ReleaseSprintStrategy';
import { ReviewSprintStrategy } from './domain/issuemanagement/models/sprintstrategies/ReviewSprintStrategy';
import { BacklogItemEventNotifier } from './domain/notifications/models/BacklogItemEventNotifier';
import { EmailNotificationAdapter } from './infrastructure/notifications/EmailNotificationAdapter';
import { SlackNotificationAdapter } from './infrastructure/notifications/SlackNotificationAdapter';
import { SprintEventNotifier } from './domain/notifications/models/SprintEventNotifier';
import { Activity } from './domain/issuemanagement/models/Activity';
import { ActivityStatusEnum } from './domain/issuemanagement/enums/ActivityStatusEnum';
import { BurndownChartReport } from './domain/reports/models/BurndownChartReport';
import { PDFExportStrategy } from './domain/reports/models/PDFExportStrategy';

try {
    console.log('SOA3 Eindopdracht: Avans DevOps');

    const uuid = () => {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    };

    let productOwner = new User(
        '0',
        'Jane Doe',
        'jane.doe@example.com',
        UserRoleEnum.PRODUCTOWNER,
        new EmailNotificationAdapter(),
    );
    let callACar = new Project(uuid(), 'Call a Car', new ProductBacklog(uuid()), productOwner);
    let scrumMaster = new User(
        '1',
        'John Doe',
        'john.doe@example.com',
        UserRoleEnum.SCRUMMASTER,
        new SlackNotificationAdapter(),
    );
    let dev1 = new User(
        '2',
        'Jane Smith',
        'jane.smith@example.com',
        UserRoleEnum.DEVELOPER,
        new SlackNotificationAdapter(),
    );
    let test1 = new User(
        '3',
        'Alice Johnson',
        'alice.johnson@example.com',
        UserRoleEnum.TESTER,
        new EmailNotificationAdapter(),
    );

    callACar.addMembers(scrumMaster, dev1, test1);

    let pipelineBuilder: IPipelineBuilder = new StandardPipelineBuilder();

    let pipeline = pipelineBuilder
        .composite('Call-a-car release')
        .composite('Build')
        .command('npm build')
        .end()
        .composite('Test')
        .command('npm audit')
        .command('npm test')
        .end()
        .end()
        .build();

    // ------------------------------ release sprint ------------------------------

    let releaseSprint = new Sprint(
        uuid(),
        'Sprint 1',
        new Date('2023-10-01'),
        new Date('2023-10-15'),
        scrumMaster,
        new ReleaseSprintStrategy(new ExecutionVisitor()),
    );

    let releaseSprintItems = [
        new BacklogItem(
            uuid(),
            'User Story 1',
            'As a user, I want to be able to log in.',
            3,
            callACar,
        ).assignTo(dev1),
        new BacklogItem(
            uuid(),
            'User Story 2',
            'As a user, I want to be able to log out.',
            2,
            callACar,
        ),
    ];

    releaseSprintItems.forEach((item) => {
        item.addObserver(new BacklogItemEventNotifier());
    });

    let sprintEventNotifier = new SprintEventNotifier();
    releaseSprint.addObserver(sprintEventNotifier);

    releaseSprint.addBacklogItems(...releaseSprintItems);
    callACar.addSprint(releaseSprint);
    releaseSprint.start();

    releaseSprintItems[0].startDevelopment();
    releaseSprintItems[0].markReadyForTesting();
    releaseSprintItems[0].beginTesting();
    releaseSprintItems[0].completeTesting();
    releaseSprintItems[0].markAsDone();

    releaseSprintItems[1].startDevelopment();
    releaseSprintItems[1].markReadyForTesting();
    releaseSprintItems[1].beginTesting();
    releaseSprintItems[1].moveToBacklog();
    releaseSprintItems[1].startDevelopment();
    releaseSprintItems[1].markReadyForTesting();
    releaseSprintItems[1].beginTesting();
    releaseSprintItems[1].completeTesting();
    releaseSprintItems[1].markAsDone();

    releaseSprint.setPipeline(pipeline);

    releaseSprint.finish();

    releaseSprint.finalize();

    releaseSprint.generateReport(
        new BurndownChartReport(releaseSprint, new PDFExportStrategy()),
        true,
    );

    // ------------------------------ failing release sprint ------------------------------

    let failReleaseSprint = new Sprint(
        uuid(),
        'Sprint 2',
        new Date('2023-10-31'),
        new Date('2023-11-15'),
        scrumMaster,
        new ReleaseSprintStrategy(new FailingExecutionVisitor(['npm build'])),
    );

    let failReleaseSprintItems = [
        new BacklogItem(
            uuid(),
            'User Story 5',
            'As a user, I want to be able to view my booking.',
            3,
            callACar,
        ),
        new BacklogItem(
            uuid(),
            'User Story 6',
            'As a user, I want to be able to cancel my booking.',
            2,
            callACar,
        ),
    ];

    failReleaseSprintItems.forEach((item) => {
        item.addObserver(new BacklogItemEventNotifier());
    });

    let failReleaseSprintActivities = [
        new Activity(uuid(), 'Activity 1', dev1, ActivityStatusEnum.TODO),
        new Activity(uuid(), 'Activity 2', test1, ActivityStatusEnum.TODO),
    ];

    failReleaseSprint.addBacklogItems(...failReleaseSprintItems);
    failReleaseSprintItems[0].addActivity(failReleaseSprintActivities[0]);
    failReleaseSprintItems[0].addActivity(failReleaseSprintActivities[1]);

    callACar.addSprint(failReleaseSprint);
    failReleaseSprint.start();

    // fail because items not started yet
    try {
        failReleaseSprintItems[0].beginTesting();
    } catch (error) {
        console.error(error);
    }
    failReleaseSprintItems[0].startDevelopment();
    failReleaseSprintActivities[0].setStatus(ActivityStatusEnum.DOING);
    failReleaseSprintItems[0].markReadyForTesting();
    failReleaseSprintItems[0].beginTesting();
    failReleaseSprintItems[0].completeTesting();
    failReleaseSprintActivities[0].setStatus(ActivityStatusEnum.DONE);
    // fail because second activity is not done
    try {
        failReleaseSprintItems[0].markAsDone();
    } catch (error) {
        console.error(error);
    }
    failReleaseSprintActivities[1].setStatus(ActivityStatusEnum.DONE);
    failReleaseSprintItems[0].markAsDone();

    failReleaseSprint.finish();
    failReleaseSprint.setPipeline(pipeline);
    // fail because pipeline fails
    try {
        failReleaseSprint.finalize();
    } catch (error) {
        console.error(error);
    }

    // ------------------------------ review sprint ------------------------------

    let reviewSprint = new Sprint(
        uuid(),
        'Sprint 3',
        new Date('2023-10-16'),
        new Date('2023-10-30'),
        scrumMaster,
        new ReviewSprintStrategy(),
    );

    let reviewSprintItems = [
        new BacklogItem(
            uuid(),
            'User Story 3',
            'As a user, I want to be able to register.',
            5,
            callACar,
        ),
        new BacklogItem(
            uuid(),
            'User Story 4',
            'As a user, I want to be able to book a car.',
            8,
            callACar,
        ),
    ];

    reviewSprintItems.forEach((item) => {
        item.addObserver(new BacklogItemEventNotifier());
    });

    reviewSprint.addBacklogItems(...reviewSprintItems);
    callACar.addSprint(reviewSprint);
    reviewSprint.start();
    reviewSprint.finish();

    // fail because no document added yet
    try {
        reviewSprint.finalize();
    } catch (error) {
        console.error(error);
    }

    reviewSprint.addReviewDocument(
        new ReviewDocument(uuid(), 'Review Document 1', scrumMaster, new Date()),
    );
    reviewSprint.finalize();
} catch (error) {
    console.error(error);
}
