import React, { useState } from 'react';
import { LogIn, UserPlus, Loader2, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Solución al error de compilación:
   * Accedemos a las variables de entorno de Vite de forma segura para el entorno 'es2015'.
   */
  const getApiUrl = () => {
    try {
      // Intentamos acceder vía import.meta.env (estándar de Vite)
      // Usamos un chequeo de tipo para evitar errores en entornos antiguos
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
      const payload = view === 'login' 
        ? { email: formData.email, password: formData.password }
        : { ...formData, role: formData.role };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse({ status: res.status, data });

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        onAuthSuccess(data.access_token);
      }
    } catch (error) {
      setResponse({ 
        status: 500, 
        data: { message: "Error de conexión. Verifica que el backend esté corriendo." } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
          {view === 'login' ? <LogIn className="text-white w-8 h-8" /> : <UserPlus className="text-white w-8 h-8" />}
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {view === 'login' ? 'BIENVENIDO' : 'ÚNETE AHORA'}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {view === 'login' ? 'Ingresa tus credenciales para continuar' : 'Completa los datos para registrarte'}
        </p>
      </div>

      <div className="flex p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
        <button 
          onClick={() => setView('login')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${view === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          LOGIN
        </button>
        <button 
          onClick={() => setView('register')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${view === 'register' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          REGISTRO
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="email"
            placeholder="Email corporativo"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña segura"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {/* Botón del OJO */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {view === 'register' && (
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="USER">ROL: USUARIO CLIENTE</option>
              <option value="ADMIN">ROL: ADMINISTRADOR</option>
            </select>
          </div>
        )}

        <button 
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center shadow-lg shadow-indigo-500/20 active:scale-95 mt-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'ACCEDER AL SISTEMA' : 'CREAR MI PERFIL')}
        </button>
      </div>

      {response && (
        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado del Servidor</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              response.status >= 400 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              HTTP {response.status}
            </span>
          </div>
          <div className="p-4">
            <pre className="text-[11px] font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;