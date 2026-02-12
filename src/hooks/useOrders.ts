import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { Order } from '../types';

/**
 * Hook para obtener una orden específica por ID
 * Funciona tanto para usuarios (sus propias órdenes) como para admins
 */
export const useOrder = (orderId: number | null) => {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId, // Solo ejecutar si hay un orderId válido
  });
};

/**
 * Hook para obtener las órdenes del usuario actual
 */
export const useMyOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/me');
      return response.data;
    },
  });
};

/**
 * Hook para obtener todas las órdenes (Admin)
 */
export const useAdminOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/admin/all');
      return response.data;
    },
  });
};

/**
 * Hook para actualizar el estado de una orden (Admin)
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidar la orden específica
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      // Invalidar la lista de órdenes del admin
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      // Invalidar las órdenes del usuario
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};