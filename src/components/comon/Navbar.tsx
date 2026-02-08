import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart as CartIcon, LogOut, Shield, Menu, X, Store } from 'lucide-react';
import { Role } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import Logo from "../../assets/alquemystic.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { getTotalItems, setIsOpen } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determinar en qué vista estamos
  const isAdminView = location.pathname.startsWith('/admin');
  const isCatalogView = location.pathname.startsWith('/catalogo') || location.pathname.startsWith('/productos');
  const isAdminUser = user?.role === Role.ADMIN;

  const handleViewSwitch = () => {
    if (isAdminView) {
      // Si está en admin, ir al catálogo
      navigate('/catalogo');
    } else {
      // Si está en catálogo, volver a admin
      navigate('/admin');
    }
    setIsMenuOpen(false);
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleCartOpen = () => {
    setIsOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl sm:rounded-[2rem] backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex justify-between items-center p-4 sm:p-6">
        {/* Logo y usuario */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <img
            src={Logo}
            alt="Alquimystic"
            onClick={() => navigate(user?.role === Role.ADMIN ? '/admin' : '/catalogo')}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            title="Ir al inicio"
          />

          <div className="min-w-0 flex-1">
            <h1 
              onClick={() => navigate(user?.role === Role.ADMIN ? '/admin' : '/catalogo')}
              className="text-sm sm:text-base md:text-lg font-black tracking-tighter text-white uppercase leading-none truncate cursor-pointer hover:text-indigo-400 transition-colors"
            >
              Alquimystic 
            </h1>
            {user && (
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                <span className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-tighter truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                  {user.email}
                </span>
                <span className={`text-[7px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 rounded-full font-black uppercase tracking-widest border flex-shrink-0 ${
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0">
          {/* Switch de vista para Admin */}
          {isAdminUser && (
            <button
              onClick={handleViewSwitch}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-xs uppercase border ${
                isCatalogView
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isCatalogView ? "Volver al Panel Admin" : "Ver Catálogo"}
            >
              {isCatalogView ? (
                <>
                  <Shield size={16} />
                  <span className="hidden lg:inline">Admin</span>
                </>
              ) : (
                <>
                  <Store size={16} />
                  <span className="hidden lg:inline">Catálogo</span>
                </>
              )}
            </button>
          )}

          {/* Carrito (para usuarios normales o admin viendo catálogo) */}
          {(user?.role !== Role.ADMIN || isCatalogView) && (
            <button
              onClick={handleCartOpen}
              className="relative bg-slate-800 hover:bg-slate-700 p-3 rounded-2xl transition-all active:scale-95 group"
              title={isCatalogView && isAdminUser ? "Ver carrito (Vista previa)" : "Ver carrito"}
            >
              <CartIcon size={20} className="group-hover:text-indigo-400 transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 animate-bounce">
                  {getTotalItems()}
                </span>
              )}
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 font-bold text-xs uppercase border border-red-500/20"
          >
            <LogOut size={16} />
            <span className="hidden lg:inline">Cerrar Sesión</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all active:scale-95 flex-shrink-0"
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/60 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 space-y-2">
            {/* Switch de vista para Admin en mobile */}
            {isAdminUser && (
              <button
                onClick={handleViewSwitch}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase border ${
                  isCatalogView
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {isCatalogView ? (
                  <>
                    <Shield size={18} />
                    <span>Volver al Panel Admin</span>
                  </>
                ) : (
                  <>
                    <Store size={18} />
                    <span>Ver Catálogo de Usuario</span>
                  </>
                )}
              </button>
            )}

            {/* Carrito en mobile */}
            {(user?.role !== Role.ADMIN || isCatalogView) && (
              <button
                onClick={handleCartOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all font-bold text-xs uppercase border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <CartIcon size={18} />
                  <span>Ver Carrito</span>
                </div>
                {getTotalItems() > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}

            {/* Logout en mobile */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all font-bold text-xs uppercase border border-red-500/20"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;