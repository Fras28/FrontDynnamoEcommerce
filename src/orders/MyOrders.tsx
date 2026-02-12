import { useNavigate } from 'react-router-dom';

import { Loader2, Package, Calendar, CreditCard, ChevronRight, ShoppingBag, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { useMyOrders } from '@/hooks/useOrders';

const MyOrders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useMyOrders();

  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      label: 'Pendiente'
    },
    COMPLETED: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      label: 'Completado'
    },
    SHIPPED: {
      icon: Truck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      label: 'Enviado'
    },
    DELIVERED: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      label: 'Entregado'
    },
    CANCELLED: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      label: 'Cancelado'
    }
  };

  const paymentMethodNames = {
    mercadopago: 'Mercado Pago',
    transfer: 'Transferencia',
    cash: 'Efectivo'
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-500 relative z-10" size={40} />
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
        </div>
        <p className="text-slate-500 font-black uppercase italic tracking-widest mt-6 animate-pulse text-xs">
          Cargando pedidos...
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <ShoppingBag className="mx-auto text-slate-700 mb-4" size={48} />
          <h2 className="text-xl font-black text-slate-600 uppercase tracking-widest mb-2">
            No tienes pedidos
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Aún no has realizado ninguna compra. ¡Explora nuestro catálogo!
          </p>
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">
            Mis Pedidos
          </h1>
          <p className="text-sm text-slate-400 font-bold mt-1">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} en total
          </p>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo?.icon || Package;

          return (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              {/* Header de la orden */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-black text-white uppercase italic">
                      Pedido #{order.id}
                    </h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusInfo?.bgColor} ${statusInfo?.borderColor} border`}>
                      <StatusIcon className={statusInfo?.color} size={12} />
                      <span className={`text-[10px] font-black uppercase ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} />
                      <span>
                        {paymentMethodNames[order.paymentMethod as keyof typeof paymentMethodNames] || order.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
              </div>

              {/* Productos (preview) */}
              <div className="space-y-2 mb-4">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.product?.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                        <Package className="text-slate-600" size={16} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {item.product?.name || `Producto #${item.productId}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-xs text-slate-500 font-semibold pl-15">
                    + {order.items.length - 2} producto{order.items.length - 2 !== 1 ? 's' : ''} más
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400 uppercase">Total:</span>
                <div className="text-right">
                  {order.discount && Number(order.discount) > 0 && (
                    <p className="text-xs text-slate-500 line-through">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  )}
                  <p className="text-xl font-black text-indigo-400">
                    ${Number(order.finalTotal || order.total).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón volver al catálogo */}
      <div className="pt-4">
        <button
          onClick={() => navigate('/catalogo')}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all"
        >
          Volver al Catálogo
        </button>
      </div>
    </div>
  );
};

export default MyOrders;