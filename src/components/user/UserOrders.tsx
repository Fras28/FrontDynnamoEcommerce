import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/axios';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';

const UserOrders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/me');
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-10 text-slate-500">Cargando tus pedidos...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
        <Package className="text-indigo-500" /> Mis Compras
      </h2>

      {orders?.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
          <p className="text-slate-500">Aún no has realizado ninguna compra.</p>
        </div>
      ) : (
        orders?.map((order: any) => (
          <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Orden #{order.id}</p>
                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase text-right">Total</p>
                <p className="text-lg font-black text-white">${Number(order.total).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Timeline de Estado */}
              <div className="flex items-center justify-between relative max-w-xs mx-auto mb-8">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
                
                {['COMPLETED', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                  const isDone = ['COMPLETED', 'SHIPPED', 'DELIVERED'].indexOf(order.status) >= idx;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-950 ${isDone ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                        {idx === 0 && <Clock size={14} />}
                        {idx === 1 && <Truck size={14} />}
                        {idx === 2 && <CheckCircle2 size={14} />}
                      </div>
                      <span className={`text-[8px] font-black mt-2 uppercase ${isDone ? 'text-indigo-400' : 'text-slate-600'}`}>
                        {step === 'COMPLETED' ? 'Pagado' : step === 'SHIPPED' ? 'Enviado' : 'Entregado'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img src={item.product.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium leading-none">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">{item.quantity} unidades</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrders;