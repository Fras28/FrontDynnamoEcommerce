import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

import AuthForm from './components/Auth/AuthForm';
import LandingPage from './components/landing/Landingpage';
import { Role } from './types';
import { useAuthStore } from './store/authStore';
import UserView from './components/user/UserView';
import CartDrawer from './components/cart/CartDrawer';
import PaymentSuccess from './components/cart/PaymentSuccess';

import bgFungi from "./assets/bg-fungi.webp"
import VersionBadge from './components/comon/VersionBadge';
import { VERSION_INFO } from '@/utils/version';
import ProductDetail from './components/product/Productdetail';
import EmailConfirmation from './components/Auth/EmailConfirmation';

// ✨ AMBOS DASHBOARDS - Puedes alternar entre ellos
import DemoDashboard from './components/admin/demo/Demodashboard';
import AdminDashboard from './components/admin/AdminDashboard';

import { extractProductId } from './utils/urlUtils';
import Navbar from './components/comon/Navbar';
import PaymentInstructions from './components/cart/Paymentinstructions';
import CheckoutPage from './pages/Checkoutpage';
import OrderDetail from './orders/OrderDetail';
import MyOrders from './orders/MyOrders';

// Esto se verá cada vez que recargues la página en la consola
console.log(
  `%c🚀 ${VERSION_INFO.name} v${VERSION_INFO.version} | ${VERSION_INFO.environment}`,
  "color: #0fe778; font-weight: bold; font-size: 12px;"
);

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

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className="min-h-screen text-slate-200 p-3 sm:p-4 md:p-8 font-sans selection:bg-indigo-500/30 bg-cover bg-no-repeat relative overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.6), rgba(2, 6, 23, 0.6)), url(${bgFungi})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay adicional para asegurar cobertura completa */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.6), rgba(2, 6, 23, 0.6)), url(${bgFungi})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 relative z-0">
        {/* ✅ Nuevo componente Navbar */}
        <Navbar />

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>

        {/* Footer / Monitor */}
        <footer className="pt-6 sm:pt-8 border-t border-slate-900">
          <div className="bg-slate-900/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center">
              {/* Información de versión */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4">
                <VersionBadge variant="tooltip" />
                <div className="h-px w-full sm:h-6 sm:w-px bg-slate-800" />
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-700 uppercase text-center sm:text-left">
                  Morton Desarrollos - Dynamo Tech
                </p>
              </div>

              {/* Copyright */}
              <div className="flex items-center justify-center md:justify-end">
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-700 uppercase text-center md:text-right">
                  © 2024 Morton Desarrollos - Dynamo Tech
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// PrivateRoute Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// ProductDetail Wrapper - Extrae el ID del slug
const ProductDetailWrapper = () => {
  const { slugWithId } = useParams<{ slugWithId: string }>();
  const productId = slugWithId ? extractProductId(slugWithId) : null;
  
  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center p-4">
          <h2 className="text-2xl font-black mb-4">Producto no encontrado</h2>
          <p className="text-slate-400 mb-6">La URL del producto no es válida</p>
          <button
            onClick={() => window.location.href = '/catalogo'}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }
  
  return <ProductDetail />;
};

