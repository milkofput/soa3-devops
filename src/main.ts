import { UserRoleEnum } from './core/common/enums/UserRoleEnum';
import { Project } from './core/common/models/Project';
import { User } from './core/common/models/User';
import { BacklogItemStatusEnum } from './core/issuemanagement/enums/BacklogItemStatusEnum';
import { BacklogItem } from './core/issuemanagement/models/BacklogItem';
import { Sprint } from './core/issuemanagement/models/Sprint';

console.log('SOA3 Eindopdracht: Avans DevOps');

const uuid = () => {
    return (
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
};

let callACar = new Project(uuid(), 'Call a Car');
let scrumMaster = new User('1', 'John Doe', 'john.doe@example.com', UserRoleEnum.SCRUMMASTER);
let dev1 = new User('2', 'Jane Smith', 'jane.smith@example.com', UserRoleEnum.DEVELOPER);
let dev2 = new User('3', 'Alice Johnson', 'alice.johnson@example.com', UserRoleEnum.DEVELOPER);
callACar.addMembers(scrumMaster, dev1, dev2);

let sprintOne = new Sprint(
    uuid(),
    'Sprint 1',
    new Date('2023-10-01'),
    new Date('2023-10-15'),
    scrumMaster,
);

let items = [
    new BacklogItem(
        uuid(),
        'User Story 1',
        'As a user, I want to be able to log in.',
        3,
        BacklogItemStatusEnum.TODO,
    ).assignTo(dev1),
    new BacklogItem(
        uuid(),
        'User Story 2',
        'As a user, I want to be able to log out.',
        2,
        BacklogItemStatusEnum.TODO,
    ),
];

sprintOne.addBacklogItems(...items);
callACar.addSprint(sprintOne);

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
            `   Assignee: ${item.getAssignee()?.getName() ?? 'Unassigned'} (${
                item.getAssignee()?.getRole() ?? 'N/A'
            })`,
        );
    });

    console.log('\n==================================================');
}

displaySprintDetails(sprintOne, callACar);
