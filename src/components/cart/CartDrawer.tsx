import { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, AlertTriangle, ImageOff } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { ordersApi, paymentsApi } from '../../api/endpoints';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

interface CartDrawerProps {
  onOrderSuccess?: (orderData: any) => void;
}

const CartDrawer = ({ onOrderSuccess }: CartDrawerProps) => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, clearCart, getTotal, getTotalItems } = useCartStore();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // ✅ Verificar si hay problemas de stock en el carrito
  const getStockIssues = () => {
    return cart.filter(item => item.quantity > item.stock);
  };

  const stockIssues = getStockIssues();
  const hasStockIssues = stockIssues.length > 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      notifications.show({
        title: 'Carrito vacío',
        message: 'Agrega productos antes de finalizar la compra',
        color: 'orange',
      });
      return;
    }

    // ✅ Validar stock antes de proceder
    if (hasStockIssues) {
      notifications.show({
        title: 'Stock insuficiente',
        message: `Algunos productos exceden el stock disponible. Por favor ajusta las cantidades.`,
        color: 'red',
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Crear la orden en el backend
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const orderData = await ordersApi.checkout({ items });
      const orderId = orderData.orderId;

      // 2. Crear la preferencia de Mercado Pago
      const preference = await paymentsApi.createPreference(orderId);

      // 3. Limpieza y notificaciones
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['products'] });

      if (onOrderSuccess) {
        onOrderSuccess(orderData);
      }

      notifications.show({
        title: 'Orden generada',
        message: 'Redirigiendo a la plataforma de pago...',
        color: 'blue',
      });

      // 4. Redirección a Mercado Pago
      window.location.href = preference.initPoint;

    } catch (error: any) {
      console.error('Checkout error:', error);
      
      // ✅ Manejo mejorado de errores de stock
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Stock insuficiente')) {
        notifications.show({
          title: 'Stock insuficiente',
          message: error.response.data.message,
          color: 'red',
          autoClose: 7000,
        });
        // Refrescar productos para actualizar stock
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl">
              <ShoppingBag size={20} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">MI CARRITO</h2>
              <p className="text-[10px] text-slate-500 font-bold">
                {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ Alerta de stock insuficiente */}
        {hasStockIssues && (
          <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="text-red-400 font-black text-sm mb-1">Stock Insuficiente</h3>
              <p className="text-red-300/80 text-xs leading-relaxed">
                Algunos productos en tu carrito exceden el stock disponible. 
                Ajusta las cantidades antes de continuar.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-slate-800/50 p-6 rounded-full mb-4">
                <ShoppingBag size={48} className="text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">Tu carrito está vacío</p>
              <p className="text-slate-600 text-sm mt-1">Agrega productos para empezar</p>
            </div>
          ) : (
            cart.map((item) => {
              const isOverStock = item.quantity > item.stock;
              const isLowStock = item.stock <= 5 && item.stock > 0;
              const isOutOfStock = item.stock === 0;

              // ✅ CORREGIDO: Obtener la imagen del producto con múltiples estrategias
              const getProductImage = () => {
                // Estrategia 1: Nueva estructura con array de imágenes
                if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                  return item.images[0].url;
                }              
                // Estrategia 3: null para mostrar placeholder
                return null;
              };

              const productImage = getProductImage();

              return (
                <div
                  key={item.id}
                  className={`bg-slate-950 border rounded-2xl p-4 transition-all ${
                    isOverStock 
                      ? 'border-red-500/50 bg-red-500/5' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 flex-shrink-0 relative">
                      {/* ✅ CORREGIDO: Mostrar imagen o placeholder */}
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Si falla la carga, mostrar icono
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const icon = document.createElement('div');
                              icon.className = 'fallback-icon flex items-center justify-center w-full h-full';
                              icon.innerHTML = '<svg class="text-slate-600" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                              parent.appendChild(icon);
                            }
                          }}
                        />
                      ) : (
                        <ImageOff size={24} className="text-slate-600" />
                      )}
                      
                      {/* ✅ Badge de stock agotado */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <span className="text-[8px] font-black text-red-400 uppercase tracking-wider">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                      <p className="text-indigo-400 font-black text-lg mt-1">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      {/* ✅ Indicadores de stock */}
                      <div className="flex items-center gap-2 mt-2">
                        {isOverStock && (
                          <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 flex items-center gap-1">
                            <AlertTriangle size={10} />
                            Excede stock ({item.stock} disponibles)
                          </span>
                        )}
                        {!isOverStock && isLowStock && (
                          <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            ¡Últimas {item.stock} unidades!
                          </span>
                        )}
                        {!isOverStock && !isLowStock && !isOutOfStock && (
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {item.stock} en stock
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                            Sin stock
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} className="text-white" />
                          </button>
                          <span className={`font-bold text-sm w-8 text-center ${
                            isOverStock ? 'text-red-400' : 'text-white'
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              // ✅ Validar antes de aumentar
                              if (item.quantity >= item.stock) {
                                notifications.show({
                                  title: 'Stock insuficiente',
                                  message: `Solo hay ${item.stock} unidades disponibles de "${item.name}"`,
                                  color: 'orange',
                                  autoClose: 3000,
                                });
                                return;
                              }
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= item.stock || isOutOfStock}
                          >
                            <Plus size={14} className="text-white" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-800 p-6 space-y-4 bg-slate-900/80 backdrop-blur">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">Subtotal</span>
              <span className="text-2xl font-black text-white">${getTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || hasStockIssues}
              className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:cursor-not-allowed shadow-lg ${
                hasStockIssues
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 disabled:opacity-50'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  PROCESANDO...
                </>
              ) : hasStockIssues ? (
                <>
                  <AlertTriangle size={20} />
                  AJUSTAR CANTIDADES
                </>
              ) : (
                'PAGAR CON MERCADO PAGO'
              )}
            </button>

            {/* ✅ Mensaje adicional si hay problemas de stock */}
            {hasStockIssues && (
              <p className="text-center text-xs text-red-400/80 font-medium">
                Reduce las cantidades de los productos marcados para continuar
              </p>
            )}

            <button
              onClick={clearCart}
              className="w-full text-slate-400 hover:text-white text-sm font-bold transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;