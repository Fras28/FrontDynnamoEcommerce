import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (token: string) => void;
  logout: () => void;
}

// Función para decodificar JWT
const decodeToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(
      window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  setAuth: (token: string) => {
    const user = decodeToken(token);
    localStorage.setItem('token', token);
    set({ token, user });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

// Inicializar el usuario si hay un token en localStorage
const token = localStorage.getItem('token');
if (token) {
  const user = decodeToken(token);
  if (user) {
    useAuthStore.setState({ user, token });
  } else {
    localStorage.removeItem('token');
  }
}