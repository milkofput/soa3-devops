import { IPipelineBuilder } from './domain/cicd/interface/IPipelineBuilder';
import { ExecutionVisitor } from './domain/cicd/models/ExecutionVisitor';
import { FailingExecutionVisitor } from './domain/cicd/models/FailingExecutionVisitor';
import { StandardPipelineBuilder } from './domain/cicd/models/StandardPipelineBuilder';
import { UserRoleEnum } from './domain/common/enums/UserRoleEnum';
import { ProductBacklog } from './domain/common/models/ProductBacklog';
import { Project } from './domain/common/models/Project';
import { User } from './domain/common/models/User';
import { BacklogItemStatusEnum } from './domain/issuemanagement/enums/BacklogItemStatusEnum';
import { BacklogItem } from './domain/issuemanagement/models/BacklogItem';
import { ReviewDocument } from './domain/issuemanagement/models/ReviewDocument';
import { Sprint } from './domain/issuemanagement/models/Sprint';
import { ReleaseSprintStrategy } from './domain/issuemanagement/models/sprintstrategies/ReleaseSprintStrategy';
import { ReviewSprintStrategy } from './domain/issuemanagement/models/sprintstrategies/ReviewSprintStrategy';
import { BacklogItemNotifier } from './domain/notifications/models/BacklogItemEventNotifier';
import { EmailNotificationAdapter } from './domain/notifications/models/EmailNotificationAdapter';
import { SlackNotificationAdapter } from './domain/notifications/models/SlackNotificationAdapter';
import { SprintEventNotifier } from './domain/notifications/models/SprintEventNotifier';

try {
    console.log('SOA3 Eindopdracht: Avans DevOps');

    const uuid = () => {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    };

    let productOwner = new User('0', 'Jane Doe', 'jane.doe@example.com', UserRoleEnum.PRODUCTOWNER, new EmailNotificationAdapter());
    let callACar = new Project(uuid(), 'Call a Car', new ProductBacklog(uuid()), productOwner);
    let scrumMaster = new User('1', 'John Doe', 'john.doe@example.com', UserRoleEnum.SCRUMMASTER, new SlackNotificationAdapter());
    let dev1 = new User('2', 'Jane Smith', 'jane.smith@example.com', UserRoleEnum.DEVELOPER, new SlackNotificationAdapter());
    let test1 = new User('3', 'Alice Johnson', 'alice.johnson@example.com', UserRoleEnum.TESTER, new EmailNotificationAdapter());
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
        new BacklogItem(uuid(), 'User Story 1', 'As a user, I want to be able to log in.', 3, callACar).assignTo(
            dev1,
        ),
        new BacklogItem(uuid(), 'User Story 2', 'As a user, I want to be able to log out.', 2, callACar),
    ];

    releaseSprintItems.forEach((item) => {
        item.addObserver(new BacklogItemNotifier());
    });

    let sprintEventNotifier = new SprintEventNotifier();
    releaseSprint.addObserver(sprintEventNotifier);

    releaseSprint.addBacklogItems(...releaseSprintItems);
    callACar.addSprint(releaseSprint);
    releaseSprint.start();

    releaseSprintItems[0].setStatus(BacklogItemStatusEnum.TESTING);
    releaseSprintItems[0].setStatus(BacklogItemStatusEnum.TODO);

    releaseSprint.setPipeline(pipeline);

    releaseSprint.finish();

    releaseSprint.finalize();

    // ------------------------------ review sprint ------------------------------

    let reviewSprint = new Sprint(
        uuid(),
        'Sprint 2',
        new Date('2023-10-16'),
        new Date('2023-10-30'),
        scrumMaster,
        new ReviewSprintStrategy(),
    );

    let reviewSprintItems = [
        new BacklogItem(uuid(), 'User Story 3', 'As a user, I want to be able to register.', 5, callACar),
        new BacklogItem(uuid(), 'User Story 4', 'As a user, I want to be able to book a car.', 8, callACar),
    ];

    reviewSprintItems.forEach((item) => {
        item.addObserver(new BacklogItemNotifier());
    });

    reviewSprint.addBacklogItems(...reviewSprintItems);
    callACar.addSprint(reviewSprint);
    reviewSprint.start();


    reviewSprintItems[0].setStatus(BacklogItemStatusEnum.TESTING);
    reviewSprintItems[0].setStatus(BacklogItemStatusEnum.TODO);

    reviewSprint.finish();

    //releaseSprint.finalize();

    reviewSprint.addReviewDocument(
        new ReviewDocument(uuid(), 'Review Document 1', scrumMaster, new Date()),
    );

    reviewSprint.finalize();

    // ------------------------------ failing release sprint ------------------------------

    let failReleaseSprint = new Sprint(
        uuid(),
        'Sprint 3',
        new Date('2023-10-31'),
        new Date('2023-11-15'),
        scrumMaster,
        new ReleaseSprintStrategy(new FailingExecutionVisitor(["npm build"])),
    );

    let failReleaseSprintItems = [
        new BacklogItem(uuid(), 'User Story 5', 'As a user, I want to be able to view my booking.', 3, callACar),
        new BacklogItem(uuid(), 'User Story 6', 'As a user, I want to be able to cancel my booking.', 2, callACar),
    ];

    failReleaseSprintItems.forEach((item) => {
        item.addObserver(new BacklogItemNotifier());
    });

    failReleaseSprint.addBacklogItems(...failReleaseSprintItems);
    callACar.addSprint(failReleaseSprint);
    failReleaseSprint.start();

    failReleaseSprintItems[0].setStatus(BacklogItemStatusEnum.TESTING);

    failReleaseSprint.finish();

    failReleaseSprint.setPipeline(pipeline);

    failReleaseSprint.finalize();


} catch (error) {
    console.error(error);
}
