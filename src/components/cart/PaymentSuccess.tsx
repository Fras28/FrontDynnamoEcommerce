import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Mercado Pago envía parámetros en la URL como payment_id, status, etc.
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4 text-center">
      <div className="bg-emerald-500/20 p-6 rounded-full mb-6">
        <CheckCircle size={80} className="text-emerald-400" />
      </div>
      
      <h1 className="text-4xl font-black mb-2">¡PAGO EXITOSO!</h1>
      <p className="text-slate-400 text-lg max-w-md">
        Tu transacción se ha procesado correctamente.
        {paymentId && <span className="block mt-2 font-mono text-indigo-400">ID de Pago: {paymentId}</span>}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <button 
          onClick={() => navigate('/orders')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-indigo-500/25"
        >
          VER MIS ÓRDENES
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95"
        >
          VOLVER AL INICIO
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;