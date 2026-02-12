import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Banknote, 
  DollarSign,
  Info,
  Percent,
  Eye
} from 'lucide-react';

const UserOrders = () => {
  const navigate = useNavigate();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/me');
      return data;
    },
  });

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'mercadopago':
        return {
          name: 'Mercado Pago',
          icon: CreditCard,
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
          description: 'Pago procesado con tarjeta de crédito/débito'
        };
      case 'transfer':
        return {
          name: 'Transferencia Bancaria',
          icon: Banknote,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          description: 'Pago por transferencia - 10% de descuento aplicado'
        };
      case 'cash':
        return {
          name: 'Efectivo',
          icon: DollarSign,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          description: 'Pago en efectivo al recibir - 10% de descuento aplicado'
        };
      default:
        return {
          name: 'Método no especificado',
          icon: Package,
          color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
          description: 'Información de pago no disponible'
        };
    }
  };

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { label: 'Pago Aprobado', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
      case 'PENDING':
        return { label: 'Pago Pendiente', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      case 'PENDING_CONFIRMATION':
        return { label: 'Confirmación Pendiente', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' };
      case 'REJECTED':
        return { label: 'Pago Rechazado', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
      default:
        return { label: status, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="text-slate-500 mt-4 text-sm font-bold">Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          <Package className="text-indigo-500" /> Mis Compras
        </h2>
        {orders && orders.length > 0 && (
          <span className="text-xs font-black text-slate-500 bg-slate-800 px-3 py-1.5 rounded-full">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
          </span>
        )}
      </div>

      {orders?.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
          <Package size={48} className="mx-auto text-slate-700 mb-4" />
          <h3 className="text-lg font-black text-slate-600 uppercase mb-2">Sin pedidos</h3>
          <p className="text-slate-500 text-sm">Aún no has realizado ninguna compra.</p>
        </div>
      ) : (
        orders?.map((order: any) => {
          const paymentInfo = getPaymentMethodInfo(order.paymentMethod);
          const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
          const PaymentIcon = paymentInfo.icon;
          
          // ✅ CORREGIDO: Usar finalTotal en lugar de total para mostrar el monto con descuento
          const displayTotal = order.finalTotal || order.total;
          const originalTotal = order.total;
          const discount = order.discount || 0;
          
          return (
            <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all">
              {/* Header de la orden */}
              <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Orden #{order.id}</p>
                      <span className={`text-[8px] font-black px-2 py-1 rounded-full border uppercase ${
                        order.status === 'DELIVERED' 
                          ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                          : order.status === 'SHIPPED'
                          ? 'text-blue-500 bg-blue-500/10 border-blue-500/20'
                          : order.status === 'COMPLETED'
                          ? 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
                          : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase text-right mb-1">Total Pagado</p>
                    {/* ✅ CORREGIDO: Mostrar finalTotal */}
                    <p className="text-2xl font-black text-white">${Number(displayTotal).toLocaleString()}</p>
                    {discount > 0 && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Percent size={10} className="text-emerald-400" />
                        <p className="text-[10px] font-bold text-emerald-400">
                          Ahorraste ${Number(discount).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Método de pago y estado */}
                <div className="space-y-2">
                  <div className={`border rounded-xl p-3 ${paymentInfo.color}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-950/30 rounded-lg">
                        <PaymentIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase mb-0.5">{paymentInfo.name}</p>
                        <p className="text-[10px] font-medium opacity-80">{paymentInfo.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* ✅ NUEVO: Estado del pago */}
                  <div className={`border rounded-xl p-3 ${paymentStatusInfo.color}`}>
                    <p className="text-xs font-black uppercase text-center">{paymentStatusInfo.label}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Timeline de Estado */}
                <div className="relative">
                  <div className="flex items-center justify-between relative max-w-md mx-auto">
                    {/* Línea de progreso */}
                    <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-800 z-0"></div>
                    <div 
                      className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
                      style={{
                        width: order.status === 'PENDING' ? '0%' :
                               order.status === 'COMPLETED' ? '33%' :
                               order.status === 'SHIPPED' ? '66%' :
                               order.status === 'DELIVERED' ? '100%' : '0%'
                      }}
                    ></div>
                    
                    {/* Steps */}
                    {[
                      { status: 'COMPLETED', icon: Clock, label: 'Pagado' },
                      { status: 'SHIPPED', icon: Truck, label: 'Enviado' },
                      { status: 'DELIVERED', icon: CheckCircle2, label: 'Entregado' }
                    ].map((step, idx) => {
                      const statusOrder = ['PENDING', 'COMPLETED', 'SHIPPED', 'DELIVERED'];
                      const currentIndex = statusOrder.indexOf(order.status);
                      const stepIndex = statusOrder.indexOf(step.status);
                      const isDone = currentIndex >= stepIndex;
                      const Icon = step.icon;
                      
                      return (
                        <div key={step.status} className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-900 transition-all ${
                            isDone 
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50' 
                              : 'bg-slate-800 text-slate-600'
                          }`}>
                            <Icon size={14} />
                          </div>
                          <span className={`text-[8px] font-black mt-2 uppercase tracking-wide ${
                            isDone ? 'text-indigo-400' : 'text-slate-600'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Información adicional según método de pago y estado */}
                {/* ✅ CORREGIDO: Usar paymentStatus en lugar de status para determinar si está pendiente */}
                {order.paymentStatus === 'PENDING_CONFIRMATION' && order.paymentMethod === 'transfer' && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-amber-400 uppercase mb-1">Pago Pendiente</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Debes realizar la transferencia y enviar el comprobante para que podamos procesar tu pedido.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order.paymentStatus === 'PENDING_CONFIRMATION' && order.paymentMethod === 'cash' && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-amber-400 uppercase mb-1">Pago al Recibir</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {/* ✅ CORREGIDO: Mostrar finalTotal */}
                          Pagarás en efectivo cuando recibas tu pedido. Ten listo el monto exacto: ${Number(displayTotal).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items del pedido */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                    <Package size={14} />
                    Productos ({order.items?.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items?.map((item: any) => {
                      // Obtener imagen del producto
                      let productImage = 'https://placehold.co/100x100/1e293b/4f46e5?text=Sin+Imagen';
                      
                      if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                        productImage = item.product.images[0].url;
                      } else if (item.product?.imageUrl) {
                        productImage = item.product.imageUrl;
                      }

                      return (
                        <div key={item.id} className="flex items-center gap-4 bg-slate-950/50 border border-slate-800 p-3 rounded-xl hover:border-slate-700 transition-all">
                          <img 
                            src={productImage} 
                            alt={item.product?.name || 'Producto'} 
                            className="w-14 h-14 rounded-lg object-cover bg-slate-800 border border-slate-700 flex-shrink-0" 
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/100x100/1e293b/4f46e5?text=Error';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-200 leading-tight mb-1 truncate">
                              {item.product?.name || 'Producto sin nombre'}
                            </p>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-slate-400 font-medium">
                                Cantidad: <span className="text-white font-bold">{item.quantity}</span>
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400 font-medium">
                                Precio: <span className="text-indigo-400 font-bold">${Number(item.price).toLocaleString()}</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-slate-500 uppercase mb-0.5">Subtotal</p>
                            <p className="text-lg font-black text-white">
                              ${(Number(item.price) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen de totales */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Subtotal</span>
                    <span className="text-white font-bold">
                      ${Number(originalTotal).toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Percent size={12} />
                        Descuento (10%)
                      </span>
                      <span className="text-emerald-400 font-bold">
                        -${Number(discount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-slate-800 my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-white font-black text-lg">Total</span>
                    <span className="text-indigo-400 font-black text-2xl">
                      {/* ✅ CORREGIDO: Mostrar finalTotal */}
                      ${Number(displayTotal).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ✅ NUEVO: Botón para ver detalle */}
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Ver Detalle Completo
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserOrders;