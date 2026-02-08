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

  const { data: relatedProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['related-products', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data } = await api.get('/products', {
        params: { categoryId }
      });
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
      const scrollAmount = 240;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Formatea la descripción para que no exceda el límite 
   * y no corte palabras a la mitad.
   */
  const formatDescription = (text: string | undefined | null, limit: number) => {
    if (!text) return 'Sin descripción disponible.';
    if (text.length <= limit) return text;
    
    // Cortar al límite y ajustar al último espacio para no romper palabras
    const truncated = text.substring(0, limit);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return `${truncated.substring(0, lastSpace > 0 ? lastSpace : limit)}...`;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 py-6">
        <div className="flex items-center justify-center py-6">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 border-t border-slate-800 mt-4 sm:mt-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2 flex-wrap">
            <Tag className="text-indigo-500 flex-shrink-0" size={16} />
            <span className="break-words">Más en <span className="text-indigo-400">{categoryName || 'esta categoría'}</span></span>
          </h2>
        </div>

        <div className="hidden md:flex gap-2 flex-shrink-0">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative group w-full">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {relatedProducts.map((product) => {
            const isOutOfStock = product.stock === 0;
            const itemInCart = cart.find(item => item.id === product.id);
            const remainingStock = product.stock - (itemInCart?.quantity || 0);
            const primaryImage = product.images?.[0]?.url || 'https://placehold.co/400x400/1e293b/4f46e5?text=Sin+Imagen';

            return (
              <div
                key={product.id}
                className="group/card flex-shrink-0 w-[280px] sm:w-[320px] bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/50 hover:shadow-indigo-500/10 flex flex-row gap-2 sm:gap-3 snap-start h-[110px] sm:h-[120px]"
              >
                {/* Imagen */}
                <div
                  className="relative w-[94px] sm:w-[104px] h-full flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-slate-950 border border-slate-800/50 cursor-pointer"
                  onClick={() => navigate(generateProductUrl(product.id, product.name))}
                >
                  <img src={primaryImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg font-black text-[7px] border border-red-500/30">AGOTADO</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex-1 min-h-0">
                    <h3
                      className="text-xs sm:text-sm font-bold text-white group-hover/card:text-indigo-400 transition-colors line-clamp-1 cursor-pointer mb-0.5 leading-tight"
                      onClick={() => navigate(generateProductUrl(product.id, product.name))}
                    >
                      {product.name}
                    </h3>
                    <p 
                      className="text-slate-400 text-[9px] sm:text-[10px] line-clamp-2 leading-tight mb-1"
                      title={product.description || ''}
                    >
                      {formatDescription(product.description, 100)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <p className="text-base sm:text-lg font-black text-indigo-400">${Number(product.price).toLocaleString()}</p>
                    <div className="flex-1" />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock || remainingStock === 0}
                        className={`px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg font-black text-[8px] transition-all flex items-center justify-center gap-0.5 active:scale-95 ${
                          isOutOfStock ? 'bg-slate-800 text-slate-600' : remainingStock === 0 ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {isOutOfStock ? 'NO' : remainingStock === 0 ? 'FIN' : <Plus size={10} />}
                      </button>
                   
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;