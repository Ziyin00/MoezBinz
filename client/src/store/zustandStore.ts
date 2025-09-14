import { create } from 'zustand';

interface UIState {
  globalLoading: boolean;
  setGlobalLoading: (val: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (val: boolean) => void;
}

const useUIStore = create<UIState>((set) => ({
  globalLoading: false,
  setGlobalLoading: (val) => set({ globalLoading: val }),
  authModalOpen: false,
  setAuthModalOpen: (val) => set({ authModalOpen: val }),
}));

export default useUIStore;
