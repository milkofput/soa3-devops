import { ReviewDocument } from '../models/ReviewDocument';

export interface ISprintState {
    start(): void;
    finish(): void;
    finalize(): void;
    cancel(): void;
}