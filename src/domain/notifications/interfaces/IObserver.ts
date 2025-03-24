import { ISubject } from './ISubject';
import { IEvent } from './IEvent';

export interface IObserver<T extends ISubject<any>> {
    update(subject: T, event?: IEvent): void;
}
