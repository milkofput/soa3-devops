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
            Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        );
    };

    let callACar = new Project(uuid(), 'Call a Car', new ProductBacklog(uuid()));
    let scrumMaster = new User('1', 'John Doe', 'john.doe@example.com', UserRoleEnum.SCRUMMASTER, new SlackNotificationAdapter());
    let dev1 = new User('2', 'Jane Smith', 'jane.smith@example.com', UserRoleEnum.DEVELOPER, new SlackNotificationAdapter());
    let test1 = new User('3', 'Alice Johnson', 'alice.johnson@example.com', UserRoleEnum.TESTER, new EmailNotificationAdapter());
    callACar.addMembers(scrumMaster, dev1, test1);

    let sprintOne = new Sprint(
        uuid(),
        'Sprint 1',
        new Date('2023-10-01'),
        new Date('2023-10-15'),
        scrumMaster,
        new ReviewSprintStrategy()
    );

    let items = [
        new BacklogItem(uuid(), 'User Story 1', 'As a user, I want to be able to log in.', 3, callACar).assignTo(
            dev1,
        ),
        new BacklogItem(uuid(), 'User Story 2', 'As a user, I want to be able to log out.', 2, callACar),
    ];

    items.forEach((item) => {
        item.addObserver(new BacklogItemNotifier());
    });

    let sprintEventNotifier = new SprintEventNotifier();
    sprintOne.addObserver(sprintEventNotifier);

    sprintOne.addBacklogItems(...items);
    callACar.addSprint(sprintOne);
    sprintOne.start();

    function displaySprintDetails(sprint: Sprint, project: Project) {
        console.log('\n==================================================');
        console.log(`SPRINT DETAILS: ${sprint.getName()} (${project.getName()})`);
        console.log('==================================================');
        console.log(
            `Duration: ${sprint.getStartDate().toDateString()} - ${sprint.getEndDate().toDateString()}`,
        );
        console.log(`Scrum Master: ${sprint.getScrumMaster().getName()}`);
        console.log('\nBACKLOG ITEMS:');

        const items = sprint.getBacklogItems();
        items.forEach((item, index) => {
            console.log(`\n#${index + 1}: ${item.getTitle()}`);
            console.log(`   Description: ${item.getDescription()}`);
            console.log(`   Status: ${item.getStatus()}`);
            console.log(`   Story Points: ${item.getStoryPoints()}`);
            console.log(
                `   Assignee: ${item.getAssignee()?.getName() ?? 'Unassigned'} (${item.getAssignee()?.getRole() ?? 'N/A'
                })`,
            );
        });

        console.log('\n==================================================');
    }

    items[0].setStatus(BacklogItemStatusEnum.TESTING);

    items[0].setStatus(BacklogItemStatusEnum.TODO);

    sprintOne.finish();

    //sprintOne.finalize();

    sprintOne.addReviewDocument(new ReviewDocument(uuid(), 'Review Document 1', scrumMaster, new Date()));

    sprintOne.finalize();

} catch (error) {
    console.error(error);
}