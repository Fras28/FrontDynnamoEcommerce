// Enums
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// User Types
export interface User {
  userId: number;
  email: string;
  role: Role;
}

// Auth Types
export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: number;
    email: string;
    role: Role;
    phone?: string;
    address?: string;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  role?: Role;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// ===================================================================
// ✨ NUEVOS TIPOS PARA VARIANTES
// ===================================================================

// Talle
export interface Size {
  id: number;
  name: string; // "XS", "S", "M", "L", "XL", etc.
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    variants: number;
  };
}

export interface CreateSizeDto {
  name: string;
  order?: number;
}

export interface UpdateSizeDto extends Partial<CreateSizeDto> {
  isActive?: boolean;
}

// Color
export interface Color {
  id: number;
  name: string; // "Rojo", "Azul", "Negro", etc.
  hexCode?: string | null; // "#FF0000"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    variants: number;
  };
}

export interface CreateColorDto {
  name: string;
  hexCode?: string;
}

export interface UpdateColorDto extends Partial<CreateColorDto> {
  isActive?: boolean;
}

// Variante de Producto
export interface ProductVariant {
  id: number;
  productId: number;
  sizeId?: number | null;
  colorId?: number | null;
  size?: Size | null;
  color?: Color | null;
  stock: number;
  sku?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariantDto {
  sizeId?: number;
  colorId?: number;
  stock: number;
  sku?: string;
}

export interface UpdateVariantDto {
  stock?: number;
  sku?: string | null;
  isActive?: boolean;
}

// ===================================================================
// PRODUCT TYPES ACTUALIZADOS
// ===================================================================

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
  isPrimary?: boolean;
  order?: number;
  createdAt?: string;
}

// ✨ Product actualizado con variantes
export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number; // Stock base (solo relevante si hasVariants = false)
  isActive: boolean;
  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  images: ProductImage[];
  
  // ✨ NUEVO: Soporte de variantes
  hasVariants: boolean;
  variants?: ProductVariant[];
  
  // ✨ Campos para selección de variante (usado en UI/Cart)
  selectedVariantId?: number;
  selectedVariant?: ProductVariant;
  
  createdAt: string;
  updatedAt: string;
}

// ✨ DTO para crear producto actualizado
export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number; // Stock base (se usa si NO tiene variantes)
  images: string[]; // Array de URLs
  categoryId?: number;
  
  // ✨ NUEVO: Campos de variantes
  hasVariants?: boolean;
  variants?: Array<{
    sizeId?: number;
    colorId?: number;
    stock: number;
    sku?: string;
  }>;
}

export interface UpdateProductDto extends Partial<Omit<CreateProductDto, 'hasVariants' | 'variants'>> {
  // No se permite cambiar hasVariants después de crear
  // Las variantes se gestionan por separado
}

// ===================================================================
// CART & ORDER TYPES ACTUALIZADOS
// ===================================================================

// ✨ Cart Item actualizado con variante seleccionada
export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: number; // ID de la variante seleccionada (si aplica)
  selectedVariant?: ProductVariant; // Datos de la variante seleccionada
}

// ✨ Order Item actualizado
export interface OrderItem {
  productId: number;
  variantId?: number; // ✨ NUEVO: ID de la variante si aplica
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
  total: number;
  paymentMethod?: 'mercadopago' | 'transfer' | 'cash';
  discount?: number;
  finalTotal?: number;
}

// ✨ Order actualizado con variantes
export interface Order {
  id: number;
  userId: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod?: 'mercadopago' | 'transfer' | 'cash';
  paymentStatus?: 'PENDING' | 'PENDING_CONFIRMATION' | 'APPROVED' | 'REJECTED';
  discount?: number;
  finalTotal?: number;
  items: {
    id: number;
    productId: number;
    variantId?: number | null; // ✨ NUEVO
    variant?: ProductVariant | null; // ✨ NUEVO: Datos de la variante
    quantity: number;
    price: number;
    product?: {
      id: number;
      name: string;
      images?: { url: string }[];
      imageUrl?: string;
    };
  }[];
  user?: {
    id: number;
    email: string;
    phone?: string;
    address?: string;
  };
}

// Métricas (sin cambios)
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrdersToday: number;
  averageOrderValue: number;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  category?: string;
  imageUrl?: string;
}

export interface TopCustomer {
  userId: number;
  email: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  phone?: string;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  orders: number;
}

export interface SalesByCategory {
  categoryId: number;
  categoryName: string;
  totalRevenue: number;
  totalQuantity: number;
  productsCount: number;
}

// Wrappers
export interface ApiResponseWrapper<T> {
  success: boolean;
  timestamp: string;
  path: string;
  data: T;
}

export interface ApiResponse<T = any> {
  success: boolean;
  timestamp: string;
  path: string;
  data: T;
}