import { Project } from '../../../domain/common/models/Project';
import { BacklogItem } from '../../../domain/issuemanagement/models/BacklogItem';
import { IEvent } from '../../../domain/notifications/interfaces/IEvent';
import { IObserver } from '../../../domain/notifications/interfaces/IObserver';

describe('BacklogItem', () => {
    let backlogItem: BacklogItem;
    let mockObserver: jest.Mocked<IObserver<BacklogItem>>;
    let mockEvent: IEvent;

    beforeEach(() => {
        backlogItem = new BacklogItem('id1', 'Test Item', 'Description', 3, {} as Project);

        mockObserver = {
            update: jest.fn(),
        };

        mockEvent = {} as IEvent;
    });

    test('should add observer', () => {
        backlogItem.addObserver(mockObserver);
        backlogItem.notifyObservers(mockEvent);
        expect(mockObserver.update).toHaveBeenCalledWith(backlogItem, mockEvent);
    });

    test('should not add same observer twice', () => {
        backlogItem.addObserver(mockObserver);
        backlogItem.addObserver(mockObserver);
        backlogItem.notifyObservers(mockEvent);
        expect(mockObserver.update).toHaveBeenCalledTimes(1);
    });

    test('should remove observer', () => {
        backlogItem.addObserver(mockObserver);
        backlogItem.removeObserver(mockObserver);
        backlogItem.notifyObservers(mockEvent);
        expect(mockObserver.update).not.toHaveBeenCalled();
    });

    test('should not fail when removing non-existent observer', () => {
        expect(() => backlogItem.removeObserver(mockObserver)).not.toThrow();
    });
});
