import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/endpoints'; // ⚠️ AJUSTA ESTA RUTA según tu estructura
import { CreateProductDto, UpdateProductDto } from '@/types';
import { notifications } from '@mantine/notifications';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

// ✅ Hook para obtener todos los productos (incluidos inactivos) - Solo Admin
export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: productsApi.getAllIncludingInactive,
  });
};

// ✅ Hook para obtener productos inactivos - Solo Admin
export const useInactiveProducts = () => {
  return useQuery({
    queryKey: ['products', 'inactive'],
    queryFn: productsApi.getInactive,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      notifications.show({
        title: 'Producto creado',
        message: 'El producto se creó exitosamente',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al crear el producto',
        color: 'red',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductDto }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      notifications.show({
        title: 'Producto actualizado',
        message: 'El producto se actualizó exitosamente',
        color: 'blue',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al actualizar el producto',
        color: 'red',
      });
    },
  });
};

// 🔧 CORREGIDO: Ahora invalida AMBAS queries
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: (data) => {
      // ✅ Invalida la lista de productos activos
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // ✅ AGREGADO: Invalida la lista de productos inactivos
      queryClient.invalidateQueries({ queryKey: ['products', 'inactive'] });
      
      // Verificar si fue soft delete o hard delete
      const wasDeactivated = data.isActive === false;
      
      notifications.show({
        title: wasDeactivated ? 'Producto desactivado' : 'Producto eliminado',
        message: wasDeactivated 
          ? 'El producto fue desactivado porque tiene órdenes asociadas. Puedes reactivarlo cuando quieras.'
          : 'El producto se eliminó permanentemente',
        color: wasDeactivated ? 'orange' : 'red',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al eliminar el producto',
        color: 'red',
      });
    },
  });
};

// 🔧 CORREGIDO: Ahora invalida AMBAS queries
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.restore(id),
    onSuccess: () => {
      // ✅ Invalida la lista de productos activos
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // ✅ AGREGADO: Invalida la lista de productos inactivos
      queryClient.invalidateQueries({ queryKey: ['products', 'inactive'] });
      
      notifications.show({
        title: 'Producto reactivado',
        message: 'El producto volvió a estar disponible en la tienda',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al reactivar el producto',
        color: 'red',
      });
    },
  });
};