import React, { useState } from 'react';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const API_URL = 'http://localhost:3000';

  const handleAuth = async (e) => {
    e.preventDefault();
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
        onAuthSuccess(data.access_token);
      }
    } catch (error) {
      setResponse({ status: 'ERROR', data: { message: 'Servidor desconectado' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
      <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-8 border border-slate-800/50 shadow-inner">
        <button 
          onClick={() => setView('login')} 
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            view === 'login' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'text-slate-500 hover:text-white'
          }`}
        >
          <LogIn size={14} /> LOGIN
        </button>
        <button 
          onClick={() => setView('register')} 
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            view === 'register' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'text-slate-500 hover:text-white'
          }`}
        >
          <UserPlus size={14} /> REGISTRO
        </button>
      </div>

      <div className="space-y-5">
        <input 
          name="email" 
          type="email" 
          placeholder="Correo electrónico" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-white" 
          required 
        />
        
        <input 
          name="password" 
          type="password" 
          placeholder="Contraseña" 
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-white" 
          required 
        />
        
        {view === 'register' && (
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})} 
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-white"
          >
            <option value="USER">ROL: USUARIO CLIENTE</option>
            <option value="ADMIN">ROL: ADMINISTRADOR</option>
          </select>
        )}

        <button 
          onClick={handleAuth}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'ACCEDER AL SISTEMA' : 'CREAR MI PERFIL')}
        </button>
      </div>

      {response && (
        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500">RESPUESTA</span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              response.status >= 400 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {response.status}
            </span>
          </div>
          <pre className="p-4 text-[10px] text-indigo-300 overflow-auto max-h-32">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Auth;