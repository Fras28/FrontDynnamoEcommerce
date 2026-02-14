import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  AlertTriangle, 
  ImageOff, 
  Heart, 
  Sparkles, 
  TrendingUp,
  Plus,
  Minus,
  Trash2,
  Package
} from 'lucide-react';

import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import PaymentMethodSelector, { PaymentMethod } from '@/components/cart/Paymentmethodselector';
import { useFavorites } from '@/hooks/useFavorites';
import { useCartStore } from '@/store/cartStore';
import { ordersApi, paymentsApi } from '@/api/endpoints';
import { generateProductUrl } from '@/utils/urlUtils';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal, 
    getTotalItems,
    addToCart 
  } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mercadopago');
  const { favorites } = useFavorites();

  // Verificar stock issues
  const getStockIssues = () => {
    return cart.filter(item => item.quantity > item.stock);
  };

  const stockIssues = getStockIssues();
  const hasStockIssues = stockIssues.length > 0;

  // Calcular totales
  const subtotal = getTotal();
  const discount = selectedPaymentMethod !== 'mercadopago' ? 0.10 : 0;
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  // Obtener favoritos recomendados
  const getRecommendedFavorites = () => {
    if (!favorites || favorites.length === 0) return [];
    
    return favorites
      .filter((fav: any) => {
        const product = fav.product;
        const isInCart = cart.some(item => item.id === product.id);
        const hasStock = product.stock > 0;
        const isActive = product.isActive !== false;
        return !isInCart && hasStock && isActive;
      })
      .slice(0, 4) // Máximo 4 en checkout
      .map((fav: any) => fav.product);
  };

  const recommendedProducts = getRecommendedFavorites();

  const handleAddRecommended = (product: any) => {
    addToCart(product, 1);
    notifications.show({
      title: '¡Agregado!',
      message: `"${product.name}" añadido al carrito`,
      color: 'pink',
      icon: <Heart size={18} />,
      autoClose: 2000,
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      notifications.show({
        title: 'Carrito vacío',
        message: 'Agrega productos antes de finalizar la compra',
        color: 'orange',
      });
      navigate('/');
      return;
    }

    if (hasStockIssues) {
      notifications.show({
        title: 'Stock insuficiente',
        message: 'Algunos productos exceden el stock disponible. Ajusta las cantidades.',
        color: 'red',
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);
    try {
      const items = cart?.map((item) => ({
        productId: item?.id,
        variantId: item?.selectedVariantId || undefined, // ✨ NUEVO
        quantity: item?.quantity
      }));

      // ✅ CORRECCIÓN: Enviar datos completos al backend
      const orderData = await ordersApi.checkout({ 
        items,
        paymentMethod: selectedPaymentMethod,
        total: subtotal,           // ✅ Subtotal original (ANTES del descuento)
        discount: discountAmount,   // ✅ Monto del descuento calculado
        finalTotal: finalTotal      // ✅ Total final (subtotal - descuento)
      });
      const orderId = orderData.orderId;

      if (selectedPaymentMethod === 'mercadopago') {
        const preference = await paymentsApi.createPreference(orderId);
        
        clearCart();
        queryClient.invalidateQueries({ queryKey: ['products'] });

        notifications.show({
          title: 'Orden generada',
          message: 'Redirigiendo a Mercado Pago...',
          color: 'blue',
        });

        window.location.href = preference.initPoint;
      } else {
        clearCart();
        queryClient.invalidateQueries({ queryKey: ['products'] });
        
        navigate(`/payment/instructions/${orderId}`);
        
        notifications.show({
          title: '¡Orden creada!',
          message: `Has ahorrado $${discountAmount.toFixed(2)} con tu método de pago`,
          color: 'green',
          autoClose: 5000,
        });
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Stock insuficiente')) {
        notifications.show({
          title: 'Stock insuficiente',
          message: error.response.data.message,
          color: 'red',
          autoClose: 7000,
        });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        notifications.show({
          title: 'Error en el pago',
          message: error.response?.data?.message || 'No se pudo iniciar el proceso de pago',
          color: 'red',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirigir si el carrito está vacío
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-6">
            <Package size={64} className="text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-slate-400">
              Agrega productos para continuar con tu compra
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all active:scale-95"
          >
            Explorar productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">
                Finalizar Compra
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
          </div>
          <ShoppingBag size={32} className="text-indigo-400" />
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Lista de productos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos del carrito */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                <Package size={24} className="text-indigo-400" />
                Productos
              </h2>

              <div className="space-y-4">
                {cart.map((item) => {
                  const productImage = item.images && item.images.length > 0 
                    ? item.images[0].url 
                    : null;
                  const isOutOfStock = item.stock === 0;
                  const isOverStock = item.quantity > item.stock;
                  const hasIssue = isOutOfStock || isOverStock;

                  return (
                    <div
                      key={item.id}
                      className={`bg-slate-950/50 rounded-2xl p-5 border-2 transition-all ${
                        hasIssue 
                          ? 'border-red-500/50 bg-red-500/5' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex gap-5">
                        {/* Imagen */}
                        <div 
                          className="w-28 h-28 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => navigate(generateProductUrl(item.id, item.name))}
                        >
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageOff size={32} className="text-slate-600" />
                          )}
                        </div>

                        {/* Info del producto */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 
                              className="font-black text-white text-lg mb-2 cursor-pointer hover:text-indigo-400 transition-colors"
                              onClick={() => navigate(generateProductUrl(item.id, item.name))}
                            >
                              {item.name}
                            </h3>

                            {/* Stock warnings */}
                            {isOutOfStock && (
                              <div className="flex items-center gap-2 text-red-400 text-sm font-bold mb-2 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 w-fit">
                                <AlertTriangle size={16} />
                                Sin stock disponible
                              </div>
                            )}
                            {isOverStock && !isOutOfStock && (
                              <div className="flex items-center gap-2 text-red-400 text-sm font-bold mb-2 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 w-fit">
                                <AlertTriangle size={16} />
                                Stock máximo: {item.stock} unidades
                              </div>
                            )}
                          </div>

                          <div className="flex items-end justify-between mt-2">
                            <div className="flex items-center gap-4">
                              {/* Botón eliminar */}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
                              >
                                <Trash2 size={18} />
                              </button>

                              {/* Controles de cantidad */}
                              <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} className="text-white" />
                                </button>
                                <span className={`font-bold text-lg w-12 text-center ${
                                  isOverStock ? 'text-red-400' : 'text-white'
                                }`}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => {
                                    if (item.quantity >= item.stock) {
                                      notifications.show({
                                        title: 'Stock insuficiente',
                                        message: `Solo hay ${item.stock} unidades disponibles`,
                                        color: 'orange',
                                        autoClose: 3000,
                                      });
                                      return;
                                    }
                                    updateQuantity(item.id, item.quantity + 1);
                                  }}
                                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                                  disabled={item.quantity >= item.stock || isOutOfStock}
                                >
                                  <Plus size={16} className="text-white" />
                                </button>
                              </div>

                              {/* Precio unitario */}
                              <div className="text-slate-400 text-sm">
                                ${Number(item.price).toLocaleString()} c/u
                              </div>
                            </div>

                            {/* Precio total del item */}
                            <div className="text-right">
                              <div className="text-indigo-400 font-black text-2xl">
                                ${(Number(item.price) * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Favoritos recomendados */}
            {recommendedProducts.length > 0 && (
              <div className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-pink-500/20 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Heart size={24} className="text-pink-500" fill="currentColor" />
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-wide">
                      Tus Favoritos
                    </h2>
                    <p className="text-sm text-pink-300/80">
                      Productos que te encantan y están disponibles
                    </p>
                  </div>
                  <Sparkles size={20} className="text-pink-400 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {recommendedProducts.map((product: any) => {
                    const productImage = product.images && product.images.length > 0 
                      ? product.images[0].url 
                      : null;
                    const isLowStock = product.stock <= 5;

                    return (
                      <div
                        key={product.id}
                        className="bg-slate-950/50 border border-pink-500/20 rounded-2xl p-4 hover:border-pink-500/40 transition-all group"
                      >
                        <div 
                          className="w-full aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 mb-3 cursor-pointer group-hover:scale-105 transition-transform"
                          onClick={() => navigate(generateProductUrl(product.id, product.name))}
                        >
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageOff size={32} className="text-slate-600" />
                          )}
                        </div>

                        <h4 
                          className="text-white font-bold text-sm mb-2 line-clamp-2 cursor-pointer hover:text-pink-400 transition-colors"
                          onClick={() => navigate(generateProductUrl(product.id, product.name))}
                        >
                          {product.name}
                        </h4>

                        <div className="flex items-center justify-between mb-3">
                          <p className="text-pink-400 font-black text-lg">
                            ${Number(product.price).toLocaleString()}
                          </p>
                          {isLowStock && (
                            <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                              ¡{product.stock} left!
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddRecommended(product)}
                          className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Plus size={18} />
                          Agregar
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-4 mt-4 flex items-start gap-3">
                  <TrendingUp size={18} className="text-pink-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-pink-300/80 leading-relaxed">
                    <span className="font-black">¡No te olvides de tus favoritos!</span> Aprovecha que están en stock.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Resumen y pago */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sticky top-6 space-y-6">
              
              {/* Método de pago */}
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                subtotal={subtotal}
              />

              {/* Botón de pago */}
              <button
                onClick={handleCheckout}
                disabled={loading || hasStockIssues}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:cursor-not-allowed shadow-2xl ${
                  hasStockIssues
                    ? 'bg-red-500/20 text-red-400 border-2 border-red-500/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/50'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    PROCESANDO...
                  </>
                ) : hasStockIssues ? (
                  <>
                    <AlertTriangle size={24} />
                    AJUSTAR CANTIDADES
                  </>
                ) : selectedPaymentMethod === 'mercadopago' ? (
                  'PAGAR CON MERCADO PAGO'
                ) : selectedPaymentMethod === 'transfer' ? (
                  'CONTINUAR CON TRANSFERENCIA'
                ) : (
                  'CONTINUAR CON EFECTIVO'
                )}
              </button>

              {hasStockIssues && (
                <p className="text-center text-sm text-red-400/80 font-medium">
                  Reduce las cantidades de los productos marcados para continuar
                </p>
              )}

              {/* Vaciar carrito */}
              <button
                onClick={clearCart}
                className="w-full text-slate-400 hover:text-white text-sm font-bold transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;