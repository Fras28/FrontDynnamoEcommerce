import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Store, ShoppingBag, Plus, Info, Tag, Filter, AlertCircle, CheckCircle, Image as ImageIcon, Heart } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../types';
import { notifications } from '@mantine/notifications';
import UserOrders from './UserOrders';
import ProductImage from '../product/ProductImage';
import { generateProductUrl, generateSlug } from '../../utils/urlUtils';
import UserFavorites from './UserFavorites';
import { useAuthStore } from '../../store/authStore';
import AuthRequiredModal from '../Auth/AuthRequiredModal';


const UserView = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'shop' | 'orders' | 'favorites'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const { data: products, isLoading } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { addToCart, cart } = useCartStore();

  // ✅ Leer filtro de categoría desde URL
  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    if (categoryParam && categories) {
      const category = categories.find(c => generateSlug(c.name) === categoryParam);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [searchParams, categories]);

  // ✅ Actualizar URL cuando cambia el filtro
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === null) {
      // Remover el filtro de la URL
      searchParams.delete('categoria');
      setSearchParams(searchParams);
    } else {
      // Agregar/actualizar el filtro en la URL
      const category = categories?.find(c => c.id === categoryId);
      if (category) {
        searchParams.set('categoria', generateSlug(category.name));
        setSearchParams(searchParams);
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    // 1. Prevenir navegación
    e.stopPropagation();
  
    // 2. Control de autenticación
    if (!user) {
      setAuthAction('agregar productos al carrito');
      setShowAuthModal(true);
      return;
    }
  
    // 3. Validación de Stock Agotado
    if (product.stock === 0) {
      notifications.show({
        title: 'Producto agotado',
        message: `"${product.name}" no tiene stock disponible`,
        color: 'red',
        icon: <AlertCircle size={18} />,
        autoClose: 4000,
      });
      return;
    }
  
    // 4. Validación de Límite de Stock en Carrito
    const itemInCart = cart.find(item => item.id === product.id);
    if (itemInCart && itemInCart.quantity + 1 > product.stock) {
      notifications.show({
        title: 'Stock insuficiente',
        message: `Solo hay ${product.stock} unidades disponibles`,
        color: 'orange',
        icon: <AlertCircle size={18} />,
        autoClose: 4000,
      });
      return;
    }
  
    // 5. Ejecución y Notificación de éxito
    addToCart(product, 1);
    notifications.show({
      title: '¡Agregado!',
      message: `${product.name} añadido al carrito`,
      color: 'green',
      icon: <CheckCircle size={18} />,
      autoClose: 2000,
    });
  };

  const handleProductClick = (productId: number, productName: string) => {
    // ✅ Navegar al detalle del producto con slug SEO-friendly
    const url = generateProductUrl(productId, productName);
    navigate(url);
  };



  const handleInfoClick = (e: React.MouseEvent, productId: number, productName: string) => {
    // ✅ Prevenir navegación duplicada cuando se hace click en el botón Info
    e.stopPropagation();
    const url = generateProductUrl(productId, productName);
    navigate(url);
  };

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
      
      {/* Selector de Pestañas */}
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
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'favorites' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart size={18} /> FAVORITOS
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
                Explora todo sobre los mejores hongos adaptogenos
              </p>
            </div>

            {/* Filtros de Categoría */}
            <div className="flex flex-col gap-2 min-w-[250px]">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                <Filter size={14} />
                Filtrar por categoría
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
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
                      onClick={() => handleCategoryChange(category.id)}
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
                onClick={() => handleCategoryChange(null)}
                className="ml-auto text-xs text-slate-400 hover:text-white transition-colors font-bold"
              >
                Limpiar filtro
              </button>
            </div>
          )}

          {/* Grid de Productos */}
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => {
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock <= 5;
                const itemInCart = cart.find(item => item.id === product.id);
                const remainingStock = product.stock - (itemInCart?.quantity || 0);

                // Obtener la primera imagen o usar placeholder
                const primaryImage = product.images && product.images.length > 0
                  ? product.images[0].url
                  : 'https://placehold.co/600x600/1e293b/4f46e5?text=Sin+Imagen';
                
                const additionalImagesCount = product.images ? product.images.length - 1 : 0;

                // ✅ OPTIMIZACIÓN: Primeros 6 productos sin lazy loading (above the fold)
                const isPriority = index < 6;

                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id, product.name)}
                    className={`group bg-slate-900 border rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-2xl flex flex-col cursor-pointer ${
                      isOutOfStock 
                        ? 'border-slate-800/50 opacity-60' 
                        : 'border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10'
                    }`}
                  >
                    {/* Imagen del Producto con Lazy Loading */}
                    <div className="relative mb-6 overflow-hidden rounded-[2rem]">
                      {/* ✅ OPTIMIZADO: Usar ProductImage con lazy loading */}
                      <ProductImage
                        src={primaryImage}
                        alt={product.name}
                        priority={isPriority}
                        aspectRatio="square"
                        className={`transition-transform duration-700 ${
                          !isOutOfStock && 'group-hover:scale-110'
                        }`}
                      />
                      
                      {/* Badge de múltiples imágenes */}
                      {additionalImagesCount > 0 && (
                        <div className="absolute bottom-4 right-4">
                          <span className="bg-slate-950/90 backdrop-blur-md text-slate-300 text-[9px] font-black px-2.5 py-1.5 rounded-full border border-slate-700/50 flex items-center gap-1">
                            <ImageIcon size={10} />
                            +{additionalImagesCount}
                          </span>
                        </div>
                      )}
                      
                      {/* Badges de estado de stock */}
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
                        
                        {itemInCart && itemInCart.quantity > 0 && (
                          <span className="bg-indigo-950/90 backdrop-blur-md text-indigo-400 text-[9px] font-black px-2.5 py-1 rounded-full border border-indigo-500/30">
                            {itemInCart.quantity} en carrito
                          </span>
                        )}
                      </div>

                      {product.category && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-purple-950/80 backdrop-blur-md text-purple-400 text-[9px] font-black px-2.5 py-1 rounded-full border border-purple-500/30">
                            {product.category.name.toUpperCase()}
                          </span>
                        </div>
                      )}

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
                          onClick={(e) => handleAddToCart(e, product)}
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
                          onClick={(e) => handleInfoClick(e, product.id, product.name)}
                          className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl transition-all active:scale-95 border border-slate-700/50 group/btn"
                          title="Ver detalles"
                        >
                          <Info size={18} className="group-hover/btn:text-indigo-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="text-slate-600 mb-4" size={48} />
              <p className="text-slate-400 font-medium">No se encontraron productos</p>
            </div>
          )}
        </>
      ) : activeTab === 'favorites' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Tus Favoritos</h2>
            <p className="text-slate-400 text-sm">Productos que guardaste para después</p>
          </div>
          <UserFavorites />
        </div>
      ) : (
        <div className="max-w-4xl">
          <UserOrders />
        </div>
      )}
          <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </div>
  );
};

export default UserView;