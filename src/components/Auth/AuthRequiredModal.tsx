import { X, Lock, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string; // "agregar al carrito", "agregar a favoritos", "finalizar compra", etc.
}

const AuthRequiredModal = ({ isOpen, onClose, action }: AuthRequiredModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[70] p-4 animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 p-4 rounded-2xl mb-3">
                <Lock size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Sesión Requerida
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-white font-bold text-lg">
                Para {action} necesitas una cuenta
              </p>
              <p className="text-slate-400 text-sm">
                Crea una cuenta gratis o inicia sesión para continuar
              </p>
            </div>

            {/* Beneficios */}
            <div className="bg-slate-800/50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-wide">
                ✨ Beneficios de registrarte
              </p>
              <ul className="space-y-2">
                {[
                  'Guarda productos en favoritos',
                  'Realiza compras y sigue tus pedidos',
                  'Descuentos exclusivos del 10%',
                  'Proceso de compra más rápido'
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Crear Cuenta Gratis
              </button>

              <button
                onClick={handleGoToLogin}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wide transition-all active:scale-95 border border-slate-700 flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Ya tengo cuenta
              </button>

              <button
                onClick={onClose}
                className="w-full text-slate-400 hover:text-white text-sm font-bold transition-colors py-2"
              >
                Continuar explorando
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthRequiredModal;