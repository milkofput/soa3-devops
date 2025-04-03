import { ProductBacklog } from '../../../domain/common/models/ProductBacklog';
import { BacklogItem } from '../../../domain/issuemanagement/models/BacklogItem';

describe('ProductBacklog', () => {
    describe('addBacklogItems', () => {
        test('should add items to the backlog', () => {
            const backlog = new ProductBacklog('pb1');
            const item1 = { getId: jest.fn().mockReturnValue('bi1') } as unknown as BacklogItem;
            const item2 = { getId: jest.fn().mockReturnValue('bi2') } as unknown as BacklogItem;

            backlog.addBacklogItems(item1, item2);

            expect(backlog.getItems()).toHaveLength(2);
            expect(backlog.getItems()).toContain(item1);
            expect(backlog.getItems()).toContain(item2);
        });
    });

    describe('removeBacklogItems', () => {
        test('should remove items from the backlog', () => {
            const backlog = new ProductBacklog('pb1');
            const item1 = { getId: jest.fn().mockReturnValue('bi1') } as unknown as BacklogItem;
            const item2 = { getId: jest.fn().mockReturnValue('bi2') } as unknown as BacklogItem;

            backlog.addBacklogItems(item1, item2);
            backlog.removeBacklogItems(item1);

            expect(backlog.getItems()).toHaveLength(1);
            expect(backlog.getItems()).not.toContain(item1);
            expect(backlog.getItems()).toContain(item2);
        });

        test('no remove calls are made if none of the items exist in the backlog', () => {
            const backlog = new ProductBacklog('pb1');
            const item1 = { getId: jest.fn().mockReturnValue('bi1') } as unknown as BacklogItem;
            const item2 = { getId: jest.fn().mockReturnValue('bi2') } as unknown as BacklogItem;

            backlog.addBacklogItems(item1);
            backlog.removeBacklogItems(item2);

            expect(backlog.getItems()).toHaveLength(1);
            expect(backlog.getItems()).toContain(item1);
        });
    });
});
