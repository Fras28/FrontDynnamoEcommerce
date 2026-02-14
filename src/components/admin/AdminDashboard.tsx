import { useState, useEffect } from 'react';
import { Loader2, Package, ClipboardList, BarChart3, TrendingUp, Tag, Archive, PieChart, Ruler, Palette } from 'lucide-react';
import { useProducts, useInactiveProducts } from '../../hooks/useProducts';
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import { useCategories } from '../../hooks/useCategories';
import { useAllSizes, useAllColors } from '@/hooks/Usesizesandcolors';
import { Product, Category, Size, Color } from '../../types';
import ProductsTable from './adminforms/ProductsTable';
import ProductForm from './adminforms/ProductForm';
import CategoryForm from './adminforms/Categoryform';
import CategoriesTable from './adminforms/CategoriesTable';
import SizesTable from './adminforms/Sizestable';
import SizeForm from './adminforms/Sizeform';
import ColorsTable from './adminforms/Colorstable';
import ColorForm from './adminforms/Colorform';
import OrdersTable from './OrdersTable';
import MetricsDashboard from './MetricsDashboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'inventory' | 'orders' | 'categories' | 'sizes' | 'colors' | 'inactive'>('metrics');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: inactiveProducts, isLoading: loadingInactive } = useInactiveProducts();
  const { data: orders, isLoading: loadingOrders } = useAdminOrders();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: sizes, isLoading: loadingSizes } = useAllSizes();
  const { data: colors, isLoading: loadingColors } = useAllColors();
  const updateStatusMutation = useUpdateOrderStatus();

  // ✅ Scroll al inicio cuando cambia el tab
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setActiveTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSize = (size: Size) => {
    setEditingSize(size);
    setActiveTab('sizes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditColor = (color: Color) => {
    setEditingColor(color);
    setActiveTab('colors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewSize = () => {
    setEditingSize(null);
    setActiveTab('sizes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewColor = () => {
    setEditingColor(null);
    setActiveTab('colors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingProducts || loadingOrders || loadingCategories || loadingSizes || loadingColors) {
    return (
      <div className="flex flex-col items-center justify-center py-20 sm:py-40">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-500 relative z-10" size={40} />
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
        </div>
        <p className="text-slate-500 font-black uppercase italic tracking-widest mt-6 animate-pulse text-xs">
          Accediendo al sistema...
        </p>
      </div>
    );
  }

  // Separar sizes y colors activos vs inactivos
  const activeSizes = sizes?.filter(s => s.isActive) || [];
  const inactiveSizes = sizes?.filter(s => !s.isActive) || [];
  const activeColors = colors?.filter(c => c.isActive) || [];
  const inactiveColors = colors?.filter(c => !c.isActive) || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 overflow-x-hidden">
      {/* Selector de Pestañas - Optimizado para mobile */}
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[2rem] w-full sm:w-fit mx-auto md:mx-0 overflow-x-auto scrollbar-hide">
        {/* ✅ Métricas */}
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest flex-shrink-0 ${
            activeTab === 'metrics' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <PieChart size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">Métricas</span>
          <span className="sm:hidden">📊</span>
        </button>

        {/* Inventario */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest flex-shrink-0 ${
            activeTab === 'inventory' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Package size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">Inventario</span>
          <span className="sm:hidden">📦</span>
        </button>
        
        {/* Categorías */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest flex-shrink-0 ${
            activeTab === 'categories' 
              ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Tag size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">Categorías</span>
          <span className="sm:hidden">🏷️</span>
        </button>

        {/* ✨ NUEVO: Talles */}
        <button
          onClick={() => setActiveTab('sizes')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest flex-shrink-0 ${
            activeTab === 'sizes' 
              ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Ruler size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">Talles</span>
          <span className="sm:hidden">📏</span>
        </button>

        {/* ✨ NUEVO: Colores */}
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest flex-shrink-0 ${
            activeTab === 'colors' 
              ? 'bg-pink-600 text-white shadow-xl shadow-pink-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Palette size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">Colores</span>
          <span className="sm:hidden">🎨</span>
        </button>

        {/* Inactivos */}
        <button
          onClick={() => setActiveTab('inactive')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest relative flex-shrink-0 ${
            activeTab === 'inactive' 
              ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Archive size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">Inactivos</span>
          <span className="sm:hidden">📁</span>
          {inactiveProducts && inactiveProducts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
              {inactiveProducts.length}
            </span>
          )}
        </button>
        
        {/* Ventas */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest flex-shrink-0 ${
            activeTab === 'orders' 
              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ClipboardList size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">Ventas</span>
          <span className="sm:hidden">💰</span>
        </button>
      </div>

      {/* ✅ Pestaña de Métricas */}
      {activeTab === 'metrics' ? (
        <MetricsDashboard />
      ) : activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <ProductForm editingProduct={editingProduct} onCancel={() => setEditingProduct(null)} />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <BarChart3 className="text-indigo-500 flex-shrink-0" size={18} />
                <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">Control de Existencias</h3>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                {products?.length || 0} items activos
              </span>
            </div>
            <ProductsTable products={products || []} onEdit={handleEdit} />
          </div>
        </div>
      ) : activeTab === 'categories' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <CategoryForm editingCategory={editingCategory} onCancel={() => setEditingCategory(null)} />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Tag className="text-purple-500 flex-shrink-0" size={18} />
                <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">Gestión de Categorías</h3>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                {categories?.length || 0} categorías
              </span>
            </div>
            <CategoriesTable categories={categories || []} onEdit={handleEditCategory} />
          </div>
        </div>
      ) : activeTab === 'sizes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <SizeForm editingSize={editingSize} onCancel={() => setEditingSize(null)} />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Ruler className="text-cyan-500 flex-shrink-0" size={18} />
                <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">Gestión de Talles</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                  {activeSizes.length} activos / {inactiveSizes.length} inactivos
                </span>
                {editingSize && (
                  <button
                    onClick={handleNewSize}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-black uppercase transition-colors flex items-center gap-1.5"
                  >
                    <Ruler size={12} />
                    Nuevo
                  </button>
                )}
              </div>
            </div>
            {activeSizes.length > 0 ? (
              <SizesTable sizes={activeSizes} onEdit={handleEditSize} showInactive={false} />
            ) : (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-2xl text-center">
                <Ruler size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-base font-black text-slate-600 uppercase tracking-widest mb-2">
                  No hay talles creados
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Comienza creando talles para tus productos
                </p>
                <button
                  onClick={handleNewSize}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-black uppercase transition-colors inline-flex items-center gap-2"
                >
                  <Ruler size={14} />
                  Crear Primer Talle
                </button>
              </div>
            )}
            {inactiveSizes.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest px-2">
                  Talles Inactivos
                </h4>
                <SizesTable sizes={inactiveSizes} onEdit={handleEditSize} showInactive={true} />
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'colors' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <ColorForm editingColor={editingColor} onCancel={() => setEditingColor(null)} />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Palette className="text-pink-500 flex-shrink-0" size={18} />
                <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">Gestión de Colores</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                  {activeColors.length} activos / {inactiveColors.length} inactivos
                </span>
                {editingColor && (
                  <button
                    onClick={handleNewColor}
                    className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-[10px] font-black uppercase transition-colors flex items-center gap-1.5"
                  >
                    <Palette size={12} />
                    Nuevo
                  </button>
                )}
              </div>
            </div>
            {activeColors.length > 0 ? (
              <ColorsTable colors={activeColors} onEdit={handleEditColor} showInactive={false} />
            ) : (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-2xl text-center">
                <Palette size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-base font-black text-slate-600 uppercase tracking-widest mb-2">
                  No hay colores creados
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Comienza creando colores para tus productos
                </p>
                <button
                  onClick={handleNewColor}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-black uppercase transition-colors inline-flex items-center gap-2"
                >
                  <Palette size={14} />
                  Crear Primer Color
                </button>
              </div>
            )}
            {inactiveColors.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest px-2">
                  Colores Inactivos
                </h4>
                <ColorsTable colors={inactiveColors} onEdit={handleEditColor} showInactive={true} />
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'inactive' ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-orange-500/20 rounded-xl flex-shrink-0">
                <Archive className="text-orange-400" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight break-words">
                  Productos Desactivados
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 break-words">
                  Estos productos fueron eliminados pero se mantienen en el sistema porque tienen órdenes asociadas. 
                  Puedes reactivarlos en cualquier momento.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <span className="text-slate-400 font-bold whitespace-nowrap">
                      {inactiveProducts?.length || 0} productos inactivos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-indigo-500 flex-shrink-0"></div>
                    <span className="text-slate-400 font-bold whitespace-nowrap">
                      {products?.length || 0} productos activos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loadingInactive ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
          ) : inactiveProducts && inactiveProducts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Archive className="text-orange-500 flex-shrink-0" size={18} />
                  <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">
                    Productos Archivados
                  </h3>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                  {inactiveProducts.length} items desactivados
                </span>
              </div>
              <ProductsTable 
                products={inactiveProducts} 
                onEdit={handleEdit}
                showInactive={true}
              />
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 sm:p-20 rounded-2xl sm:rounded-[3rem] text-center">
              <Archive className="mx-auto text-slate-700 mb-4" size={40} />
              <h3 className="text-base sm:text-lg font-black text-slate-600 uppercase tracking-widest mb-2">
                Sin Productos Inactivos
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                No hay productos desactivados en este momento.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
            <TrendingUp className="text-emerald-500 flex-shrink-0" size={18} />
            <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">Monitor de Transacciones</h3>
          </div>
          <OrdersTable 
            orders={orders || []} 
            onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })} 
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;