import { useParams, useNavigate } from 'react-router-dom';
;
import { Loader2, Package, ArrowLeft, CreditCard, User, MapPin, Phone, Mail, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrder } from '@/hooks/useOrders';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: order, isLoading, error } = useOrder(orderId ? Number(orderId) : null);

  // Estados visuales por estado de orden
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
    transfer: 'Transferencia Bancaria',
    cash: 'Efectivo'
  };

  const paymentStatusNames = {
    PENDING: 'Pago Pendiente',
    PENDING_CONFIRMATION: 'Confirmación Pendiente',
    APPROVED: 'Pago Aprobado',
    REJECTED: 'Pago Rechazado'
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 sm:py-40">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-500 relative z-10" size={40} />
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
        </div>
        <p className="text-slate-500 font-black uppercase italic tracking-widest mt-6 animate-pulse text-xs">
          Cargando pedido...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md">
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-black text-white uppercase italic mb-2">
            Pedido no encontrado
          </h2>
          <p className="text-slate-400 mb-6">
            No se pudo encontrar el pedido solicitado o no tienes permisos para verlo.
          </p>
          <button
            onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/catalogo')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || Package;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Header con botón de volver */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 rounded-xl transition-all group"
        >
          <ArrowLeft className="text-slate-400 group-hover:text-white transition-colors" size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">
            Pedido #{order.id}
          </h1>
          <p className="text-sm text-slate-400 font-bold mt-1">
            {new Date(order.createdAt).toLocaleDateString('es-AR', { 
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Estado del Pedido - Card destacado */}
      <div className={`${statusInfo?.bgColor} ${statusInfo?.borderColor} border rounded-2xl p-6`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 ${statusInfo?.bgColor} rounded-xl`}>
            <StatusIcon className={statusInfo?.color} size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Estado del Pedido
            </p>
            <p className={`text-xl font-black uppercase italic ${statusInfo?.color}`}>
              {statusInfo?.label}
            </p>
          </div>
        </div>
      </div>

      {/* Información del Cliente (Solo visible para admin) */}
      {user?.role === 'ADMIN' && order.user && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-indigo-500" size={20} />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              Información del Cliente
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Mail className="text-slate-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                <p className="text-sm text-white font-semibold mt-0.5">{order.user.email}</p>
              </div>
            </div>
            {order.user.phone && (
              <div className="flex items-start gap-3">
                <Phone className="text-slate-500 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Teléfono</p>
                  <p className="text-sm text-white font-semibold mt-0.5">{order.user.phone}</p>
                </div>
              </div>
            )}
            {order.user.address && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="text-slate-500 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Dirección</p>
                  <p className="text-sm text-white font-semibold mt-0.5">{order.user.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Información de Pago */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="text-purple-500" size={20} />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">
            Información de Pago
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Método de Pago</p>
            <p className="text-sm text-white font-semibold">
              {paymentMethodNames[order.paymentMethod as keyof typeof paymentMethodNames] || order.paymentMethod}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Estado del Pago</p>
            <p className="text-sm text-white font-semibold">
              {paymentStatusNames[order.paymentStatus as keyof typeof paymentStatusNames] || order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Instrucciones según método de pago */}
        {order.paymentMethod === 'transfer' && order.paymentStatus === 'PENDING_CONFIRMATION' && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-xs font-bold text-yellow-500 uppercase mb-2">⏳ Pago Pendiente de Confirmación</p>
              <p className="text-xs text-slate-400">
                Por favor, envía el comprobante de transferencia para que podamos confirmar tu pago.
              </p>
            </div>
          </div>
        )}

        {order.paymentMethod === 'cash' && order.paymentStatus === 'PENDING_CONFIRMATION' && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-500 uppercase mb-2">💵 Pago en Efectivo</p>
              <p className="text-xs text-slate-400">
                Nos pondremos en contacto contigo para coordinar la entrega y el pago.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Productos */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-emerald-500" size={20} />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">
            Productos ({order.items.length})
          </h2>
        </div>
        
        <div className="space-y-3">
          {order.items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-all"
            >
              {/* Imagen del producto */}
              {item.product?.images && item.product.images.length > 0 ? (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                />
              ) : (
                <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Package className="text-slate-600" size={24} />
                </div>
              )}

              {/* Información del producto */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">
                  {item.product?.name || `Producto #${item.productId}`}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Cantidad: {item.quantity} × ${Number(item.price).toFixed(2)}
                </p>
              </div>

              {/* Precio total */}
              <div className="text-right">
                <p className="text-sm font-black text-indigo-400">
                  ${(item.quantity * Number(item.price)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-semibold">Subtotal:</span>
            <span className="text-white font-bold">${Number(order.total).toFixed(2)}</span>
          </div>
          
          {order.discount && Number(order.discount) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-400 font-semibold">Descuento:</span>
              <span className="text-green-400 font-bold">-${Number(order.discount).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg pt-2 border-t border-slate-800">
            <span className="text-white font-black uppercase">Total:</span>
            <span className="text-indigo-400 font-black text-xl">
              ${Number(order.finalTotal || order.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Botón de acción según el rol */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/catalogo')}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all"
        >
          Volver
        </button>
        {user?.role !== 'ADMIN' && (
          <button
            onClick={() => navigate('/catalogo')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all"
          >
            Seguir Comprando
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;