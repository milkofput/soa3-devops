import { ReviewDocument } from '../models/ReviewDocument';

export interface ISprintState {
    create(): void;
    start(): void;
    finish(): void;
    finalize(): void;
    cancel(): void;
}