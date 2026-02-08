import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Tag, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../api/axios';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { notifications } from '@mantine/notifications';
import { useRef } from 'react';
import { generateProductUrl } from '../../utils/urlUtils';

interface RelatedProductsProps {
  currentProductId: number;
  categoryId?: number;
  categoryName?: string;
}

const RelatedProducts = ({ currentProductId, categoryId, categoryName }: RelatedProductsProps) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart, cart } = useCartStore();

  // Fetch productos relacionados
  const { data: relatedProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['related-products', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data } = await api.get('/products', {
        params: { categoryId }
      });
      // Filtrar el producto actual y productos inactivos
      return data.filter((p: Product) => p.id !== currentProductId && p.isActive);
    },
    enabled: !!categoryId,
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      notifications.show({
        title: 'Producto agotado',
        message: `"${product.name}" no tiene stock disponible`,
        color: 'red',
        icon: <AlertCircle size={18} />,
        autoClose: 4000,
      });
      return;
    }

    const itemInCart = cart.find(item => item.id === product.id);
    if (itemInCart && itemInCart.quantity >= product.stock) {
      notifications.show({
        title: 'Stock insuficiente',
        message: `Solo hay ${product.stock} unidades disponibles`,
        color: 'orange',
        icon: <AlertCircle size={18} />,
        autoClose: 4000,
      });
      return;
    }

    addToCart(product, 1);
    notifications.show({
      title: 'Producto agregado',
      message: `"${product.name}" se agregó al carrito`,
      color: 'green',
      icon: <CheckCircle size={18} />,
      autoClose: 2000,
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280; // Ancho de una card + gap (ajustado para mobile)
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="flex items-center justify-center py-10">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null; // No mostrar nada si no hay productos relacionados
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16 border-t border-slate-800 mt-8 sm:mt-12 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-2 sm:gap-3 flex-wrap">
            <Tag className="text-indigo-500 flex-shrink-0" size={20} />
            <span className="break-words">Más en <span className="text-indigo-400">{categoryName || 'esta categoría'}</span></span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Descubre otros productos que podrían interesarte
          </p>
        </div>

        {/* Controles de navegación - solo en desktop */}
        <div className="hidden md:flex gap-2 flex-shrink-0">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel - Optimizado para mobile */}
      <div className="relative group w-full">
        {/* Scroll container con padding lateral en mobile para efecto peek */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {relatedProducts.map((product) => {
            const isLowStock = product.stock <= 5 && product.stock > 0;
            const isOutOfStock = product.stock === 0;
            const itemInCart = cart.find(item => item.id === product.id);
            const remainingStock = product.stock - (itemInCart?.quantity || 0);

            // Obtener la primera imagen
            const primaryImage = product.images && product.images.length > 0
              ? product.images[0].url
              : 'https://placehold.co/400x400/1e293b/4f46e5?text=Sin+Imagen';

            return (
              <div
                key={product.id}
                className="group/card flex-shrink-0 w-[240px] sm:w-[280px] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/50 hover:shadow-indigo-500/10 flex flex-col snap-start"
              >
                {/* Imagen */}
                <div
                  className="relative aspect-square mb-3 sm:mb-4 overflow-hidden rounded-xl sm:rounded-[1.5rem] bg-slate-950 border border-slate-800/50 cursor-pointer"
                  onClick={() => navigate(generateProductUrl(product.id, product.name))}
                >
                  <img
                    src={primaryImage}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  
                  {/* Badges de estado */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
                    {isOutOfStock ? (
                      <span className="bg-red-950/90 backdrop-blur-md text-red-400 text-[8px] sm:text-[9px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-red-500/30 flex items-center gap-1">
                        <AlertCircle size={7} className="sm:w-2 sm:h-2" /> SIN STOCK
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-amber-950/90 backdrop-blur-md text-amber-400 text-[8px] sm:text-[9px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <AlertCircle size={7} className="sm:w-2 sm:h-2" /> ¡ÚLTIMAS {product.stock}!
                      </span>
                    ) : (
                      <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-400 text-[8px] sm:text-[9px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle size={7} className="sm:w-2 sm:h-2" /> DISPONIBLE
                      </span>
                    )}
                  </div>

                  {/* Overlay cuando está agotado */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-500/20 text-red-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-black text-[10px] sm:text-xs border border-red-500/30">
                        AGOTADO
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-1 sm:px-2 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                  <div className="flex-1 min-h-0">
                    <h3 
                      className="text-sm sm:text-base font-bold text-white group-hover/card:text-indigo-400 transition-colors line-clamp-2 cursor-pointer mb-1.5 sm:mb-2 leading-tight break-words"
                      onClick={() => navigate(generateProductUrl(product.id, product.name))}
                    >
                      {product.name}
                    </h3>
                    
                    <p className="text-slate-400 text-[11px] sm:text-xs line-clamp-2 leading-relaxed mb-2 sm:mb-3 break-words">
                      {product.description || 'Sin descripción disponible.'}
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xl sm:text-2xl font-black text-indigo-400 whitespace-nowrap">
                        ${Number(product.price).toLocaleString()}
                      </p>
                      {itemInCart && (
                        <span className="text-[8px] sm:text-[9px] font-black text-indigo-400 bg-indigo-950/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-indigo-500/30 whitespace-nowrap">
                          {itemInCart.quantity} en carrito
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock || remainingStock === 0}
                        className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 ${
                          isOutOfStock
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : remainingStock === 0
                            ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        }`}
                      >
                        {isOutOfStock ? (
                          <>
                            <AlertCircle size={12} className="sm:w-3.5 sm:h-3.5" /> AGOTADO
                          </>
                        ) : remainingStock === 0 ? (
                          <>
                            <AlertCircle size={12} className="sm:w-3.5 sm:h-3.5" /> EN CARRITO
                          </>
                        ) : (
                          <>
                            <Plus size={12} className="sm:w-3.5 sm:h-3.5" /> AGREGAR
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => navigate(generateProductUrl(product.id, product.name))}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg sm:rounded-xl transition-all active:scale-95 border border-slate-700/50 font-black text-[9px] sm:text-[10px] whitespace-nowrap"
                      >
                        VER
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fade edges - solo en desktop */}
        <div className="hidden sm:block absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />
        <div className="hidden sm:block absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default RelatedProducts;