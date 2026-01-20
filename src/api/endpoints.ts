import { api } from './axios';
import {
  AuthResponse,
  Product,
  CreateProductDto,
  UpdateProductDto,
  CreateOrderDto,
  Order,
  LoginFormData,
  RegisterFormData,
} from '@/types';

// ==================== AUTH ====================
export const authApi = {
  login: async (data: LoginFormData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  },
};

// ==================== PRODUCTS ====================
export const productsApi = {
  getAll: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto) => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductDto) => {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// ==================== ORDERS ====================
export const ordersApi = {
  checkout: async (data: CreateOrderDto) => {
    const response = await api.post<Order>('/orders/checkout', data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get<Order[]>('/orders/my-orders');
    return response.data;
  },
};