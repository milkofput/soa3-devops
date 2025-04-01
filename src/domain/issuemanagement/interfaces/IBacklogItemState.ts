export interface IBacklogItemState {
    moveToBacklog(): void;
    startDevelopment(): void;
    markReadyForTesting(): void;
    beginTesting(): void;
    completeTesting(): void;
    markAsDone(): void;
}