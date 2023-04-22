import { create } from "zustand";
import { AppState } from "@/types/AppState";

const useStore = create((set) => ({
  syncing: false,
  updateSync: (b: Boolean) => {
    set((state: AppState) => ({ ...state, syncing: b }));
  },
}));

export default useStore;
