import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ZoomIn,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Tag,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from '../../api/axios';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { notifications } from '@mantine/notifications';
import { ordersApi, paymentsApi } from '../../api/endpoints';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Fetch product data
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
  });

  // Fetch related products (same category)
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ['related-products', product?.categoryId],
    queryFn: async () => {
      if (!product?.categoryId) return [];
      const { data } = await api.get(`/products?categoryId=${product.categoryId}`);
      return data.filter((p: Product) => p.id !== product.id).slice(0, 4);
    },
    enabled: !!product?.categoryId,
  });

  // Simulated image gallery - in real app, this would come from product data
  const productImages = product?.imageUrl 
    ? [
        product.imageUrl,
        product.imageUrl, // Duplicate for demo - replace with actual gallery images
        product.imageUrl,
      ]
    : [];

  const itemInCart = cart.find(item => item.id === product?.id);
  const maxQuantity = product ? product.stock - (itemInCart?.quantity || 0) : 0;
  const isOutOfStock = product?.stock === 0;
  const isLowStock = product && product.stock <= 5 && product.stock > 0;

  const handleAddToCart = () => {
    if (!product) return;
    
    if (quantity > maxQuantity) {
      notifications.show({
        title: 'Stock insuficiente',
        message: `Solo hay ${maxQuantity} unidades disponibles`,
        color: 'orange',
        icon: <AlertCircle size={18} />,
      });
      return;
    }

    addToCart(product, quantity);
    notifications.show({
      title: '¡Agregado al carrito!',
      message: `${quantity}x ${product.name}`,
      color: 'green',
      icon: <CheckCircle size={18} />,
      autoClose: 2000,
    });
    setQuantity(1);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    setBuyingNow(true);
    try {
      // Add to cart first
      addToCart(product, quantity);
      
      // Create order immediately
      const items = [{
        productId: product.id,
        quantity: quantity,
      }];

      const orderData = await ordersApi.checkout({ items });
      const orderId = orderData.orderId;

      // Create payment preference
      const preference = await paymentsApi.createPreference(orderId);

      notifications.show({
        title: 'Redirigiendo al pago',
        message: 'Procesando tu compra...',
        color: 'blue',
      });

      // Redirect to payment
      window.location.href = preference.initPoint;

    } catch (error: any) {
      console.error('Buy now error:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo procesar la compra',
        color: 'red',
      });
    } finally {
      setBuyingNow(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      notifications.show({
        title: 'Enlace copiado',
        message: 'El enlace se copió al portapapeles',
        color: 'blue',
        autoClose: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle size={64} className="text-slate-600 mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Producto no encontrado</h2>
        <p className="text-slate-400 mb-6">El producto que buscas no existe</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all active:scale-95"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Volver a la tienda</span>
      </button>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden group">
            <img
              src={productImages[selectedImage] || '/placeholder.png'}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            
            {/* Status Badge */}
            <div className="absolute top-6 left-6">
              {isOutOfStock ? (
                <span className="bg-red-950/90 backdrop-blur-md text-red-400 text-xs font-black px-4 py-2 rounded-full border border-red-500/30 flex items-center gap-2">
                  <AlertCircle size={14} /> AGOTADO
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-950/90 backdrop-blur-md text-amber-400 text-xs font-black px-4 py-2 rounded-full border border-amber-500/30 flex items-center gap-2">
                  <Sparkles size={14} /> ¡ÚLTIMAS {product.stock} UNIDADES!
                </span>
              ) : (
                <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-400 text-xs font-black px-4 py-2 rounded-full border border-emerald-500/30 flex items-center gap-2">
                  <CheckCircle size={14} /> EN STOCK
                </span>
              )}
            </div>

            {/* Category Badge */}
            {product.category && (
              <div className="absolute top-6 right-6">
                <span className="bg-purple-950/90 backdrop-blur-md text-purple-400 text-xs font-black px-4 py-2 rounded-full border border-purple-500/30 flex items-center gap-2">
                  <Tag size={12} />
                  {product.category.name.toUpperCase()}
                </span>
              </div>
            )}

            {/* Zoom Icon */}
            <div className="absolute bottom-6 right-6 bg-slate-950/80 backdrop-blur-md p-3 rounded-full border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={20} className="text-white" />
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-slate-900 rounded-2xl border-2 overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tight mb-3 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-5xl font-black text-indigo-400 tracking-tighter">
                ${Number(product.price).toLocaleString()}
              </p>
              {itemInCart && (
                <span className="bg-indigo-500/10 text-indigo-400 text-xs font-black px-3 py-1.5 rounded-full border border-indigo-500/20">
                  {itemInCart.quantity} en carrito
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              Descripción
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {product.description || 'Este producto no tiene descripción disponible.'}
            </p>
          </div>

          {/* Stock Info */}
          {!isOutOfStock && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-bold">Stock disponible</span>
                <span className="text-white font-black">{maxQuantity} unidades</span>
              </div>
              {itemInCart && itemInCart.quantity > 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  ({itemInCart.quantity} ya en tu carrito)
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <label className="text-sm font-black text-white uppercase tracking-wider mb-3 block">
                Cantidad
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={20} className="text-white" />
                </button>
                <span className="text-2xl font-black text-white min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} className="text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || buyingNow}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {buyingNow ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  PROCESANDO...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  COMPRAR AHORA
                </>
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || maxQuantity === 0}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              {maxQuantity === 0 ? 'TODO EN CARRITO' : 'AGREGAR AL CARRITO'}
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 border ${
                isFavorite
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
              {isFavorite ? 'EN FAVORITOS' : 'AGREGAR A FAVORITOS'}
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 rounded-2xl transition-all active:scale-95"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
              <Truck size={24} className="text-indigo-400 mx-auto mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Envío Gratis</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
              <Shield size={24} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Garantía</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
              <RotateCcw size={24} className="text-purple-400 mx-auto mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Devoluciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
              <Tag className="text-indigo-400" size={28} />
              Productos Relacionados
            </h2>
            {product.category && (
              <span className="text-sm text-slate-500 font-bold">
                Categoría: <span className="text-purple-400">{product.category.name}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => {
              const relatedIsOutOfStock = relatedProduct.stock === 0;
              const relatedIsLowStock = relatedProduct.stock <= 5 && relatedProduct.stock > 0;

              return (
                <div
                  key={relatedProduct.id}
                  onClick={() => {
                    navigate(`/product/${relatedProduct.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-slate-950">
                    <img
                      src={relatedProduct.imageUrl || '/placeholder.png'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {relatedIsOutOfStock ? (
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-950/90 backdrop-blur-sm text-red-400 text-[9px] font-black px-2 py-1 rounded-full border border-red-500/30">
                          AGOTADO
                        </span>
                      </div>
                    ) : relatedIsLowStock ? (
                      <div className="absolute top-2 left-2">
                        <span className="bg-amber-950/90 backdrop-blur-sm text-amber-400 text-[9px] font-black px-2 py-1 rounded-full border border-amber-500/30">
                          ¡ÚLTIMAS!
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-indigo-400 font-black text-lg">
                    ${Number(relatedProduct.price).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;