// ✨✨✨ Admin Dashboard Wrapper con Toggle ✨✨✨
const AdminDashboardWrapper = () => {
  // Estado para controlar qué dashboard mostrar
  // Guarda en localStorage para persistir entre recargas
  const [useDemoMode, setUseDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('adminDashboardMode');
    return saved === 'demo'; // Por defecto: modo real (false)
  });

  // Función para cambiar el modo
  const toggleMode = () => {
    const newMode = !useDemoMode;
    setUseDemoMode(newMode);
    localStorage.setItem('adminDashboardMode', newMode ? 'demo' : 'real');
  };

  return (
    <div className="space-y-4">
      {/* ✨ Botón Toggle - Sticky en la parte superior */}
      <div className="sticky top-4 z-50 flex justify-end">
        <button
          onClick={toggleMode}
          className={`group relative px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg ${
            useDemoMode
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            {useDemoMode ? (
              <>
                <span className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></span>
                Modo demo activado
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                Activar Demo
              </>
            )}
          </span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <p className="text-[10px] text-slate-300">
              {useDemoMode 
                ? '🎭 Usando datos de ejemplo. Click para usar datos reales.' 
                : '✅ Usando datos reales del backend. Click para ver demo.'}
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
          </div>
        </button>
      </div>

      {/* ✨ Renderizado condicional del Dashboard */}
      {useDemoMode ? (
        // 🎭 MODO DEMO: Muestra DemoDashboard SIN PROPS
        <DemoDashboard />
      ) : (
        // ✅ MODO REAL: Muestra AdminDashboard con datos reales
        <AdminDashboard />
      )}
    </div>
  );
};

function App() {
  const { user } = useAuthStore();
  const [globalResponse, setGlobalResponse] = useState<ApiResponse | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Ruta Principal - Siempre muestra la Landing Page */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* ✅ Login */}
        <Route
          path="/login"
          element={
            user ? (
              user.role === Role.ADMIN ? <Navigate to="/admin" replace /> : <Navigate to="/catalogo" replace />
            ) : (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                style={{
                  backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.6), rgba(2, 6, 23, 0.6)), url(${bgFungi})`
                }}
              >
                <AuthForm />
              </div>
            )
          }
        />

        {/* ✅ Panel de Administración - /admin CON TOGGLE */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                {user?.role === Role.ADMIN ? (
                  <AdminDashboardWrapper />
                ) : (
                  <Navigate to="/catalogo" replace />
                )}
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ✅ Catálogo de Productos - /catalogo (PÚBLICO - sin autenticación requerida) */}
        <Route
          path="/catalogo"
          element={
            <Layout response={globalResponse}>
              <UserView />
            </Layout>
          }
        />

        {/* ✅ Detalle de Producto - /productos/:id-nombre-del-producto (PÚBLICO) */}
        <Route
          path="/productos/:slugWithId"
          element={
            <Layout response={globalResponse}>
              <ProductDetailWrapper />
            </Layout>
          }
        />

        {/* ✅ NUEVO: Página de Checkout - /checkout (REQUIERE AUTENTICACIÓN) */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                <CheckoutPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ✅ Confirmación de Email */}
        <Route
          path="/auth/confirm-email"
          element={<EmailConfirmation />}
        />

        {/* ✅ Pago Exitoso */}
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

        {/* ✅ Instrucciones de Pago (Transferencia/Efectivo) */}
        <Route
          path="/payment/instructions/:orderId"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                <PaymentInstructions />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ✅ Detalle de Orden - Usuario */}
        <Route
          path="/orders/:orderId"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                <OrderDetail/>
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ✅ Mis Pedidos - Lista de pedidos del usuario */}
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                <MyOrders />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ✅ Detalle de Orden - Admin */}
        <Route
          path="/admin/orders/:orderId"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                {user?.role === Role.ADMIN ? (
                  <OrderDetail />
                ) : (
                  <Navigate to="/catalogo" replace />
                )}
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ✅ Pago Fallido */}
        <Route
          path="/payment/failure"
          element={
            <PrivateRoute>
              <Layout response={globalResponse}>
                <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                  <h1 className="text-2xl sm:text-4xl font-black text-red-500 uppercase italic">Pago Fallido</h1>
                  <p className="text-slate-400 mt-4 text-sm sm:text-base">Hubo un problema al procesar tu pago.</p>
                  <button
                    onClick={() => window.location.href = '/catalogo'}
                    className="mt-8 bg-slate-800 hover:bg-slate-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-black uppercase text-xs"
                  >
                    Volver al Catálogo
                  </button>
                </div>
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ✅ Redireccionamientos de URLs antiguas para compatibilidad */}
        <Route path="/dashboard" element={<Navigate to="/catalogo" replace />} />
        <Route path="/product/:id" element={<Navigate to="/catalogo" replace />} />

        {/* ✅ 404 - Página no encontrada */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-black italic text-center p-4">
              <div>
                <h1 className="text-4xl sm:text-6xl mb-4">404</h1>
                <p className="text-sm sm:text-base mb-6">PÁGINA NO ENCONTRADA</p>
                <button
                  onClick={() => window.location.href = user ? (user.role === Role.ADMIN ? '/admin' : '/catalogo') : '/'}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          }
        />
      </Routes>

      {/* ✅ CartDrawer disponible para todos (mostrará modal si no está autenticado) */}
      <CartDrawer />
    </BrowserRouter>
  );
}

export default App;