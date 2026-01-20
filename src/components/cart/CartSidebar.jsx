import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
import { useCart } from './CartContext';

const CartSidebar = ({ token, onOrderSuccess }) => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, clearCart, getTotal, getTotalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const API_URL = 'http://localhost:3000';

  const handleCheckout = async () => {
    if (!token) {
      alert('Debes iniciar sesión para realizar una compra');
      return;
    }

    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const res = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderComplete(true);
        clearCart();
        if (onOrderSuccess) onOrderSuccess(data);
        
        // Disparar evento para que UserView refresque los productos
        window.dispatchEvent(new Event('orderCompleted'));
        
        // Cerrar después de 2 segundos
        setTimeout(() => {
          setOrderComplete(false);
          setIsOpen(false);
        }, 2000);
      } else {
        alert(data.message || 'Error al procesar la orden');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
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

        {/* Order Complete Animation */}
        {orderComplete && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-10">
            <div className="bg-emerald-500/20 p-6 rounded-full mb-4 animate-in zoom-in">
              <CheckCircle size={64} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">¡Orden Completada!</h3>
            <p className="text-slate-400">Gracias por tu compra</p>
          </div>
        )}

        {/* Cart Items */}
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
            cart.map(item => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                    <ShoppingBag size={24} className="text-slate-700" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                    <p className="text-indigo-400 font-black text-lg mt-1">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Minus size={14} className="text-white" />
                        </button>
                        <span className="text-white font-bold text-sm w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                          disabled={item.quantity >= item.stock}
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
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-slate-800 p-6 space-y-4 bg-slate-900/80 backdrop-blur">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">Subtotal</span>
              <span className="text-2xl font-black text-white">${getTotal().toFixed(2)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  PROCESANDO...
                </>
              ) : (
                'FINALIZAR COMPRA'
              )}
            </button>
            
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

export default CartSidebar;