import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, MapPin, Clock, Phone, Mail, ArrowLeft, Download, Banknote, DollarSign } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { ordersApi } from '../../api/endpoints';

const PaymentInstructions = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const orderData = await ordersApi.getOrderById(Number(orderId));
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        notifications.show({
          title: 'Error',
          message: 'No se pudo cargar la información de la orden',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({
      title: '¡Copiado!',
      message: `${label} copiado al portapapeles`,
      color: 'green',
      autoClose: 2000,
    });
  };

  // ✅ Función helper para convertir a número de forma segura
  const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black text-white mb-4">Orden no encontrada</h2>
        <button
          onClick={() => navigate('/catalogo')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const isTransfer = order.paymentMethod === 'transfer';
  const isCash = order.paymentMethod === 'cash';

  // ✅ Convertir valores a números
  const total = toNumber(order.total);
  const finalTotal = toNumber(order.finalTotal || order.total);
  const discount = toNumber(order.discount);

  // Datos de ejemplo - reemplazar con datos reales de tu negocio
  const businessInfo = {
    transfer: {
      bankName: 'Banco Galicia',
      accountType: 'Cuenta Corriente',
      accountNumber: '1234567890123456789012',
      cbu: '0070099720000001234567',
      alias: 'ALQUIMYSTIC.TECH',
      holder: 'Alquimystic S.A.',
      cuit: '30-12345678-9',
    },
    cash: {
      address: 'Av. Corrientes 1234, CABA, Buenos Aires',
      hours: 'Lunes a Viernes: 10:00 - 19:00hs | Sábados: 10:00 - 14:00hs',
      phone: '+54 11 1234-5678',
      email: 'ventas@alquimystic.com',
      reference: `Orden #${orderId}`,
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header con éxito */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border-2 border-emerald-500/30 rounded-3xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500/20 p-4 rounded-full">
              <CheckCircle size={48} className="text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            ¡Orden Confirmada!
          </h1>
          <p className="text-slate-300 text-lg mb-4">
            Orden #{orderId}
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-6 py-2 rounded-full border border-emerald-500/30">
            <span className="font-black text-2xl">
              ${finalTotal.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm font-bold">
                (Ahorras ${discount.toFixed(2)})
              </span>
            )}
          </div>
        </div>

        {/* Botón volver */}
        <button
          onClick={() => navigate('/catalogo')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-bold">Volver al catálogo</span>
        </button>

        {/* Instrucciones según método de pago */}
        {isTransfer && (
          <div className="space-y-6">
            {/* Título */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-500/20 p-3 rounded-xl">
                  <Banknote size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    Instrucciones de Transferencia
                  </h2>
                  <p className="text-sm text-slate-400">
                    Realiza la transferencia a la siguiente cuenta
                  </p>
                </div>
              </div>

              {/* Datos bancarios */}
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Banco</p>
                  <p className="text-white font-bold">{businessInfo.transfer.bankName}</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Titular</p>
                  <p className="text-white font-bold">{businessInfo.transfer.holder}</p>
                  <p className="text-xs text-slate-400 mt-1">CUIT: {businessInfo.transfer.cuit}</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500">CBU</p>
                    <button
                      onClick={() => copyToClipboard(businessInfo.transfer.cbu, 'CBU')}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <p className="text-white font-mono text-sm">{businessInfo.transfer.cbu}</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500">Alias</p>
                    <button
                      onClick={() => copyToClipboard(businessInfo.transfer.alias, 'Alias')}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <p className="text-white font-bold text-lg">{businessInfo.transfer.alias}</p>
                </div>

                {/* Monto a transferir destacado */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-center">
                  <p className="text-xs text-indigo-300 mb-2">Monto a transferir</p>
                  <p className="text-indigo-400 font-black text-4xl">
                    ${finalTotal.toFixed(2)}
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-indigo-300 mt-2">
                      Ya incluye tu descuento de ${discount.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-4">Pasos a seguir</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-black text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Realiza la transferencia</p>
                    <p className="text-sm text-slate-400">
                      Transfiere ${finalTotal.toFixed(2)} al CBU o Alias indicado arriba
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-black text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Envía el comprobante</p>
                    <p className="text-sm text-slate-400">
                      Envíanos el comprobante a <span className="text-indigo-400">{businessInfo.cash.email}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-black text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Confirmaremos tu pago</p>
                    <p className="text-sm text-slate-400">
                      En 24-48hs hábiles confirmaremos tu orden
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCash && (
          <div className="space-y-6">
            {/* Título */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-500/20 p-3 rounded-xl">
                  <DollarSign size={24} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    Pago en Efectivo - Retiro en Local
                  </h2>
                  <p className="text-sm text-slate-400">
                    Retira tu pedido y paga en nuestro local
                  </p>
                </div>
              </div>

              {/* Monto a pagar */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center mb-6">
                <p className="text-xs text-amber-300 mb-2">Monto a pagar al retirar</p>
                <p className="text-amber-400 font-black text-4xl">
                  ${finalTotal.toFixed(2)}
                </p>
                {discount > 0 && (
                  <p className="text-sm text-amber-300 mt-2">
                    Ya incluye tu descuento de ${discount.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Información del local */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <MapPin size={20} className="text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Dirección</p>
                    <p className="text-white font-bold">{businessInfo.cash.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <Clock size={20} className="text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Horarios de atención</p>
                    <p className="text-white font-medium text-sm">{businessInfo.cash.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <Phone size={20} className="text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                    <p className="text-white font-bold">{businessInfo.cash.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-4">Importante</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-black text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Menciona tu número de orden</p>
                    <p className="text-sm text-slate-400">
                      Al llegar al local, menciona: <span className="text-amber-400 font-bold">Orden #{orderId}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-black text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Trae tu DNI</p>
                    <p className="text-sm text-slate-400">
                      Necesitamos verificar tu identidad al retirar
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-black text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Tu pedido estará listo en 48-72hs</p>
                    <p className="text-sm text-slate-400">
                      Te notificaremos cuando esté disponible para retiro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de productos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-4">Resumen del Pedido</h3>
          <div className="space-y-3">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-slate-300">
                  {item.quantity}x {item.product?.name || 'Producto'}
                </span>
                <span className="text-white font-bold">
                  ${(toNumber(item.price) * toNumber(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-400">Descuento (10%)</span>
                  <span className="text-emerald-400">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-white font-black">Total</span>
                <span className="text-2xl font-black text-white">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de contacto */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
          <p className="text-slate-300 mb-4">
            ¿Tienes dudas sobre tu orden?
          </p>
          <a
            href={`mailto:${businessInfo.cash.email}?subject=Consulta Orden ${orderId}`}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            <Mail size={20} />
            Contactar Soporte
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;