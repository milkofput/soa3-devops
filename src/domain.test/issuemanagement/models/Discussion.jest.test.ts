import { Discussion } from '../../../domain/issuemanagement/models/Discussion';
import { Message } from '../../../domain/issuemanagement/models/Message';
import { BacklogItem } from '../../../domain/issuemanagement/models/BacklogItem';
import { User } from '../../../domain/common/models/User';
import { UserRoleEnum } from '../../../domain/common/enums/UserRoleEnum';
import { DiscussionEventNotifier } from '../../../domain/notifications/models/DiscussionEventNotifier';
import { DoneState } from '../../../domain/issuemanagement/models/backlogitemstates/DoneState';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';
import { DiscussionMessageAddedEvent } from '../../../domain/notifications/models/events/DiscussionMessageAddedEvent';
import { Project } from '../../../domain/common/models/Project';
import { TodoState } from '../../../domain/issuemanagement/models/backlogitemstates/TodoState';

describe('Discussion', () => {
    let discussion: Discussion;
    let backlogItem: jest.Mocked<BacklogItem>;
    let mockNotificationChannel: jest.Mocked<INotificationChannel>;
    let dev1: User;
    let dev2: User;
    let mockDiscussionNotifier: jest.Mocked<DiscussionEventNotifier>;

    beforeEach(() => {
        mockNotificationChannel = {
            sendNotification: jest.fn(),
        } as jest.Mocked<INotificationChannel>;

        dev1 = new User(
            '1',
            'Dev One',
            'dev1@test.com',
            UserRoleEnum.DEVELOPER,
            mockNotificationChannel,
        );
        dev2 = new User(
            '2',
            'Dev Two',
            'dev2@test.com',
            UserRoleEnum.DEVELOPER,
            mockNotificationChannel,
        );

        backlogItem = {
            getTitle: jest.fn().mockReturnValue('Test Item'),
            getState: jest.fn(),
            getId: jest.fn().mockReturnValue('bi1'),
        } as unknown as jest.Mocked<BacklogItem>;

        discussion = new Discussion('d1', 'Test Discussion', backlogItem);
        mockDiscussionNotifier = {
            update: jest.fn(),
        } as unknown as jest.Mocked<DiscussionEventNotifier>;
        discussion.addObserver(mockDiscussionNotifier);
    });

    test('(UT-F8-1) Creating a discussion', () => {
        const backlogItem = new BacklogItem(
            'test-id',
            'Inloggen',
            'Inlogfunctionaliteit',
            7,
            {} as unknown as Project,
        );
        backlogItem.addDiscussion(
            new Discussion('test-id', 'Vraag over API integratie', backlogItem),
        );
        expect(backlogItem.getDiscussions()).toHaveLength(1);
        expect(backlogItem.getDiscussions()[0].getTitle()).toBe('Vraag over API integratie');
    });

    describe('addMessage', () => {
        test('should throw error when discussion is not active', () => {
            backlogItem.getState.mockReturnValue(new DoneState(backlogItem));
            const message = new Message('m1', 'Test message', dev1, new Date());

            expect(() => discussion.addMessage(message)).toThrow();

            expect(discussion.getMessages()).toHaveLength(0);
            expect(mockDiscussionNotifier.update).not.toHaveBeenCalled();
        });

        test('(UT-F8-2) should throw error when backlog item is done', () => {
            backlogItem.getState.mockReturnValue(new DoneState(backlogItem));
            const message = new Message('m1', 'Test message', dev1, new Date());

            expect(() => discussion.addMessage(message)).toThrow();
            expect(discussion.getMessages()).toHaveLength(0);
            expect(mockDiscussionNotifier.update).not.toHaveBeenCalled();
        });

        test('(UT-F8-3) when reopened, can add messages again', () => {
            backlogItem.getState.mockReturnValue(new DoneState(backlogItem));
            const message = new Message('m1', 'Test message', dev1, new Date());

            expect(() => discussion.addMessage(message)).toThrow();

            backlogItem.getState.mockReturnValue(new TodoState(backlogItem));
            discussion.addMessage(message);

            expect(discussion.getMessages()).toHaveLength(1);
            expect(mockDiscussionNotifier.update).toHaveBeenCalledWith(
                discussion,
                expect.any(DiscussionMessageAddedEvent),
            );
        });

        test('should add message and notify observers', () => {
            const message = new Message('m1', 'Test message', dev1, new Date());

            discussion.addMessage(message);

            expect(discussion.getMessages()).toHaveLength(1);
            expect(mockDiscussionNotifier.update).toHaveBeenCalledWith(
                discussion,
                expect.any(DiscussionMessageAddedEvent),
            );
        });

        test('should track participants when adding messages', () => {
            const message1 = new Message('m1', 'First message', dev1, new Date());
            const message2 = new Message('m2', 'Second message', dev2, new Date());

            discussion.addMessage(message1);
            discussion.addMessage(message2);

            expect(discussion.getParticipants().size).toBe(2);
            expect(discussion.getParticipants().has(dev1)).toBe(true);
            expect(discussion.getParticipants().has(dev2)).toBe(true);
        });
    });
});
