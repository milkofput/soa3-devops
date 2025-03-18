import { IObserver } from './IObserver';

export interface ISubject<T extends ISubject<any>> {
    addObserver(observer: IObserver<T>): void;
    removeObserver(observer: IObserver<T>): void;
    notifyObservers(): void;
}
