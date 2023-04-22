export interface AppState {
  syncing: boolean;
  updateSync: (b: boolean) => void
}