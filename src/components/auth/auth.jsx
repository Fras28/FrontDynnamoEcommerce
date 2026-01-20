import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Loader2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const getApiUrl = () => {
    try {
      const viteEnv = typeof import.meta !== 'undefined' && import.meta.env 
        ? import.meta.env.VITE_API_BASE 
        : null;
      return viteEnv || 'http://localhost:3000';
    } catch (e) {
      return 'http://localhost:3000';
    }
  };

  const API_URL = getApiUrl();

  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResponse(null);
    
    try {
      const endpoint = view === 'login' ? '/auth/login' : '/auth/register';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResponse({ status: res.status, data });

      if (res.ok && data.access_token) {
        onAuthSuccess(data.access_token);
      }
    } catch (err) {
      setResponse({ 
        status: 500, 
        data: { message: 'Error de conexión con el servidor' } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Contenedor Principal con Fondo Dark y Efecto Glass */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 mb-4 border border-indigo-500/20">
            <ShieldCheck className="text-indigo-400" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {view === 'login' ? 'BIENVENIDO' : 'ÚNETE AHORA'}
          </h2>
          <p className="text-slate-100 font-medium mt-1 text-sm">
            {view === 'login' ? 'Ingresa tus credenciales de acceso' : 'Crea tu nueva cuenta de usuario'}
          </p>
        </div>

        {/* Switcher Login/Registro */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-8 border border-slate-800/50">
          <button 
            onClick={() => setView('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${view === 'login' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LogIn size={18} /> LOGIN
          </button>
          <button 
            onClick={() => setView('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${view === 'register' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <UserPlus size={18} /> REGISTRO
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Campo Email */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Mail size={20} />
            </div>
            <input 
              type="email"
              required
              placeholder="correo@ejemplo.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 pl-12 pr-4 py-4 rounded-2xl outline-none transition-all text-black font-medium placeholder:text-slate-700"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Campo Password con Ojito */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 pl-12 pr-12 py-4 rounded-2xl outline-none transition-all text-black font-medium placeholder:text-slate-700"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Selector de Rol (Solo en Registro) */}
          {view === 'register' && (
            <div className="relative group animate-in slide-in-from-top-2 duration-300">
              <select 
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 px-5 py-4 rounded-2xl outline-none transition-all text-black font-bold appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="USER">ROL: CLIENTE</option>
                <option value="ADMIN">ROL: ADMINISTRADOR</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ShieldCheck size={18} />
              </div>
            </div>
          )}

          {/* Botón de Acción */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 disabled:text-slate-400 py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center shadow-xl shadow-indigo-500/20 active:scale-[0.98] mt-4 border border-indigo-400/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              view === 'login' ? 'INICIAR SESIÓN' : 'CREAR MI CUENTA'
            )}
          </button>
        </form>

        {/* Mensajes de Respuesta del Servidor */}
        {response && (
          <div className="mt-6 bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                response.status >= 400 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {response.status}
              </span>
            </div>
            <div className="p-4">
              <p className={`text-sm font-semibold ${response.status >= 400 ? 'text-red-400' : 'text-emerald-400'}`}>
                {response.data.message || (response.status === 200 ? '¡Listo!' : 'Error')}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-center mt-8 text-slate-600 text-xs font-medium tracking-wide uppercase">
        Sistema de Gestión de Inventario v1.0
      </p>
    </div>
  );
};

export default Auth;