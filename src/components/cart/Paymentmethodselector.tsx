import { CreditCard, Banknote, DollarSign, Percent, Info, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export type PaymentMethod = 'mercadopago' | 'transfer' | 'cash';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  subtotal: number;
}

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, subtotal }: PaymentMethodSelectorProps) => {
  const [showInfo, setShowInfo] = useState(false);

  // Calcular totales según método de pago
  const getPaymentDetails = (method: PaymentMethod) => {
    const discount = method !== 'mercadopago' ? 0.10 : 0; // 10% descuento
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    return {
      discount,
      discountAmount,
      total,
      hasDiscount: discount > 0
    };
  };

  const methods = [
    {
      id: 'mercadopago' as PaymentMethod,
      name: 'Mercado Pago',
      description: 'Tarjetas de crédito y débito',
      icon: CreditCard,
      color: 'indigo',
      benefits: ['Pago inmediato', 'Hasta 12 cuotas', 'Protección al comprador'],
      discount: 0,
    },
    {
      id: 'transfer' as PaymentMethod,
      name: 'Transferencia',
      description: 'Transferencia bancaria o billetera virtual',
      icon: Banknote,
      color: 'emerald',
      benefits: ['10% de descuento', 'Confirmación en 24-48hs', 'CBU/CVU/Alias disponible'],
      discount: 10,
      badge: '10% OFF',
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Efectivo',
      description: 'Pago en efectivo al retirar',
      icon: DollarSign,
      color: 'amber',
      benefits: ['10% de descuento', 'Retiro en local', 'Sin comisiones'],
      discount: 10,
      badge: '10% OFF',
    },
  ];

  const currentDetails = getPaymentDetails(selectedMethod);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-wide">
          Método de Pago
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Info size={16} />
        </button>
      </div>

      {/* Info expandible */}
      {showInfo && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 animate-in slide-in-from-top duration-300">
          <p className="text-xs text-indigo-200/80 leading-relaxed">
            <span className="font-black">💡 Ahorra un 10%</span> pagando con transferencia o efectivo. 
            El descuento se aplica automáticamente al seleccionar el método.
          </p>
        </div>
      )}

      {/* Opciones de pago */}
      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const details = getPaymentDetails(method.id);

          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ${
                isSelected
                  ? `border-${method.color}-500 bg-${method.color}-500/10 shadow-lg shadow-${method.color}-500/20`
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Badge de descuento */}
              {method.badge && (
                <div className={`absolute top-3 right-3 bg-gradient-to-r from-${method.color}-500 to-${method.color}-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse`}>
                  <Percent size={10} />
                  {method.badge}
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icono */}
                <div className={`p-3 rounded-xl ${
                  isSelected 
                    ? `bg-${method.color}-500/20` 
                    : 'bg-slate-800 group-hover:bg-slate-700'
                } transition-colors`}>
                  <method.icon 
                    size={24} 
                    className={isSelected ? `text-${method.color}-400` : 'text-slate-400'} 
                  />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-black text-base ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {method.name}
                    </h4>
                    {isSelected && (
                      <CheckCircle2 size={18} className={`text-${method.color}-400`} />
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-3">
                    {method.description}
                  </p>

                  {/* Beneficios */}
                  <div className="space-y-1">
                    {method.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1 h-1 rounded-full ${
                          isSelected ? `bg-${method.color}-400` : 'bg-slate-600'
                        }`} />
                        <span className={`text-[11px] ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Precio con descuento */}
                  {isSelected && details.hasDiscount && (
                    <div className="mt-3 pt-3 border-t border-slate-800/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Descuento aplicado:</span>
                        <span className="font-black text-emerald-400">
                          -${details.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Resumen de precio */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium">Subtotal</span>
          <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
        </div>

        {currentDetails.hasDiscount && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Percent size={14} />
                Descuento (10%)
              </span>
              <span className="text-emerald-400 font-bold">
                -${currentDetails.discountAmount.toFixed(2)}
              </span>
            </div>
            <div className="h-px bg-slate-800 my-2" />
          </>
        )}

        <div className="flex items-center justify-between">
          <span className="text-white font-black text-lg">Total</span>
          <div className="text-right">
            {currentDetails.hasDiscount && (
              <div className="text-slate-500 text-xs line-through font-medium">
                ${subtotal.toFixed(2)}
              </div>
            )}
            <div className={`text-2xl font-black ${
              currentDetails.hasDiscount ? 'text-emerald-400' : 'text-white'
            }`}>
              ${currentDetails.total.toFixed(2)}
            </div>
          </div>
        </div>

        {currentDetails.hasDiscount && (
          <div className="pt-2 border-t border-slate-800">
            <p className="text-[10px] text-emerald-400/80 font-medium text-center">
              🎉 ¡Estás ahorrando ${currentDetails.discountAmount.toFixed(2)}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;