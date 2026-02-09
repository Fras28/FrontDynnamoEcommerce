import { Heart, Info, Plus} from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { generateProductUrl } from '../../utils/urlUtils';
import ProductImage from '../product/ProductImage';
import { notifications } from '@mantine/notifications';
import AuthRequiredModal from '../Auth/AuthRequiredModal';

const UserFavorites = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { favorites, isLoading, toggleFavorite } = useFavorites();
  const { addToCart, cart } = useCartStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');

  // Si no está autenticado, mostrar mensaje
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
        <Heart size={48} className="text-slate-700 mb-4" />
        <p className="text-slate-400 font-medium mb-2">Inicia sesión para ver tus favoritos</p>
        <button 
          onClick={() => navigate('/login')} 
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
        <Heart size={48} className="text-slate-700 mb-4" />
        <p className="text-slate-400 font-medium">Aún no tienes productos favoritos</p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-bold"
        >
          Explorar la tienda
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav: any) => {
          const product = fav.product; // El backend incluye el objeto product
          const isInCart = cart.some(item => item.id === product.id);

          return (
            <div key={fav.id} className="group bg-slate-900/40 border border-slate-800 hover:border-pink-500/50 rounded-3xl overflow-hidden transition-all duration-300">
              {/* Imagen y Badge de Favorito */}
              <div className="relative aspect-square overflow-hidden">
                <ProductImage 
                  src={product.images?.[0]?.url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 p-2.5 bg-pink-500 text-white rounded-xl shadow-lg hover:bg-pink-600 transition-colors z-10"
                >
                  <Heart size={18} fill="currentColor" />
                </button>
              </div>

              {/* Contenido */}
              <div className="p-5">
                <h3 className="text-white font-bold truncate text-lg mb-1">{product.name}</h3>
                <p className="text-pink-500 font-black text-xl mb-4">
                  ${Number(product.price).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      notifications.show({
                        title: '¡Al carrito!',
                        message: 'Producto añadido desde favoritos',
                        color: 'green'
                      });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs transition-all active:scale-95"
                  >
                    <Plus size={16} /> {isInCart ? 'AÑADIR OTRO' : 'AGREGAR'}
                  </button>
                  
                  <button
                    onClick={() => navigate(generateProductUrl(product.id, product.name))}
                    className="p-3 bg-slate-800 text-slate-300 rounded-2xl hover:text-white transition-colors"
                  >
                    <Info size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </>
  );
};

export default UserFavorites;