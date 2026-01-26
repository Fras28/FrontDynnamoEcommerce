import { Truck, CheckCircle, Package, Clock, MapPin, Phone, MessageCircle } from 'lucide-react';

interface OrdersTableProps {
  orders: any[];
  onUpdateStatus: (id: number, status: string) => void;
}

const OrdersTable = ({ orders, onUpdateStatus }: OrdersTableProps) => {
  const safeOrders = Array.isArray(orders) ? orders : [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'SHIPPED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DELIVERED': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-4 overflow-y-auto max-h-[750px] pr-2 custom-scrollbar">
      {safeOrders.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] italic">Sin órdenes registradas</p>
        </div>
      ) : (
        safeOrders.map((order) => {
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
                  <div className="flex items-center gap-3">
                    <span className="bg-white text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">ORDEN #{order.id}</span>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${getStatusStyle(order.status)}`}>{order.status}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase">
                    <Clock size={12} className="text-indigo-500" /> 
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest">Total Neto</p>
                  <p className="text-2xl font-black text-white italic">${Number(order.total).toLocaleString()}</p>
                </div>
              </div>

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
                    <img src={item.product?.imageUrl} className="w-8 h-8 rounded-lg object-cover border border-slate-700" alt="" />
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
                  <button onClick={() => onUpdateStatus(order.id, 'SHIPPED')} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">
                    <Truck size={14} className="inline mr-2" /> Despachar
                  </button>
                )}
                {order.status === 'SHIPPED' && (
                  <button onClick={() => onUpdateStatus(order.id, 'DELIVERED')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest animate-pulse hover:animate-none">
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
  );
};

export default OrdersTable;