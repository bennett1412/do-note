import { create } from "zustand";
const useStore = create((set) => ({
  syncing: false,
  updateSync: (b) => {
    console.log("updating the state with", b);
    set((state) => ({ syncing: b }));
  },
}));

export default useStore;
