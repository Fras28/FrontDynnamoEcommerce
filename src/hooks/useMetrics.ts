import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';

// Tipos
export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrdersToday: number;
  averageOrderValue: number;
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

// Hooks
export const useDashboardMetrics = () => {
  return useQuery<DashboardMetrics>({
    queryKey: ['metrics', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/metrics/dashboard');
      return data;
    },
  });
};

export const useSalesMetrics = (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') => {
  return useQuery<SalesMetrics>({
    queryKey: ['metrics', 'sales', period],
    queryFn: async () => {
      const { data } = await api.get(`/metrics/sales?period=${period}`);
      return data;
    },
  });
};

export const useRevenueChart = (
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  limit: number = 30
) => {
  return useQuery<RevenueByPeriod[]>({
    queryKey: ['metrics', 'revenue-chart', period, limit],
    queryFn: async () => {
      const { data } = await api.get(`/metrics/revenue-chart?period=${period}&limit=${limit}`);
      return data;
    },
  });
};

export const useTopProducts = (limit: number = 10) => {
  return useQuery<TopProduct[]>({
    queryKey: ['metrics', 'top-products', limit],
    queryFn: async () => {
      const { data } = await api.get(`/metrics/top-products?limit=${limit}`);
      return data;
    },
  });
};

export const useTopCustomers = (limit: number = 10) => {
  return useQuery<TopCustomer[]>({
    queryKey: ['metrics', 'top-customers', limit],
    queryFn: async () => {
      const { data } = await api.get(`/metrics/top-customers?limit=${limit}`);
      return data;
    },
  });
};

export const useSalesByCategory = () => {
  return useQuery<SalesByCategory[]>({
    queryKey: ['metrics', 'sales-by-category'],
    queryFn: async () => {
      const { data } = await api.get('/metrics/sales-by-category');
      return data;
    },
  });
};