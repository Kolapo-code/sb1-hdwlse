import { create } from 'zustand';
import { auth } from '../services/auth';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

// Listen to auth state changes
auth.onAuthStateChanged((user) => {
  useAuthStore.getState().setUser(user);
});