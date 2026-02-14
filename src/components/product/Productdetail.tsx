
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  AlertCircle,
  Tag,
  Sparkles,
  Zap,
  Package
} from 'lucide-react';
import { api } from '../../api/axios';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { notifications } from '@mantine/notifications';
import RelatedProducts from '../../components/product/RelatedProducts';
import { extractProductId } from '../../utils/urlUtils';
import { useAuthStore } from '../../store/authStore';
import AuthRequiredModal from '../Auth/AuthRequiredModal';
import { useSizes, useColors } from "../../hooks/Usesizesandcolors"


const ProductDetail = () => {
  const { slugWithId } = useParams<{ slugWithId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');
  const { addToCart } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { data: sizes } = useSizes();
  const { data: colors } = useColors();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  const productId = slugWithId ? extractProductId(slugWithId) : null;

  // ✅ Cargar estado de favorito SOLO si el usuario está autenticado
  useEffect(() => {
    if (!user || !productId) {
      setIsFavorite(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const { data } = await api.get('/favorites');
        const isProductFavorite = data.some((fav: any) => fav.productId === productId);
        setIsFavorite(isProductFavorite);
      } catch (error) {
        console.error('Error checking favorite:', error);
        setIsFavorite(false);
      }
    };

    checkFavorite();
  }, [user, productId]);

  // ✅ Query del producto (NO requiere autenticación)
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data;
    },
    enabled: !!productId,
  });

  // ✅ Toggle favorito con manejo manual
  const handleToggleFavorite = async () => {
    if (!user) {
      setAuthAction('agregar este producto a favoritos');
      setShowAuthModal(true);
      return;
    }

    if (!productId || isToggling) return;

    setIsToggling(true);
    try {
      const { data } = await api.post('/favorites/toggle', { productId });

      setIsFavorite(data.action === 'added');

      notifications.show({
        title: data.action === 'added' ? '¡Me encanta!' : 'Favorito eliminado',
        message: data.message,
        color: data.action === 'added' ? 'pink' : 'gray',
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar favoritos',
        color: 'red',
      });
    } finally {
      setIsToggling(false);
    }
  };

  // ✅ Scroll al inicio cuando se carga el componente
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slugWithId]);

  if (!productId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">URL inválida</h2>
        <p className="text-slate-400 mb-6">La dirección del producto no es correcta</p>
        <button
          onClick={() => navigate('/catalogo')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
        <p className="text-slate-400 mb-6">El producto que buscas no existe o fue eliminado</p>
        <button
          onClick={() => navigate('/catalogo')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // Lógica de Stock
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Array de imágenes
  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : ['https://placehold.co/600x600/1e293b/4f46e5?text=Sin+Imagen'];

  // Navegación de imágenes
  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    // Si el producto tiene variantes, verificar selección
    if (product.hasVariants) {
      const selectedVariant = product.variants?.find(v => 
        v.sizeId === selectedSize && v.colorId === selectedColor && v.isActive
      );
      
      if (!selectedVariant) {
        notifications.show({
          title: 'Selección requerida',
          message: 'Por favor selecciona un talle y/o color',
          color: 'orange',
        });
        return;
      }
      
      if (selectedVariant.stock === 0) {
        notifications.show({
          title: 'Sin stock',
          message: 'Esta variante no tiene stock disponible',
          color: 'red',
        });
        return;
      }
      
      // Agregar con variante
      addToCart({
        ...product,
        selectedVariantId: selectedVariant.id,
        selectedVariant: selectedVariant,
      }, 1);
    } else {
      // Producto sin variantes (comportamiento original)
      addToCart(product, 1);
    }
    
    notifications.show({
      title: 'Producto agregado',
      message: `"${product.name}" se agregó al carrito`,
      color: 'green',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || 'Mira este producto increíble',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      notifications.show({
        title: 'Enlace copiado',
        message: 'El enlace se copió al portapapeles',
        color: 'blue',
      });
    }
  };

  return (
    <div className="min-h-screen text-white pb-20 overflow-x-hidden">
      {/* Header / Nav - Optimizado para mobile */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-xs sm:text-sm"
        >
          <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Volver</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={`p-2 sm:p-3 rounded-full border-2 transition-all ${isFavorite
              ? 'bg-red-500 border-red-500 text-white'
              : 'border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-500'
              } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart size={18} className={`sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 sm:p-3 rounded-full border-2 border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all"
            title="Compartir producto"
          >
            <Share2 size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      {/* ✨ SELECTOR DE VARIANTES */}
      {product.hasVariants && product.variants && product.variants.length > 0 && (
        <div className="space-y-4 mb-6">
          {/* Talles */}
          {sizes && sizes.length > 0 && (
            <div>
              <label className="text-sm font-bold text-white mb-2 block">Talle</label>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(size => {
                  const variantsWithSize = product.variants?.filter(v => v.sizeId === size.id && v.isActive);
                  const hasStock = variantsWithSize && variantsWithSize.some(v => v.stock > 0);

                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      disabled={!hasStock}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedSize === size.id
                          ? 'bg-indigo-600 text-white'
                          : hasStock
                            ? 'bg-slate-800 text-white hover:bg-slate-700'
                            : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                        }`}
                    >
                      {size.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colores */}
          {colors && colors.length > 0 && (
            <div>
              <label className="text-sm font-bold text-white mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {colors.map(color => {
                  const variantsWithColor = product.variants?.filter(v => v.colorId === color.id && v.isActive);
                  const hasStock = variantsWithColor && variantsWithColor.some(v => v.stock > 0);

                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      disabled={!hasStock}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${selectedColor === color.id
                          ? 'bg-indigo-600 text-white'
                          : hasStock
                            ? 'bg-slate-800 text-white hover:bg-slate-700'
                            : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                        }`}
                    >
                      {color.hexCode && (
                        <div
                          className="w-4 h-4 rounded-full border border-slate-600"
                          style={{ backgroundColor: color.hexCode }}
                        />
                      )}
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock de variante seleccionada */}
          {(() => {
            const selectedVariant = product.variants?.find(v =>
              v.sizeId === selectedSize && v.colorId === selectedColor && v.isActive
            );

            if (selectedVariant) {
              return (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-400">
                    Stock disponible: <span className="text-white font-bold">{selectedVariant.stock}</span>
                  </p>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mt-2 sm:mt-4">
        {/* Lado Izquierdo: Galería de Imágenes */}
        <div className="space-y-3 sm:space-y-4 w-full">
          {/* Imagen Principal con Navegación */}
          <div className="relative aspect-square rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 group w-full">
            <img
              src={images[selectedImage]}
              alt={`${product.name} - Imagen ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex flex-col gap-1.5 sm:gap-2">
              {product.isActive && (
                <span className="bg-indigo-600 text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full tracking-tighter flex items-center gap-1 shadow-lg">
                  <Sparkles size={9} className="sm:w-2.5 sm:h-2.5" /> NUEVO
                </span>
              )}
              {isLowStock && (
                <span className="bg-amber-500 text-black text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full tracking-tighter flex items-center gap-1 shadow-lg">
                  <Zap size={9} className="sm:w-2.5 sm:h-2.5" /> ¡ÚLTIMAS UNIDADES!
                </span>
              )}
            </div>

            {/* Controles de Navegación (solo si hay múltiples imágenes) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900/70"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900/70"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>

                {/* Contador de imágenes */}
                <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 bg-slate-900/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <span className="text-xs sm:text-sm font-bold">
                    {selectedImage + 1} / {images.length}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Miniaturas - Scroll horizontal optimizado */}
          {images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative min-w-[70px] sm:min-w-[80px] h-[70px] sm:h-[80px] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx
                    ? 'border-indigo-500 scale-105'
                    : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600'
                    }`}
                >
                  <img
                    src={url}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge de orden */}
                  <div className="absolute top-1 right-1 bg-slate-900/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lado Derecho: Info - Optimizado para mobile */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full">
          <div className="mb-4 sm:mb-8">
            {product.category && (
              <div className="flex items-center gap-2 text-indigo-400 mb-3 sm:mb-4">
                <Tag size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-[0.2em]">
                  {product.category.name}
                </span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-3 sm:mb-4 leading-tight break-words">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-black text-white">
                ${Number(product.price).toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs sm:text-sm font-medium">IVA incluido</span>
            </div>

            <p className="text-slate-400 leading-relaxed text-sm sm:text-base lg:text-lg mb-4 sm:mb-8 break-words">
              {product.description || 'Sin descripción disponible para este producto profesional.'}
            </p>
          </div>

          {/* Selector de Cantidad y Botón */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-[10px] sm:text-sm tracking-wider sm:tracking-widest text-slate-400 whitespace-nowrap">CANTIDAD</span>
              <div className="flex items-center gap-3 sm:gap-6 rounded-full p-1.5 sm:p-2 border border-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-slate-900 disabled:opacity-20 transition-colors"
                >
                  <Minus size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <span className="font-black text-lg sm:text-xl min-w-[2ch] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-slate-900 disabled:opacity-20 transition-colors"
                >
                  <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
{/* ✨ SELECTOR DE VARIANTES */}
{product.hasVariants && product.variants && product.variants.length > 0 && (
  <div className="space-y-4 mb-6">
    {/* Talles */}
    {sizes && sizes.length > 0 && (
      <div>
        <label className="text-sm font-bold text-white mb-2 block">Talle</label>
        <div className="flex gap-2 flex-wrap">
          {sizes.map(size => {
            const variantsWithSize = product.variants?.filter(v => v.sizeId === size.id && v.isActive);
            const hasStock = variantsWithSize && variantsWithSize.some(v => v.stock > 0);
            
            return (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                disabled={!hasStock}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  selectedSize === size.id
                    ? 'bg-indigo-600 text-white'
                    : hasStock
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                {size.name}
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* Colores */}
    {colors && colors.length > 0 && (
      <div>
        <label className="text-sm font-bold text-white mb-2 block">Color</label>
        <div className="flex gap-2 flex-wrap">
          {colors.map(color => {
            const variantsWithColor = product.variants?.filter(v => v.colorId === color.id && v.isActive);
            const hasStock = variantsWithColor && variantsWithColor.some(v => v.stock > 0);
            
            return (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                disabled={!hasStock}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                  selectedColor === color.id
                    ? 'bg-indigo-600 text-white'
                    : hasStock
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                {color.hexCode && (
                  <div 
                    className="w-4 h-4 rounded-full border border-slate-600"
                    style={{ backgroundColor: color.hexCode }}
                  />
                )}
                {color.name}
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* Stock de variante seleccionada */}
    {(() => {
      const selectedVariant = product.variants?.find(v => 
        v.sizeId === selectedSize && v.colorId === selectedColor && v.isActive
      );
      
      if (selectedVariant) {
        return (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-400">
              Stock disponible: <span className="text-white font-bold">{selectedVariant.stock}</span>
            </p>
          </div>
        );
      }
      return null;
    })()}
  </div>
)}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-indigo-600 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 hover:bg-indigo-500 transition-all disabled:bg-slate-800 disabled:text-slate-500 group"
              >
                {isOutOfStock ? (
                  <>
                    <Package size={18} className="sm:w-5 sm:h-5" />
                    PRODUCTO AGOTADO
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    AÑADIR AL CARRITO
                  </>
                )}
              </button>
            </div>

            {/* Beneficios - Stack en mobile, grid en desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-400 justify-center sm:justify-start">
                <Truck size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-500 flex-shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">ENVÍO GRATIS superando los $90.000</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-400 justify-center sm:justify-start">
                <Shield size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-500 flex-shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">GARANTÍA OFICIAL</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-400 justify-center sm:justify-start">
                <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-500 flex-shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">DEVOLUCIÓN 30 DÍAS (producto cerrado)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel de Productos Relacionados */}
      <RelatedProducts
        currentProductId={product.id}
        categoryId={product.categoryId || undefined}
        categoryName={product.category?.name}
      />

      {/* ✅ Modal de autenticación requerida */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </div>
  );
};

export default ProductDetail;