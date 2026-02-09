import { X, Minus, Plus, Trash2, ShoppingBag, ShoppingCart, AlertTriangle, ImageOff } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { generateProductUrl } from '../../utils/urlUtils';
import AuthRequiredModal from '../Auth/AuthRequiredModal';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    cart, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal, 
    getTotalItems 
  } = useCartStore();

  const [showAuthModal, setShowAuthModal] = useState(false);

  // ✅ Verificar problemas de stock
  const getStockIssues = () => {
    return cart.filter(item => item.quantity > item.stock);
  };

  const stockIssues = getStockIssues();
  const hasStockIssues = stockIssues.length > 0;
  const subtotal = getTotal();

  // ✅ Navegar al checkout
  const handleGoToCheckout = () => {
    if (cart.length === 0) {
      notifications.show({
        title: 'Carrito vacío',
        message: 'Agrega productos antes de continuar',
        color: 'orange',
      });
      return;
    }

    // Si no está autenticado, mostrar modal
    if (!user) {
      setShowAuthModal(true);
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

    // Cerrar drawer y navegar al checkout
    setIsOpen(false);
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl">
              <ShoppingBag size={20} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">MI CARRITO</h2>
              <p className="text-xs text-slate-400 font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="bg-slate-800/50 p-6 rounded-2xl mb-4">
                <ShoppingCart size={48} className="text-slate-600 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Agrega productos para comenzar tu compra
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/catalogo');
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const productImage = item.images && item.images.length > 0 
                ? item.images[0].url 
                : null;
              const isOutOfStock = item.stock === 0;
              const isOverStock = item.quantity > item.stock;
              const hasIssue = isOutOfStock || isOverStock;

              return (
                <div
                  key={item.id}
                  className={`bg-slate-800/50 rounded-2xl p-4 border-2 transition-all ${
                    hasIssue 
                      ? 'border-red-500/50 bg-red-500/5' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Imagen */}
                    <div 
                      className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(generateProductUrl(item.id, item.name));
                      }}
                    >
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff size={24} className="text-slate-600" />
                      )}
                    </div>

                    {/* Info del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-bold text-white text-sm mb-1 truncate cursor-pointer hover:text-indigo-400 transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(generateProductUrl(item.id, item.name));
                        }}
                      >
                        {item.name}
                      </h3>
                      
                      <p className="text-indigo-400 font-black text-lg mb-2">
                        ${Number(item.price).toLocaleString()}
                      </p>

                      {/* Stock warnings */}
                      {isOutOfStock && (
                        <div className="flex items-center gap-1 text-red-400 text-xs font-bold mb-2">
                          <AlertTriangle size={12} />
                          Sin stock
                        </div>
                      )}
                      {isOverStock && !isOutOfStock && (
                        <div className="flex items-center gap-1 text-red-400 text-xs font-bold mb-2">
                          <AlertTriangle size={12} />
                          Stock máximo: {item.stock}
                        </div>
                      )}

                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
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
                            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                            disabled={item.quantity >= item.stock || isOutOfStock}
                          >
                            <Plus size={14} className="text-white" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
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

        {/* Footer - Simple */}
        {cart.length > 0 && (
          <div className="border-t border-slate-800 p-6 space-y-4 bg-slate-900/80 backdrop-blur">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Subtotal</span>
              <span className="text-white font-black text-2xl">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Info de descuentos */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
              <p className="text-xs text-indigo-200/80 text-center">
                💰 <span className="font-black">10% OFF</span> pagando con transferencia o efectivo
              </p>
            </div>

            {/* Botón principal */}
            <button
              onClick={handleGoToCheckout}
              disabled={hasStockIssues}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:cursor-not-allowed shadow-lg ${
                hasStockIssues
                  ? 'bg-red-500/20 text-red-400 border-2 border-red-500/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
              }`}
            >
              {hasStockIssues ? (
                <>
                  <AlertTriangle size={20} />
                  AJUSTAR CANTIDADES
                </>
              ) : (
                <>
                  {!user ? 'INICIAR SESIÓN PARA COMPRAR' : 'IR AL CHECKOUT'}
                  <ShoppingCart size={20} />
                </>
              )}
            </button>

            {hasStockIssues && (
              <p className="text-center text-xs text-red-400/80 font-medium">
                Reduce las cantidades de los productos marcados
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
        )}
      </div>

      {/* Modal de autenticación */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="finalizar tu compra"
      />
    </>
  );
};

export default CartDrawer;