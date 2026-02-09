import { useState } from 'react';
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  Banknote, 
  DollarSign,
  Filter,
  X,
  Package
} from 'lucide-react';

interface OrdersTableProps {
  orders: any[];
  onUpdateStatus: (id: number, status: string) => void;
}

const OrdersTable = ({ orders, onUpdateStatus }: OrdersTableProps) => {
  const [filterPayment, setFilterPayment] = useState<'all' | 'mercadopago' | 'transfer' | 'cash'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'COMPLETED' | 'SHIPPED' | 'DELIVERED'>('all');

  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filtrar órdenes
  const filteredOrders = safeOrders.filter(order => {
    const matchesPayment = filterPayment === 'all' || order.paymentMethod === filterPayment;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesPayment && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'SHIPPED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DELIVERED': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'mercadopago':
        return {
          name: 'Mercado Pago',
          icon: CreditCard,
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
          badge: 'bg-indigo-600'
        };
      case 'transfer':
        return {
          name: 'Transferencia',
          icon: Banknote,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          badge: 'bg-emerald-600'
        };
      case 'cash':
        return {
          name: 'Efectivo',
          icon: DollarSign,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          badge: 'bg-amber-600'
        };
      default:
        return {
          name: 'No especificado',
          icon: Package,
          color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
          badge: 'bg-slate-600'
        };
    }
  };

  // Contar órdenes por método de pago
  const paymentCounts = {
    mercadopago: safeOrders.filter(o => o.paymentMethod === 'mercadopago').length,
    transfer: safeOrders.filter(o => o.paymentMethod === 'transfer').length,
    cash: safeOrders.filter(o => o.paymentMethod === 'cash').length,
  };

  return (
    <div className="space-y-6">
      {/* Filtros y estadísticas */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3 text-center">
            <CreditCard size={16} className="text-indigo-400 mx-auto mb-1" />
            <p className="text-xs font-black text-indigo-400">{paymentCounts.mercadopago}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase">M. Pago</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-center">
            <Banknote size={16} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-black text-emerald-400">{paymentCounts.transfer}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Transfer</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-center">
            <DollarSign size={16} className="text-amber-400 mx-auto mb-1" />
            <p className="text-xs font-black text-amber-400">{paymentCounts.cash}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Efectivo</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filtro de método de pago */}
          <div className="flex-1">
            <label className="text-[9px] font-black text-slate-500 uppercase mb-2 items-center gap-1">
              <Filter size={10} />
              Método de Pago
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterPayment('all')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all ${
                  filterPayment === 'all'
                    ? 'bg-white text-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterPayment('mercadopago')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all flex items-center gap-1 ${
                  filterPayment === 'mercadopago'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard size={10} />
                M. Pago
              </button>
              <button
                onClick={() => setFilterPayment('transfer')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all flex items-center gap-1 ${
                  filterPayment === 'transfer'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Banknote size={10} />
                Transfer
              </button>
              <button
                onClick={() => setFilterPayment('cash')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all flex items-center gap-1 ${
                  filterPayment === 'cash'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign size={10} />
                Efectivo
              </button>
            </div>
          </div>

          {/* Filtro de estado */}
          <div className="flex-1">
            <label className="text-[9px] font-black text-slate-500 uppercase mb-2  flex items-center gap-1">
              <Filter size={10} />
              Estado
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all ${
                  filterStatus === 'PENDING'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Pendiente
              </button>
              <button
                onClick={() => setFilterStatus('COMPLETED')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all ${
                  filterStatus === 'COMPLETED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Pagado
              </button>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(filterPayment !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setFilterPayment('all');
                setFilterStatus('all');
              }}
              className="self-end px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1"
            >
              <X size={12} />
              Limpiar
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-[9px] font-bold text-slate-500 uppercase">
            Mostrando {filteredOrders.length} de {safeOrders.length} órdenes
          </p>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-4 overflow-y-auto max-h-[750px] pr-2 custom-scrollbar">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] italic">
              {filterPayment === 'all' && filterStatus === 'all' 
                ? 'Sin órdenes registradas' 
                : 'No hay órdenes con estos filtros'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const paymentInfo = getPaymentMethodInfo(order.paymentMethod);
            const PaymentIcon = paymentInfo.icon;
            
            const openWhatsApp = () => {
              if (!order.user?.phone) return;
              const cleanPhone = order.user.phone.replace(/\D/g, '');
              const message = encodeURIComponent(`¡Hola! Te contacto de la tienda por tu orden #${order.id}.`);
              window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
            };

            return (
              <div key={order.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] space-y-5 hover:border-slate-600 transition-all shadow-2xl relative overflow-hidden group">
                
                {/* Encabezado de Orden */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-white text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        ORDEN #{order.id}
                      </span>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                      {/* Badge de método de pago */}
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full border flex items-center gap-1 ${paymentInfo.color}`}>
                        <PaymentIcon size={10} />
                        {paymentInfo.name}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase">
                      <Clock size={12} className="text-indigo-500" /> 
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest">Total</p>
                    <p className="text-2xl font-black text-white italic">${Number(order.total).toLocaleString()}</p>
                    {/* Mostrar descuento si existe */}
                    {order.discount && order.discount > 0 && (
                      <p className="text-[9px] font-bold text-emerald-400 mt-1">
                        Descuento: -${Number(order.discount).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Información de Pago */}
                {order.paymentMethod !== 'mercadopago' && (
                  <div className={`border rounded-xl p-3 ${paymentInfo.color}`}>
                    <div className="flex items-start gap-2">
                      <PaymentIcon size={16} className="flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[9px] font-black uppercase mb-1">
                          {order.paymentMethod === 'transfer' ? 'Pago por Transferencia' : 'Pago en Efectivo'}
                        </p>
                        <p className="text-[10px] font-bold opacity-80">
                          {order.paymentMethod === 'transfer' 
                            ? 'El cliente debe enviar comprobante de transferencia'
                            : 'Cobrar al entregar el pedido'
                          }
                        </p>
                      </div>
                      {order.status === 'PENDING' && (
                        <span className="text-[8px] font-black bg-amber-500 text-white px-2 py-1 rounded-full animate-pulse">
                          PENDIENTE
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Información de Envío y Botón WSP */}
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <MapPin size={12} />
                      <span className="text-[9px] font-black uppercase">Dirección de Envío</span>
                    </div>
                    <p className="text-[11px] text-white font-bold uppercase">{order.user?.address || 'No cargada'}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Phone size={12} />
                      <span className="text-[9px] font-black uppercase">Contacto</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[11px] text-white font-bold">{order.user?.phone || 'Sin número'}</p>
                      {order.user?.phone && (
                        <button 
                          onClick={openWhatsApp}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-black transition-all uppercase"
                        >
                          <MessageCircle size={12} /> WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lista de Productos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/50 p-2 rounded-xl">
                      <img 
                        src={item.product?.images?.[0]?.url || item.product?.imageUrl || 'https://placehold.co/100x100/1e293b/4f46e5?text=Sin+Imagen'} 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700" 
                        alt={item.product?.name || 'Producto'} 
                      />
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-200 truncate uppercase">{item.product?.name}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">Cant: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Acciones de Estado */}
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-800/50">
                  {order.status === 'COMPLETED' && (
                    <button 
                      onClick={() => onUpdateStatus(order.id, 'SHIPPED')} 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest"
                    >
                      <Truck size={14} className="inline mr-2" /> Despachar
                    </button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <button 
                      onClick={() => onUpdateStatus(order.id, 'DELIVERED')} 
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest animate-pulse hover:animate-none"
                    >
                      <CheckCircle size={14} className="inline mr-2" /> Entregar
                    </button>
                  )}
                  {order.status === 'DELIVERED' && (
                    <span className="text-emerald-500 text-[9px] font-black uppercase flex items-center gap-2">
                      <CheckCircle size={14} /> Orden Finalizada
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrdersTable;