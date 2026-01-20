import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Terminal, ShoppingCart as CartIcon } from 'lucide-react';

import { CartProvider, useCart } from './components/cart/CartContext';
import AdminDashboard from './components/admin/AdminDashboard';
import UserView from './components/user/UserView';
import CartSidebar from './components/cart/CartSidebar';
import Auth from './components/auth/auth';


// Componente interno del Layout que usa el cart
const LayoutContent = ({ children, user, onLogout, response }) => {
  const { getTotalItems, setIsOpen } = useCart();
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navbar */}
        <nav className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 backdrop-blur-sm p-6 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight italic">
                DYNAMO<span className="text-indigo-400">STORE</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">
                Gestión de Inventario v2.0
              </p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              {/* Botón del carrito */}
              {user.role !== 'ADMIN' && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="relative p-3 bg-slate-950 hover:bg-slate-900  bg-slate-700 border border-slate-800 rounded-2xl transition-all active:scale-95 group"
                >
                  <CartIcon size={20} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}
              
              <div className="bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-inner">
                <div className="text-right">
                  <p className="text-xs font-bold text-white mb-0.5">{user.email}</p>
                  <p className={`text-[9px] font-black tracking-widest ${
                    user.role === 'ADMIN' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {user.role}
                  </p>
                </div>
                <button 
                  onClick={onLogout} 
                  className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-xl transition-all active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="min-h-[50vh]">
          {children}
        </main>

        {/* Response Footer */}
        {response && (
          <footer className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <Terminal size={14} /> API Logs
              </span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                response.status >= 400 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/20' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              }`}>
                HTTP {response.status}
              </span>
            </div>
            <pre className="p-6 text-[11px] font-mono text-indigo-300 overflow-auto max-h-[160px]">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </footer>
        )}
      </div>
    </div>
  );
};

// Wrapper del Layout que envuelve con CartProvider
const Layout = (props) => {
  return (
    <CartProvider>
      <LayoutContent {...props} />
    </CartProvider>
  );
};

// Componente para proteger rutas privadas
const PrivateRoute = ({ children, user, requiredRole }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(
          window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        setUser(payload);
      } catch (e) {
        logout();
      }
    }
  }, [token]);

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const handleOrderSuccess = (orderData) => {
    setResponse({ status: 200, data: orderData });
  };

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={logout} response={response}>
        <Routes>
          {/* Ruta pública de autenticación */}
          <Route 
            path="/login" 
            element={
              !token ? (
                <Auth onAuthSuccess={handleAuthSuccess} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Ruta principal - Redirige según el rol */}
          <Route 
            path="/" 
            element={
              <PrivateRoute user={user}>
                {user?.role === 'ADMIN' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </PrivateRoute>
            } 
          />
          
          {/* Ruta del panel de administrador */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute user={user} requiredRole="ADMIN">
                <AdminDashboard token={token} setGlobalResponse={setResponse} />
              </PrivateRoute>
            } 
          />
          
          {/* Ruta del dashboard de usuario */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute user={user}>
                <UserView />
              </PrivateRoute>
            } 
          />
          
          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={
              <div className="text-center py-20">
                <h1 className="text-4xl font-black text-white">404</h1>
                <p className="text-slate-400">Página no encontrada</p>
              </div>
            } 
          />
        </Routes>
        
        {/* Cart Sidebar - Solo visible para usuarios no admin */}
        {user && user.role !== 'ADMIN' && (
          <CartSidebar token={token} onOrderSuccess={handleOrderSuccess} />
        )}
      </Layout>
    </BrowserRouter>
  );
};

export default App;
