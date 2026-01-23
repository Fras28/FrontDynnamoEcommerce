import axios from 'axios';
import { notifications } from '@mantine/notifications';

const API_URL = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Extraer "data" del wrapper y manejo de errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene el wrapper {success, timestamp, path, data}
    // extraer automáticamente el "data"
    if (response.data?.success !== undefined && response.data?.data !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // Manejo de errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      notifications.show({
        title: 'Sesión expirada',
        message: 'Por favor, inicia sesión nuevamente',
        color: 'red',
      });
      window.location.href = '/login';
    }

    // Errores de validación
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Error de validación';
      notifications.show({
        title: 'Error de validación',
        message: Array.isArray(message) ? message.join(', ') : message,
        color: 'red',
      });
    }

    // Errores del servidor
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