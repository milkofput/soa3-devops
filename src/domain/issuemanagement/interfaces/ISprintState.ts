import { ReviewDocument } from '../models/ReviewDocument';

export interface ISprintState {
    create(): void;
    start(): void;
    finish(): void;
    review(reviewDocument: ReviewDocument): void;
    release(): void;
    cancel(): void;
}