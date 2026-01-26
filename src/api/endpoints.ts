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
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
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
  // Endpoints existentes
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (productData: CreateProductDto): Promise<Product> => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  update: async (id: number, productData: UpdateProductDto): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}`, productData);
    return data;
  },

  delete: async (id: number): Promise<Product> => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  // ✅ NUEVOS ENDPOINTS para soft delete
  getAllIncludingInactive: async (): Promise<Product[]> => {
    const { data } = await api.get('/products/admin/all');
    return data;
  },

  getInactive: async (): Promise<Product[]> => {
    const { data } = await api.get('/products/admin/inactive');
    return data;
  },

  restore: async (id: number): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}/restore`);
    return data;
  },
};

// ==================== ORDERS ====================
export const ordersApi = {
  checkout: async (data: CreateOrderDto) => {
    // Retorna la orden creada con su ID
    const response = await api.post<any>('/orders/checkout', data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get<Order[]>('/orders/my-orders');
    return response.data;
  },
};

// ==================== PAYMENTS ====================
export const paymentsApi = {
  /**
   * Crea la preferencia de Mercado Pago para una orden específica
   */
  createPreference: async (orderId: number) => {
    const response = await api.post(`/payments/create-preference/${orderId}`);
    return response.data; // Retorna { preferenceId, initPoint, sandboxInitPoint }
  },

  /**
   * Consulta el estado actual de un pago en la base de datos
   */
  getPaymentStatus: async (orderId: number) => {
    const response = await api.get(`/payments/status/${orderId}`);
    return response.data;
  }
};

// ==================== CATEGORIES ====================
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  create: async (categoryData: CreateCategoryDto): Promise<Category> => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  update: async (id: number, categoryData: UpdateCategoryDto): Promise<Category> => {
    const { data } = await api.patch(`/categories/${id}`, categoryData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
