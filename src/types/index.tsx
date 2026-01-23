// Enums
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// User Types
export interface User {
  userId: number;
  email: string;
  role: Role;
}

// Auth Types - Ahora simple porque el interceptor extrae el "data"
export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  message?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  role?: Role;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
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

// Wrapper genérico (por si lo necesitas en algún lugar)
export interface ApiResponseWrapper<T> {
  success: boolean;
  timestamp: string;
  path: string;
  data: T;
}

// API Response (mantén este si lo usas en otros lugares)
export interface ApiResponse<T = any> {
  success: boolean;
  timestamp: string;
  path: string;
  data: T;
}