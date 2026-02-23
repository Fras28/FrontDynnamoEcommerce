import axios from 'axios';
import { notifications } from '@mantine/notifications';

const API_URL = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';

// ============================================
// CONFIGURACIÓN MULTI-TENANT
// ============================================
// Cambiar este valor para switchear entre comercios:
// 'alquimystic' | 'grupo-gregori' | 'look-arround'
const STORE_SLUG = 'alquimystic' as const;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Excepción: confirm-email no lleva storeId
    const isConfirmEmail = config.url?.includes('/auth/confirm-email');
    
    if (!isConfirmEmail) {
      config.headers['X-Store-ID'] = STORE_SLUG;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data?.success !== undefined && response.data?.data !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      notifications.show({
        title: 'Sesión expirada',
        message: 'Por favor, inicia sesión nuevamente',
        color: 'red',
      });
      window.location.href = '/login';
    }

    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Error de validación';
      notifications.show({
        title: 'Error de validación',
        message: Array.isArray(message) ? message.join(', ') : message,
        color: 'red',
      });
    }

    if (error.response?.status >= 500) {
      notifications.show({
        title: 'Error del servidor',
        message: 'Ocurrió un error inesperado. Intenta nuevamente.',
        color: 'red',
      });
    }

    return Promise.reject(error);
  }
);