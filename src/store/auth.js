import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;