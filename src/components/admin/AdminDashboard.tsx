import { useState } from 'react';
import { Loader2, Package, ClipboardList, BarChart3, TrendingUp, Tag, Archive } from 'lucide-react';
import { useProducts, useInactiveProducts } from '../../hooks/useProducts';
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import { useCategories } from '../../hooks/useCategories';
import { Product, Category } from '../../types';
import ProductsTable from './categorias/ProductsTable';
import ProductForm from './categorias/ProductForm';
import CategoryForm from './categorias/Categoryform';
import CategoriesTable from './categorias/CategoriesTable';
import OrdersTable from './OrdersTable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'categories' | 'inactive'>('inventory');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: inactiveProducts, isLoading: loadingInactive } = useInactiveProducts();
  const { data: orders, isLoading: loadingOrders } = useAdminOrders();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const updateStatusMutation = useUpdateOrderStatus();

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

  if (loadingProducts || loadingOrders || loadingCategories) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-500 relative z-10" size={50} />
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
        </div>
        <p className="text-slate-500 font-black uppercase italic tracking-widest mt-6 animate-pulse text-xs">
          Accediendo al sistema...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Selector de Pestañas Estilo Terminal */}
      <div className="flex flex-wrap gap-4 p-1.5 bg-slate-900 border border-slate-800 rounded-[2rem] w-fit mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest ${
            activeTab === 'inventory' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Package size={14} /> Inventario
        </button>
        
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest ${
            activeTab === 'categories' 
              ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Tag size={14} /> Categorías
        </button>

        {/* ✅ NUEVA PESTAÑA: Productos Inactivos */}
        <button
          onClick={() => setActiveTab('inactive')}
          className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest relative ${
            activeTab === 'inactive' 
              ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Archive size={14} /> Inactivos
          {/* Badge con contador de productos inactivos */}
          {inactiveProducts && inactiveProducts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
              {inactiveProducts.length}
            </span>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest ${
            activeTab === 'orders' 
              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ClipboardList size={14} /> Ventas
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <ProductForm editingProduct={editingProduct} onCancel={() => setEditingProduct(null)} />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-indigo-500" size={20} />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Control de Existencias</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase italic">
                {products?.length || 0} items activos
              </span>
            </div>
            <ProductsTable products={products || []} onEdit={handleEdit} />
          </div>
        </div>
      ) : activeTab === 'categories' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <CategoryForm editingCategory={editingCategory} onCancel={() => setEditingCategory(null)} />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-3">
                <Tag className="text-purple-500" size={20} />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Gestión de Categorías</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase italic">
                {categories?.length || 0} categorías
              </span>
            </div>
            <CategoriesTable categories={categories || []} onEdit={handleEditCategory} />
          </div>
        </div>
      ) : activeTab === 'inactive' ? (
        // ✅ NUEVA SECCIÓN: Productos Inactivos
        <div className="space-y-6">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Archive className="text-orange-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Productos Desactivados
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Estos productos fueron eliminados pero se mantienen en el sistema porque tienen órdenes asociadas. 
                  Puedes reactivarlos en cualquier momento.
                </p>
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-slate-400 font-bold">
                      {inactiveProducts?.length || 0} productos inactivos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-slate-400 font-bold">
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
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-3">
                  <Archive className="text-orange-500" size={20} />
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    Productos Archivados
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase italic">
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
            <div className="bg-slate-900/50 border border-dashed border-slate-800 p-20 rounded-[3rem] text-center">
              <Archive className="mx-auto text-slate-700 mb-4" size={48} />
              <h3 className="text-lg font-black text-slate-600 uppercase tracking-widest mb-2">
                Sin Productos Inactivos
              </h3>
              <p className="text-sm text-slate-500">
                No hay productos desactivados en este momento.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6 px-2">
            <TrendingUp className="text-emerald-500" size={20} />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Monitor de Transacciones</h3>
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