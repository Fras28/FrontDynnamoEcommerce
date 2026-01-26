import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios'

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      // ELIMINAR las llaves { data }
      const response = await api.get('/orders/admin/all');
      // El interceptor ya hizo su trabajo, response.data es el array
      return response.data; 
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};