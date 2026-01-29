import { useState } from 'react';
import { Loader2, Store, ShoppingBag, Plus, Info, Tag, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../types';
import { notifications } from '@mantine/notifications';
import UserOrders from './UserOrders';

const UserView = () => {
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const { data: products, isLoading } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { addToCart, cart } = useCartStore();

  const handleAddToCart = (product: Product) => {
    // ✅ NUEVO: Verificar stock disponible
    if (product.stock === 0) {
      notifications.show({
        title: 'Producto agotado',
        message: `"${product.name}" no tiene stock disponible actualmente`,
        color: 'red',
        icon: <AlertCircle size={18} />,
        autoClose: 4000,
      });
      return;
    }

    // ✅ NUEVO: Verificar si ya está en el carrito y el límite de stock
    const itemInCart = cart.find(item => item.id === product.id);
    if (itemInCart) {
      const newQuantity = itemInCart.quantity + 1;
      if (newQuantity > product.stock) {
        notifications.show({
          title: 'Stock insuficiente',
          message: `Solo hay ${product.stock} unidades disponibles de "${product.name}"`,
          color: 'orange',
          icon: <AlertCircle size={18} />,
          autoClose: 4000,
        });
        return;
      }
    }

    // Agregar al carrito
    addToCart(product, 1);
    
    // ✅ NUEVO: Notificación de éxito mejorada
    notifications.show({
      title: 'Producto agregado',
      message: `"${product.name}" se agregó al carrito`,
      color: 'green',
      icon: <CheckCircle size={18} />,
      autoClose: 2000,
    });
  };

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory
    ? products?.filter(p => p.categoryId === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-slate-400 font-medium tracking-tight">Cargando experiencia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Selector de Pestañas (Navegación Mi Perfil) */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit mx-auto md:mx-0 shadow-2xl">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            activeTab === 'shop' 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Store size={14} /> TIENDA
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            activeTab === 'orders' 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ShoppingBag size={14} /> MIS PEDIDOS
        </button>
      </div>

      {activeTab === 'shop' ? (
        <>
          {/* Header de la Tienda con Filtros */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                NUESTRO <span className="text-indigo-400">CATÁLOGO</span>
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Explora las mejores ofertas tecnológicas disponibles.
              </p>
            </div>

            {/* ✅ Filtros de Categoría */}
            <div className="flex flex-col gap-2 min-w-[250px]">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                <Filter size={14} />
                Filtrar por categoría
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                    selectedCategory === null
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  TODOS
                </button>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-slate-500 text-xs px-4 py-2">
                    <Loader2 size={12} className="animate-spin" />
                    Cargando...
                  </div>
                ) : (
                  categories?.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-1.5 ${
                        selectedCategory === category.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <Tag size={10} />
                      {category.name.toUpperCase()}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Contador de productos filtrados */}
          {selectedCategory && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-center gap-3">
              <Tag className="text-purple-400" size={20} />
              <p className="text-sm text-white font-bold">
                Mostrando {filteredProducts?.length || 0} producto(s) en{' '}
                <span className="text-purple-400">
                  {categories?.find(c => c.id === selectedCategory)?.name}
                </span>
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="ml-auto text-xs text-slate-400 hover:text-white font-black uppercase tracking-widest"
              >
                Limpiar filtro
              </button>
            </div>
          )}

          {/* Grid de Productos */}
          {filteredProducts && filteredProducts.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 p-20 rounded-[3rem] text-center">
              <Tag className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-600 text-sm font-black uppercase tracking-[0.2em] italic">
                No hay productos en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts?.map((product: Product) => {
                const isLowStock = product.stock <= 5 && product.stock > 0;
                const isOutOfStock = product.stock === 0;
                const itemInCart = cart.find(item => item.id === product.id);
                const remainingStock = product.stock - (itemInCart?.quantity || 0);

                return (
                  <div
                    key={product.id}
                    className={`group bg-slate-900 border rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-2xl flex flex-col ${
                      isOutOfStock 
                        ? 'border-slate-800/50 opacity-60' 
                        : 'border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10'
                    }`}
                  >
                    {/* Imagen del Producto */}
                    <div className="relative aspect-square mb-6 overflow-hidden rounded-[2rem] bg-slate-950 border border-slate-800/50">
                      <img
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          !isOutOfStock && 'group-hover:scale-110'
                        }`}
                      />
                      
                      {/* ✅ NUEVO: Badges de estado de stock */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {isOutOfStock ? (
                          <span className="bg-red-950/90 backdrop-blur-md text-red-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-red-500/30 flex items-center gap-1">
                            <AlertCircle size={10} /> SIN STOCK
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-amber-950/90 backdrop-blur-md text-amber-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                            <AlertCircle size={10} /> ¡ÚLTIMAS {product.stock}!
                          </span>
                        ) : (
                          <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle size={10} /> DISPONIBLE
                          </span>
                        )}
                        
                        {/* Mostrar unidades en carrito */}
                        {itemInCart && itemInCart.quantity > 0 && (
                          <span className="bg-indigo-950/90 backdrop-blur-md text-indigo-400 text-[9px] font-black px-2.5 py-1 rounded-full border border-indigo-500/30">
                            {itemInCart.quantity} en carrito
                          </span>
                        )}
                      </div>

                      {/* Mostrar categoría del producto */}
                      {product.category && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-purple-950/80 backdrop-blur-md text-purple-400 text-[9px] font-black px-2.5 py-1 rounded-full border border-purple-500/30">
                            {product.category.name.toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* ✅ NUEVO: Overlay cuando está agotado */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-500/20 text-red-400 px-6 py-3 rounded-2xl font-black text-sm border border-red-500/30">
                            AGOTADO
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info del Producto */}
                    <div className="px-2 space-y-3 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className={`text-lg font-bold transition-colors line-clamp-1 italic ${
                          isOutOfStock ? 'text-slate-500' : 'text-white group-hover:text-indigo-400'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-xl font-black tracking-tighter ${
                          isOutOfStock ? 'text-slate-600' : 'text-indigo-400'
                        }`}>
                          ${Number(product.price).toLocaleString()}
                        </p>
                      </div>

                      <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px] leading-relaxed">
                        {product.description || 'Sin descripción detallada disponible.'}
                      </p>

                      {/* ✅ NUEVO: Indicador de stock restante */}
                      {!isOutOfStock && itemInCart && (
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2">
                          <p className="text-[10px] text-slate-400 font-bold">
                            {remainingStock > 0 ? (
                              <>
                                <span className="text-indigo-400">{remainingStock}</span> unidades restantes
                              </>
                            ) : (
                              <span className="text-amber-400">Has alcanzado el límite de stock</span>
                            )}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                            isOutOfStock
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                              : remainingStock === 0
                              ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                          }`}
                          disabled={isOutOfStock || remainingStock === 0}
                        >
                          {isOutOfStock ? (
                            <>
                              <AlertCircle size={16} /> AGOTADO
                            </>
                          ) : remainingStock === 0 ? (
                            <>
                              <AlertCircle size={16} /> EN CARRITO
                            </>
                          ) : (
                            <>
                              <Plus size={16} /> AGREGAR
                            </>
                          )}
                        </button>
                        <button 
                          className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-colors active:scale-95 border border-slate-700/50"
                          disabled={isOutOfStock}
                        >
                          <Info size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Sección de Mis Pedidos */
        <div className="max-w-4xl">
          <UserOrders />
        </div>
      )}
    </div>
  );
};

export default UserView;