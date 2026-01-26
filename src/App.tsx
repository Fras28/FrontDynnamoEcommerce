import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShoppingBag, Terminal, ShoppingCart as CartIcon, LogOut } from 'lucide-react';

import AuthForm from './components/Auth/AuthForm';
import { Role } from './types';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import AdminDashboard from './components/admin/AdminDashboard';
import UserView from './components/user/UserView';
import CartDrawer from './components/cart/CartDrawer';
import PaymentSuccess from './components/cart/PaymentSuccess';
import bgFungi from "./assets/bg-fungi.webp"

// Response type para el footer de logs
interface ApiResponse {
  status: number;
  data: any;
}

// Layout Component
interface LayoutProps {
  children: React.ReactNode;
  response: ApiResponse | null;
}

const Layout = ({ children, response }: LayoutProps) => {
  const { user, logout } = useAuthStore();
  const { getTotalItems, setIsOpen } = useCartStore();

  return (
    <div 
    className="min-h-screen text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30 bg-cover bg-center bg-fixed bg-no-repeat"
    style={{ 
      // Agregamos un degradado oscuro para que la imagen no opaque el contenido
   backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.6), rgba(2, 6, 23, 0.6)), url(${bgFungi})`
    }}
  >
      <div className="max-w-6xl mx-auto space-y-8"
      >
        {/* Navbar */}
        <nav className="flex justify-between items-center bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/20 rotate-3">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                Alquimystic <span className="text-indigo-500">Fungi Store</span>
              </h1>
              {/* --- INFO DEL USUARIO --- */}
              {user && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold text-white uppercase tracking-tighter truncate max-w-[120px] md:max-w-none">
                    {user.email}
                  </span>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                    user.role === Role.ADMIN 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                      : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                  }`}>
                    {user.role}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user?.role !== Role.ADMIN && (
              <button
                onClick={() => setIsOpen(true)}
                className="relative bg-slate-800 hover:bg-slate-700 p-3 rounded-2xl transition-all active:scale-95 group"
              >
                <CartIcon size={20} className="group-hover:text-indigo-400 transition-colors" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 animate-bounce">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={logout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-3 rounded-2xl transition-all active:scale-95 flex items-center gap-2 font-bold text-xs uppercase"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>

        {/* Footer / Monitor */}
        <footer className="pt-8 border-t border-slate-900">
          <div className="bg-slate-900/30 rounded-3xl p-6 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-4">
              <Terminal size={16} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Activity Monitor</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-600 font-mono">Server Response:</p>
                <div className="font-mono text-[11px] bg-black/40 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                  <span className={response?.status === 200 || response?.status === 201 ? 'text-emerald-400' : 'text-rose-400'}>
                    {response ? `[${response.status}] ${JSON.stringify(response.data).substring(0, 80)}...` : 'Idle - Waiting for requests...'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <p className="text-[9px] font-bold text-slate-700 uppercase">© 2024 Morton Desarrollos - Dynamo Tech</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// --- PrivateRoute Component ---
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuthStore();
  const [globalResponse, setGlobalResponse] = useState<ApiResponse | null>(null);

  const handleResponse = (res: ApiResponse) => {
    setGlobalResponse(res);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              // SOLUCIÓN CENTRADO: Contenedor pantalla completa
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{ 
                // Cambiado a 0.6 para mayor transparencia de la capa oscura
                backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.6), rgba(2, 6, 23, 0.6)), url(${bgFungi})` 
              }}
              >
                <AuthForm />
              </div>
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                {user?.role === Role.ADMIN ? (
                  <AdminDashboard />
                ) : (
                  <UserView  />
                )}
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route
          path="/payment/success"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                <PaymentSuccess />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/payment/failure"
          element={
            <PrivateRoute>
              <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-4xl font-black text-red-500 uppercase italic">Pago Fallido</h1>
                <p className="text-slate-400 mt-4">Hubo un problema al procesar tu pago.</p>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="mt-8 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs"
                >
                  Volver al Dashboard
                </button>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-black italic">
              404 | NOT FOUND
            </div>
          }
        />
      </Routes>

      {user && user.role !== Role.ADMIN && (
        <CartDrawer onOrderSuccess={handleResponse} />
      )}
    </BrowserRouter>
  );
}

export default App;