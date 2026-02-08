import { useState } from 'react';
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
  CheckCircle,
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });

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
        <button 
          onClick={() => navigate('/productos')}
          className="text-indigo-400 hover:text-indigo-300 font-bold"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  // Lógica de Stock
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  
  // ✅ CORREGIDO: Array de imágenes
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
    if (isOutOfStock) return;
    
    addToCart(product, quantity);
    
    notifications.show({
      title: '¡Añadido al carrito!',
      message: `${quantity}x ${product.name}`,
      color: 'green',
      icon: <CheckCircle size={18} />,
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
    <div className="min-h-screen text-white pb-20">
      {/* Header / Nav */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-slate-800">
            <ChevronLeft size={20} />
          </div>
          <span className="font-bold text-sm tracking-widest">VOLVER</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite ? 'bg-pink-500/20 text-pink-500' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 mt-4">
        {/* Lado Izquierdo: Galería de Imágenes */}
        <div className="space-y-4">
          {/* Imagen Principal con Navegación */}
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 group">
            <img 
              src={images[selectedImage]} 
              alt={`${product.name} - Imagen ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.isActive && (
                <span className="bg-indigo-600 text-[10px] font-black px-3 py-1 rounded-full tracking-tighter flex items-center gap-1 shadow-lg">
                  <Sparkles size={10} /> NUEVO
                </span>
              )}
              {isLowStock && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full tracking-tighter flex items-center gap-1 shadow-lg">
                  <Zap size={10} /> ¡ÚLTIMAS UNIDADES!
                </span>
              )}
            </div>
            
            {/* Controles de Navegación (solo si hay múltiples imágenes) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900/70"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900/70"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Contador de imágenes */}
                <div className="absolute bottom-6 right-6 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">
                    {selectedImage + 1} / {images.length}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative min-w-[80px] h-[80px] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx 
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

        {/* Lado Derecho: Info */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 space-y-6">
          <div className="mb-8">
            {product.category && (
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <Tag size={14} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  {product.category.name}
                </span>
              </div>
            )}
            
            <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-black text-white">
                ${Number(product.price).toLocaleString()}
              </span>
              <span className="text-slate-500 text-sm font-medium">IVA incluido</span>
            </div>

            <p className="text-slate-400 leading-relaxed text-lg mb-8">
              {product.description || 'Sin descripción disponible para este producto profesional.'}
            </p>
          </div>

          {/* Selector de Cantidad y Botón */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm tracking-widest text-slate-400">CANTIDAD</span>
              <div className="flex items-center gap-6 rounded-full p-2 border border-slate-800">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-900 disabled:opacity-20 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="font-black text-xl min-w-[2ch] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-900 disabled:opacity-20 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all disabled:bg-slate-800 disabled:text-slate-500 group"
              >
                {isOutOfStock ? (
                  <>
                    <Package size={20} />
                    PRODUCTO AGOTADO
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    AÑADIR AL CARRITO
                  </>
                )}
              </button>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-slate-400">
                <Truck size={18} className="text-indigo-500" />
                <span className="text-[10px] font-bold">ENVÍO GRATIS</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Shield size={18} className="text-indigo-500" />
                <span className="text-[10px] font-bold">GARANTÍA OFICIAL</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <RotateCcw size={18} className="text-indigo-500" />
                <span className="text-[10px] font-bold">DEVOLUCIÓN 30 DÍAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NUEVO: Carousel de Productos Relacionados */}
      <RelatedProducts 
        currentProductId={product.id}
        categoryId={product.categoryId || undefined}
        categoryName={product.category?.name}
      />
    </div>
  );
};

export default ProductDetail;