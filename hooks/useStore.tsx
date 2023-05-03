import { create } from "zustand";
import { AppState } from "@/types/AppState";

const useStore = create<AppState>((set) => ({
  syncing: false,
  updateSync: (b: boolean) => {
    set((state) => ({ ...state, syncing: b }));
  },
}));

export default useStore;
