import { create } from "zustand";
const useStore = create((set) => ({
  syncing: false,
  updateSync: (b) => {
    set((state) => ({ syncing: b }));
  },
}));

export default useStore;
