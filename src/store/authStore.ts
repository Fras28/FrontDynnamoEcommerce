import { create } from 'zustand';
import { User } from '@/types';

// 1. Definición de la interfaz
interface AuthState {
  user: User | null;
  token: string | null;
  // Recibe un objeto con user y token
  setAuth: (args: { user: any; token: string }) => void; 
  logout: () => void;
}

// Función para decodificar JWT (Mantenemos por si el backend no envía el user completo)
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
  
  // ✅ CORRECCIÓN: La implementación ahora acepta el objeto { user, token }
  setAuth: ({ user, token }) => {
    localStorage.setItem('token', token);
    set({ 
      token, 
      user: user || decodeToken(token) // Si el backend no envía user, intentamos decodificar el token
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

// Lógica de hidratación inicial (opcional pero recomendada)
const savedToken = localStorage.getItem('token');
if (savedToken) {
  const user = decodeToken(savedToken);
  if (user) {
    useAuthStore.getState().setAuth({ user, token: savedToken });
  } else {
    localStorage.removeItem('token');
  }
}