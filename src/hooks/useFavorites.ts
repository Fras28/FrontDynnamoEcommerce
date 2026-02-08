import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/api/endpoints';
import { notifications } from '@mantine/notifications';

export const useFavorites = () => {
  const queryClient = useQueryClient();

  // Obtener la lista de favoritos
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getUserFavorites,
  });

  // Mutación para toggle
  const toggleMutation = useMutation({
    mutationFn: (productId: number) => favoritesApi.toggle(productId),
    onSuccess: (data) => {
      // Invalidamos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
      notifications.show({
        title: data.action === 'added' ? '¡Me encanta!' : 'Favorito eliminado',
        message: data.message,
        color: data.action === 'added' ? 'pink' : 'gray',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Debes iniciar sesión para guardar favoritos',
        color: 'red',
      });
    }
  });

  return {
    favorites,
    isLoading,
    toggleFavorite: toggleMutation.mutate,
    isToggling: toggleMutation.isPending
  };
};