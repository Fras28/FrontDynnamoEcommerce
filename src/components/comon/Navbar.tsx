//
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart as CartIcon, LogOut, Shield, Menu, X, Store, LogIn, Sparkles } from 'lucide-react';
import { Role } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import Logo from "../../assets/alquemystic.jpg";

const Navbar = ({ isLanding = false }: { isLanding?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { getTotalItems, setIsOpen } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar scroll solo en la landing
  useEffect(() => {
    if (!isLanding) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLanding]);

  const isAdminView = location.pathname.startsWith('/admin');
  const isCatalogView = location.pathname.startsWith('/catalogo') || location.pathname.startsWith('/productos');
  const isAdminUser = user?.role === Role.ADMIN;

  const navContainerClasses = isLanding 
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 px-4' : 'py-6 px-4 sm:px-8'}`
    : 'w-full py-4 px-2';

  const navContentClasses = `max-w-7xl mx-auto transition-all duration-300 ${
    isLanding && !isScrolled
      ? 'bg-transparent border-transparent'
      : 'bg-slate-900/40 border-slate-800 backdrop-blur-xl shadow-2xl'
  } border rounded-2xl sm:rounded-[2rem] overflow-hidden`;

  return (
    <div className={navContainerClasses}>
      <nav className={navContentClasses}>
        <div className="flex justify-between items-center p-4 sm:p-6">
          {/* Logo y Textos */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <img
              src={Logo}
              alt="Alquimystic"
              onClick={() => navigate('/')}
              className="w-10 h-10 sm:w-12 md:w-16 md:h-16 object-contain flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            />
            <div className="min-w-0 flex-1">
              <h1 
                onClick={() => navigate('/')}
                className="text-sm sm:text-base md:text-lg font-black tracking-tighter text-white uppercase leading-none truncate cursor-pointer hover:text-indigo-400 transition-colors"
              >
                Alquimystic 
              </h1>
              {!user && (
                <p className="text-[8px] sm:text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                  Fermentos & Fungis
                </p>
              )}
              {user && (
                <span className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-tighter truncate block mt-1">
                  {user.email}
                </span>
              )}
            </div>
          </div>

          {/* Acciones de Escritorio */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0">
            {/* BOTÓN: Ir al Catálogo (VISIBLE EN LANDING) */}
            {isLanding && (
              <button
                onClick={() => navigate('/catalogo')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Sparkles size={16} />
                <span>Explorar Catálogo</span>
              </button>
            )}

            {/* NAVEGACIÓN ADMIN - VISIBLE SIEMPRE QUE SEA ADMIN (excepto en landing) */}
            {isAdminUser && !isLanding && (
              <button
                onClick={() => navigate(isAdminView ? '/catalogo' : '/admin')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs uppercase transition-all active:scale-95"
              >
                {isAdminView ? <Store size={16} /> : <Shield size={16} />}
                <span>{isAdminView ? "Ir a Tienda" : "Ir a Admin"}</span>
              </button>
            )}

            {!isAdminView && (
              <button
                onClick={() => setIsOpen(true)}
                className="relative bg-slate-800 hover:bg-slate-700 p-3 rounded-2xl transition-all active:scale-95 group"
              >
                <CartIcon size={20} className="group-hover:text-indigo-400 transition-colors" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}

            {/* Botón de Auth corregido */}
            <button
              onClick={() => user ? logout() : navigate('/login')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-xs uppercase border ${
                user 
                  ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
              }`}
            >
              {user ? <LogOut size={16} /> : <LogIn size={16} />}
              <span>{user ? 'Cerrar Sesión' : 'Ingresar'}</span>
            </button>
          </div>

          {/* Botón Menú Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-white"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menú Mobile Desplegable */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl p-4 space-y-3">
            {/* Si está en landing, mostrar opciones de navegación */}
            {isLanding && (
              <>
                <button
                  onClick={() => { navigate('/catalogo'); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase shadow-lg shadow-indigo-600/20"
                >
                  <Store size={18} />
                  <span>Ir al Catálogo</span>
                </button>
                
                {isAdminUser && (
                  <button
                    onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase"
                  >
                    <Shield size={18} />
                    <span>Ir al Dashboard</span>
                  </button>
                )}
              </>
            )}

            {/* NAVEGACIÓN ADMIN MOBILE - visible solo si es admin y no está en landing */}
            {isAdminUser && !isLanding && (
              <button
                onClick={() => { navigate(isAdminView ? '/catalogo' : '/admin'); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase"
              >
                {isAdminView ? <Store size={18} /> : <Shield size={18} />}
                <span>{isAdminView ? "Ir a Tienda" : "Ir a Admin"}</span>
              </button>
            )}
            
            <button
              onClick={() => { user ? logout() : navigate('/login'); setIsMenuOpen(false); }}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase border ${
                user ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-800 text-white border-slate-700'
              }`}
            >
              {user ? <LogOut size={18} /> : <LogIn size={18} />}
              <span>{user ? 'Cerrar Sesión' : 'Ingresar'}</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;