import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/api/axios';


const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let processed = false; // ✅ Flag para evitar ejecución duplicada
  
    const confirmEmail = async () => {
      if (processed) return; // ✅ Si ya se procesó, salir
  
      const token = searchParams.get('token');
  
      if (!token) {
        setStatus('error');
        setMessage('Token inválido o faltante');
        return;
      }
  
      processed = true; // ✅ Marcar como procesado
  
      try {
        const response = await api.post('/auth/confirm-email', { token });
        
        setStatus('success');
        setMessage(response.data.message || '¡Cuenta confirmada exitosamente!');
        
        // Guardar tokens si los devuelve el backend
        if (response.data.access_token) {
          localStorage.setItem('token', response.data.access_token);
        }
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Error al confirmar la cuenta. El token puede haber expirado.'
        );
      }
    };
  
    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-md w-full bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-black text-white uppercase italic">
              Verificando...
            </h2>
            <p className="text-slate-400 mt-2">
              Estamos confirmando tu cuenta
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-black text-white uppercase italic">
              ¡Cuenta Confirmada!
            </h2>
            <p className="text-slate-400 mt-2">{message}</p>
            <p className="text-slate-500 text-sm mt-4">
              Redirigiendo al login en 3 segundos...
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs transition-all active:scale-95"
            >
              Ir al Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white uppercase italic">
              Error de Verificación
            </h2>
            <p className="text-slate-400 mt-2">{message}</p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => navigate('/login')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs transition-all active:scale-95"
              >
                Volver al Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs transition-all active:scale-95"
              >
                Reintentar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;