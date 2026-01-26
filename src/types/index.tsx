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

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
  isActive: boolean;  // ✅ NUEVO
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;  // ✅ NUEVO: Contador de órdenes
  };
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

// Cart Types
export interface CartItem extends Product {
  quantity: number;
}

// Order Types
export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: {
    id: number;
    productId: number;
    quantity: number;
    price: number;
  }[];
}

// Wrapper genérico
export interface ApiResponseWrapper<T> {
  success: boolean;
  timestamp: string;
  path: string;
  data: T;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  timestamp: string;
  path: string;
  data: T;
}