import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sizesApi, colorsApi } from '@/api/endpoints';
import { CreateSizeDto, UpdateSizeDto, CreateColorDto, UpdateColorDto } from '@/types';
import { notifications } from '@mantine/notifications';

// ===================================================================
// SIZES HOOKS
// ===================================================================

/**
 * Obtener talles activos (público)
 */
export const useSizes = () => {
  return useQuery({
    queryKey: ['sizes'],
    queryFn: sizesApi.getAll,
  });
};

/**
 * Obtener todos los talles incluidos inactivos (admin)
 */
export const useAllSizes = () => {
  return useQuery({
    queryKey: ['sizes', 'all'],
    queryFn: sizesApi.getAllIncludingInactive,
  });
};

/**
 * Obtener un talle por ID
 */
export const useSize = (id: number) => {
  return useQuery({
    queryKey: ['sizes', id],
    queryFn: () => sizesApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Crear talle (admin)
 */
export const useCreateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSizeDto) => sizesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      notifications.show({
        title: 'Talle creado',
        message: 'El talle se creó exitosamente',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al crear el talle',
        color: 'red',
      });
    },
  });
};

/**
 * Actualizar talle (admin)
 */
export const useUpdateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSizeDto }) =>
      sizesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      notifications.show({
        title: 'Talle actualizado',
        message: 'El talle se actualizó exitosamente',
        color: 'blue',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al actualizar el talle',
        color: 'red',
      });
    },
  });
};

/**
 * Eliminar talle (admin)
 */
export const useDeleteSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sizesApi.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      
      const wasDeactivated = data.deletedType === 'soft';
      
      notifications.show({
        title: wasDeactivated ? 'Talle desactivado' : 'Talle eliminado',
        message: wasDeactivated 
          ? 'El talle fue desactivado porque tiene variantes asociadas.'
          : 'El talle se eliminó permanentemente',
        color: wasDeactivated ? 'orange' : 'red',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al eliminar el talle',
        color: 'red',
      });
    },
  });
};

/**
 * Reactivar talle (admin)
 */
export const useRestoreSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sizesApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      notifications.show({
        title: 'Talle reactivado',
        message: 'El talle volvió a estar disponible',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al reactivar el talle',
        color: 'red',
      });
    },
  });
};

// ===================================================================
// COLORS HOOKS
// ===================================================================

/**
 * Obtener colores activos (público)
 */
export const useColors = () => {
  return useQuery({
    queryKey: ['colors'],
    queryFn: colorsApi.getAll,
  });
};

/**
 * Obtener todos los colores incluidos inactivos (admin)
 */
export const useAllColors = () => {
  return useQuery({
    queryKey: ['colors', 'all'],
    queryFn: colorsApi.getAllIncludingInactive,
  });
};

/**
 * Obtener un color por ID
 */
export const useColor = (id: number) => {
  return useQuery({
    queryKey: ['colors', id],
    queryFn: () => colorsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Crear color (admin)
 */
export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColorDto) => colorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      notifications.show({
        title: 'Color creado',
        message: 'El color se creó exitosamente',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al crear el color',
        color: 'red',
      });
    },
  });
};

/**
 * Actualizar color (admin)
 */
export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateColorDto }) =>
      colorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      notifications.show({
        title: 'Color actualizado',
        message: 'El color se actualizó exitosamente',
        color: 'blue',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al actualizar el color',
        color: 'red',
      });
    },
  });
};

/**
 * Eliminar color (admin)
 */
export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => colorsApi.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      
      const wasDeactivated = data.deletedType === 'soft';
      
      notifications.show({
        title: wasDeactivated ? 'Color desactivado' : 'Color eliminado',
        message: wasDeactivated 
          ? 'El color fue desactivado porque tiene variantes asociadas.'
          : 'El color se eliminó permanentemente',
        color: wasDeactivated ? 'orange' : 'red',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al eliminar el color',
        color: 'red',
      });
    },
  });
};

/**
 * Reactivar color (admin)
 */
export const useRestoreColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => colorsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      notifications.show({
        title: 'Color reactivado',
        message: 'El color volvió a estar disponible',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error al reactivar el color',
        color: 'red',
      });
    },
  });
};