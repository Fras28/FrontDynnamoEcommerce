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
  UpdateCategoryDto,
  Size,
  CreateSizeDto,
  UpdateSizeDto,
  Color,
  CreateColorDto,
  UpdateColorDto,
  CreateVariantDto,
  UpdateVariantDto,
  ProductVariant,
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

// ===================================================================
// ✨ SIZES API (NUEVO)
// ===================================================================
export const sizesApi = {
  // Obtener talles activos (público)
  getAll: async (): Promise<Size[]> => {
    const { data } = await api.get('/sizes');
    return data;
  },

  // Obtener todos los talles incluidos inactivos (admin)
  getAllIncludingInactive: async (): Promise<Size[]> => {
    const { data } = await api.get('/sizes/admin/all');
    return data;
  },

  // Obtener un talle por ID
  getById: async (id: number): Promise<Size> => {
    const { data } = await api.get(`/sizes/${id}`);
    return data;
  },

  // Crear talle (admin)
  create: async (sizeData: CreateSizeDto): Promise<Size> => {
    const { data } = await api.post('/sizes', sizeData);
    return data;
  },

  // Actualizar talle (admin)
  update: async (id: number, sizeData: UpdateSizeDto): Promise<Size> => {
    const { data } = await api.patch(`/sizes/${id}`, sizeData);
    return data;
  },

  // Eliminar talle (admin) - soft/hard delete
  delete: async (id: number): Promise<any> => {
    const { data } = await api.delete(`/sizes/${id}`);
    return data;
  },

  // Reactivar talle (admin)
  restore: async (id: number): Promise<Size> => {
    const { data } = await api.patch(`/sizes/${id}/restore`);
    return data;
  },
};

// ===================================================================
// ✨ COLORS API (NUEVO)
// ===================================================================
export const colorsApi = {
  // Obtener colores activos (público)
  getAll: async (): Promise<Color[]> => {
    const { data } = await api.get('/colors');
    return data;
  },

  // Obtener todos los colores incluidos inactivos (admin)
  getAllIncludingInactive: async (): Promise<Color[]> => {
    const { data } = await api.get('/colors/admin/all');
    return data;
  },

  // Obtener un color por ID
  getById: async (id: number): Promise<Color> => {
    const { data } = await api.get(`/colors/${id}`);
    return data;
  },

  // Crear color (admin)
  create: async (colorData: CreateColorDto): Promise<Color> => {
    const { data } = await api.post('/colors', colorData);
    return data;
  },

  // Actualizar color (admin)
  update: async (id: number, colorData: UpdateColorDto): Promise<Color> => {
    const { data } = await api.patch(`/colors/${id}`, colorData);
    return data;
  },

  // Eliminar color (admin) - soft/hard delete
  delete: async (id: number): Promise<any> => {
    const { data } = await api.delete(`/colors/${id}`);
    return data;
  },

  // Reactivar color (admin)
  restore: async (id: number): Promise<Color> => {
    const { data } = await api.patch(`/colors/${id}/restore`);
    return data;
  },
};

// ============= PRODUCTS API (ACTUALIZADO) =============
export const productsApi = {
  // Obtener productos activos (público)
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },

  // Obtener un producto por ID
  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // Obtener TODOS los productos incluidos inactivos (admin)
  getAllIncludingInactive: async (): Promise<Product[]> => {
    const { data } = await api.get('/products/admin/all');
    return data;
  },

  // Obtener solo productos inactivos (admin)
  getInactive: async (): Promise<Product[]> => {
    const { data } = await api.get('/products/admin/inactive');
    return data;
  },

  // Crear producto (con soporte de variantes)
  create: async (productData: CreateProductDto): Promise<Product> => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  // Actualizar producto
  update: async (id: number, productData: UpdateProductDto): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}`, productData);
    return data;
  },

  // Eliminar producto (soft/hard delete)
  delete: async (id: number): Promise<any> => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  // Reactivar producto inactivo
  restore: async (id: number): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}/restore`);
    return data;
  },

  // ===================================================================
  // ✨ VARIANTES (NUEVO)
  // ===================================================================

  // Obtener variantes de un producto
  getVariants: async (productId: number): Promise<ProductVariant[]> => {
    const { data } = await api.get(`/products/${productId}/variants`);
    return data;
  },

  // Agregar variante a un producto (admin)
  addVariant: async (productId: number, variantData: CreateVariantDto): Promise<ProductVariant> => {
    const { data } = await api.post(`/products/${productId}/variants`, variantData);
    return data;
  },

  // Actualizar una variante (admin)
  updateVariant: async (variantId: number, variantData: UpdateVariantDto): Promise<ProductVariant> => {
    const { data } = await api.patch(`/products/variants/${variantId}`, variantData);
    return data;
  },

  // Eliminar variante (admin)
  deleteVariant: async (variantId: number): Promise<any> => {
    const { data } = await api.delete(`/products/variants/${variantId}`);
    return data;
  },

  // Aumentar stock de variante (admin)
  increaseVariantStock: async (variantId: number, quantity: number): Promise<ProductVariant> => {
    const { data } = await api.patch(`/products/variants/${variantId}/increase-stock`, { quantity });
    return data;
  },

  // Reducir stock de variante (admin)
  decreaseVariantStock: async (variantId: number, quantity: number): Promise<ProductVariant> => {
    const { data } = await api.patch(`/products/variants/${variantId}/decrease-stock`, { quantity });
    return data;
  },
};

// ==================== ORDERS (ACTUALIZADO) ====================
export const ordersApi = {
  checkout: async (data: CreateOrderDto) => {
    // Retorna la orden creada con su ID
    const response = await api.post<any>('/orders/checkout', data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get<Order[]>('/orders/me');
    return response.data;
  },

  // Obtener una orden específica por ID
  getOrderById: async (orderId: number) => {
    const response = await api.get<Order>(`/orders/${orderId}`);
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

// ==================== FAVORITES ====================
export const favoritesApi = {
  toggle: async (productId: number) => {
    const response = await api.post('/favorites/toggle', { productId });
    return response.data; // Retorna { action: 'added' | 'removed' }
  },
  
  getUserFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  }
};