import { DiscussionEventNotifier } from '../../../domain/notifications/models/DiscussionEventNotifier';
import { Discussion } from '../../../domain/issuemanagement/models/Discussion';
import { Message } from '../../../domain/issuemanagement/models/Message';
import { User } from '../../../domain/common/models/User';
import { UserRoleEnum } from '../../../domain/common/enums/UserRoleEnum';
import { INotificationChannel } from '../../../domain/notifications/interfaces/INotificationChannel';
import { DiscussionMessageAddedEvent } from '../../../domain/notifications/models/events/DiscussionMessageAddedEvent';
import { PipelineOutcomeEvent } from '../../../domain/notifications/models/events/PipelineOutcomeEvent';
import { IEvent } from '../../../domain/notifications/interfaces/IEvent';

describe('DiscussionEventNotifier', () => {
    let notifier: DiscussionEventNotifier;
    let discussion: jest.Mocked<Discussion>;
    let mockNotificationChannel: jest.Mocked<INotificationChannel>;
    let author: User;
    let participant1: User;
    let participant2: User;
    let message: Message;
    let event: DiscussionMessageAddedEvent;

    beforeEach(() => {
        mockNotificationChannel = {
            sendNotification: jest.fn(),
        } as jest.Mocked<INotificationChannel>;

        author = new User(
            'author1',
            'Author',
            'author@test.com',
            UserRoleEnum.DEVELOPER,
            mockNotificationChannel,
        );

        participant1 = new User(
            'part1',
            'Participant 1',
            'part1@test.com',
            UserRoleEnum.DEVELOPER,
            mockNotificationChannel,
        );

        participant2 = new User(
            'part2',
            'Participant 2',
            'part2@test.com',
            UserRoleEnum.DEVELOPER,
            mockNotificationChannel,
        );

        message = new Message('msg1', 'Test Message', author, new Date());

        discussion = {
            getTitle: jest.fn().mockReturnValue('Test Discussion'),
            getParticipants: jest
                .fn()
                .mockReturnValue(new Set([author, participant1, participant2])),
            getId: jest.fn().mockReturnValue('d1'),
        } as unknown as jest.Mocked<Discussion>;

        event = new DiscussionMessageAddedEvent(discussion, message);
        notifier = new DiscussionEventNotifier();
    });

    describe('update', () => {
        test('Path 1: should handle undefined event', () => {
            notifier.update(discussion, undefined);

            expect(mockNotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(discussion.getParticipants).not.toHaveBeenCalled();
        });

        test('Path 2: should not send notifications for non-DiscussionMessageAddedEvent', () => {
            let mockEvent: jest.Mocked<IEvent> = {} as unknown as jest.Mocked<IEvent>;
            notifier.update(discussion, mockEvent);

            expect(mockNotificationChannel.sendNotification).not.toHaveBeenCalled();
            expect(discussion.getParticipants).not.toHaveBeenCalled();
        });

        test('(UT-F7-5) Path 3: should send notifications to all participants except author', () => {
            notifier.update(discussion, event);

            expect(discussion.getParticipants).toHaveBeenCalled();
            expect(mockNotificationChannel.sendNotification).toHaveBeenCalledTimes(2);

            const expectedMessage = `New message in discussion "Test Discussion" from Author`;
            expect(mockNotificationChannel.sendNotification).toHaveBeenCalledWith(
                participant1,
                expectedMessage,
            );
            expect(mockNotificationChannel.sendNotification).toHaveBeenCalledWith(
                participant2,
                expectedMessage,
            );
        });

        test('Path 4: should not send notifications when only author is participant', () => {
            discussion.getParticipants.mockReturnValue(new Set([author]));

            notifier.update(discussion, event);

            expect(discussion.getParticipants).toHaveBeenCalled();
            expect(mockNotificationChannel.sendNotification).not.toHaveBeenCalled();
        });

        test('(UT-F7-6) Notifications should be sent to preferred channel for each participant', () => {
            const preferredChannel1 = {
                sendNotification: jest.fn(),
            } as unknown as jest.Mocked<INotificationChannel>;
            const preferredChannel2 = {
                sendNotification: jest.fn(),
            } as unknown as jest.Mocked<INotificationChannel>;

            (participant1 as any).preferredNotificationChannel = preferredChannel1;
            (participant2 as any).preferredNotificationChannel = preferredChannel2;

            notifier.update(discussion, event);

            expect(preferredChannel1.sendNotification).toHaveBeenCalledWith(
                participant1,
                `New message in discussion "Test Discussion" from Author`,
            );
            expect(preferredChannel2.sendNotification).toHaveBeenCalledWith(
                participant2,
                `New message in discussion "Test Discussion" from Author`,
            );
        });
    });
});
