import { ISubject } from './ISubject';

export interface IObserver<T extends ISubject<any>> {
    update(data: T): void;
}
