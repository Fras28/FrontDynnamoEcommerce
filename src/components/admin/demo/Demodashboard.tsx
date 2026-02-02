import { useState } from 'react';
import { Loader2, Package, ClipboardList, BarChart3, TrendingUp, Tag, Archive, PieChart, Eye, EyeOff } from 'lucide-react';
import ProductsTable from '../categorias/ProductsTable';
import ProductForm from '../categorias/ProductForm';
import CategoryForm from '../categorias/Categoryform';
import CategoriesTable from '../categorias/CategoriesTable';
import OrdersTable from '../OrdersTable';
import MetricsDashboard from '../MetricsDashboard';
import DemoMetricsKPIs from './Demometricskpis';
import DemoMetricsCharts from './Demometricscharts';


// ==========================================
// MOCK DATA - Datos ficticios para la demo
// ==========================================

const mockCategories = [
  { id: 1, name: 'Electrónica', description: 'Dispositivos y accesorios electrónicos', createdAt: '2024-01-15' },
  { id: 2, name: 'Ropa', description: 'Indumentaria y accesorios de moda', createdAt: '2024-01-20' },
  { id: 3, name: 'Hogar', description: 'Artículos para el hogar y decoración', createdAt: '2024-02-01' },
  { id: 4, name: 'Deportes', description: 'Equipamiento deportivo y fitness', createdAt: '2024-02-10' },
  { id: 5, name: 'Libros', description: 'Libros y material de lectura', createdAt: '2024-02-15' },
];

const mockProducts = [
  {
    id: 1,
    name: 'Auriculares Bluetooth Pro',
    description: 'Auriculares inalámbricos con cancelación de ruido activa',
    price: 15999,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    categoryId: 1,
    category: { name: 'Electrónica' },
    isActive: true,
  },
  {
    id: 2,
    name: 'Smartwatch Fitness',
    description: 'Reloj inteligente con monitor de actividad física',
    price: 24999,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    categoryId: 1,
    category: { name: 'Electrónica' },
    isActive: true,
  },
  {
    id: 3,
    name: 'Remera Premium Cotton',
    description: 'Remera 100% algodón en diferentes colores',
    price: 4500,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    categoryId: 2,
    category: { name: 'Ropa' },
    isActive: true,
  },
  {
    id: 4,
    name: 'Zapatillas Running Elite',
    description: 'Zapatillas profesionales para corredores',
    price: 32999,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    categoryId: 4,
    category: { name: 'Deportes' },
    isActive: true,
  },
  {
    id: 5,
    name: 'Lámpara LED Inteligente',
    description: 'Lámpara con control por app y cambio de color',
    price: 8999,
    stock: 67,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
    categoryId: 3,
    category: { name: 'Hogar' },
    isActive: true,
  },
  {
    id: 6,
    name: 'Mochila Urbana Premium',
    description: 'Mochila resistente al agua con puerto USB',
    price: 12500,
    stock: 52,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    categoryId: 4,
    category: { name: 'Deportes' },
    isActive: true,
  },
  {
    id: 7,
    name: 'Mouse Gaming RGB',
    description: 'Mouse ergonómico para gaming con 7 botones',
    price: 9800,
    stock: 88,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    categoryId: 1,
    category: { name: 'Electrónica' },
    isActive: true,
  },
  {
    id: 8,
    name: 'Libro: Emprendimiento Digital',
    description: 'Guía completa para emprendedores modernos',
    price: 5500,
    stock: 95,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    categoryId: 5,
    category: { name: 'Libros' },
    isActive: true,
  },
];

const mockInactiveProducts = [
  {
    id: 100,
    name: 'Producto Descontinuado',
    description: 'Este producto ya no está disponible',
    price: 5000,
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
    categoryId: 1,
    category: { name: 'Electrónica' },
    isActive: false,
  },
];

const mockOrders = [
  {
    id: 1001,
    status: 'COMPLETED',
    total: 56498,
    createdAt: '2024-02-02T10:30:00',
    user: {
      email: 'juan.perez@email.com',
      phone: '+5492914567890',
      address: 'Av. Alem 1234, Bahía Blanca, Buenos Aires',
    },
    items: [
      {
        id: 1,
        quantity: 1,
        product: {
          name: 'Smartwatch Fitness',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        },
      },
      {
        id: 2,
        quantity: 2,
        product: {
          name: 'Auriculares Bluetooth Pro',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        },
      },
    ],
  },
  {
    id: 1002,
    status: 'SHIPPED',
    total: 37499,
    createdAt: '2024-02-01T15:45:00',
    user: {
      email: 'maria.garcia@email.com',
      phone: '+5492915678901',
      address: 'Calle Brown 567, Bahía Blanca, Buenos Aires',
    },
    items: [
      {
        id: 3,
        quantity: 1,
        product: {
          name: 'Zapatillas Running Elite',
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        },
      },
      {
        id: 4,
        quantity: 1,
        product: {
          name: 'Remera Premium Cotton',
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        },
      },
    ],
  },
  {
    id: 1003,
    status: 'DELIVERED',
    total: 21499,
    createdAt: '2024-01-30T09:20:00',
    user: {
      email: 'carlos.martinez@email.com',
      phone: '+5492916789012',
      address: 'San Martín 890, Bahía Blanca, Buenos Aires',
    },
    items: [
      {
        id: 5,
        quantity: 1,
        product: {
          name: 'Lámpara LED Inteligente',
          imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
        },
      },
      {
        id: 6,
        quantity: 1,
        product: {
          name: 'Mochila Urbana Premium',
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        },
      },
    ],
  },
  {
    id: 1004,
    status: 'COMPLETED',
    total: 25300,
    createdAt: '2024-02-02T14:10:00',
    user: {
      email: 'lucia.fernandez@email.com',
      phone: '+5492917890123',
      address: 'Belgrano 2345, Bahía Blanca, Buenos Aires',
    },
    items: [
      {
        id: 7,
        quantity: 1,
        product: {
          name: 'Mouse Gaming RGB',
          imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        },
      },
      {
        id: 8,
        quantity: 1,
        product: {
          name: 'Auriculares Bluetooth Pro',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        },
      },
    ],
  },
  {
    id: 1005,
    status: 'PENDING',
    total: 18000,
    createdAt: '2024-02-02T16:30:00',
    user: {
      email: 'roberto.lopez@email.com',
      phone: '+5492918901234',
      address: 'Rivadavia 456, Bahía Blanca, Buenos Aires',
    },
    items: [
      {
        id: 9,
        quantity: 4,
        product: {
          name: 'Remera Premium Cotton',
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        },
      },
    ],
  },
];


// ==========================================
// COMPONENTE PRINCIPAL CON TOGGLE DEMO
// ==========================================

interface DemoDashboardProps {
  useProducts: any;
  useInactiveProducts: any;
  useAdminOrders: any;
  useCategories: any;
  useUpdateOrderStatus: any;
}

const DemoDashboard = ({
  useProducts: realUseProducts,
  useInactiveProducts: realUseInactiveProducts,
  useAdminOrders: realUseAdminOrders,
  useCategories: realUseCategories,
  useUpdateOrderStatus,
}: DemoDashboardProps) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'inventory' | 'orders' | 'categories' | 'inactive'>('metrics');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // ✅ SIEMPRE llamar a los hooks reales (regla de React)
  const realProducts = realUseProducts();
  const realInactiveProducts = realUseInactiveProducts();
  const realOrders = realUseAdminOrders();
  const realCategories = realUseCategories();
  const updateStatusMutation = useUpdateOrderStatus();

  // ✅ Decidir qué datos usar según el modo
  const products = isDemoMode ? mockProducts : realProducts.data;
  const loadingProducts = isDemoMode ? false : realProducts.isLoading;
  
  const inactiveProducts = isDemoMode ? mockInactiveProducts : realInactiveProducts.data;
  const loadingInactive = isDemoMode ? false : realInactiveProducts.isLoading;
  
  const orders = isDemoMode ? mockOrders : realOrders.data;
  const loadingOrders = isDemoMode ? false : realOrders.isLoading;
  
  const categories = isDemoMode ? mockCategories : realCategories.data;
  const loadingCategories = isDemoMode ? false : realCategories.isLoading;

  const handleEdit = (product: any) => {
    if (isDemoMode) {
      alert('⚠️ Modo Demo: Las ediciones no se guardarán');
      return;
    }
    setEditingProduct(product);
    setActiveTab('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditCategory = (category: any) => {
    if (isDemoMode) {
      alert('⚠️ Modo Demo: Las ediciones no se guardarán');
      return;
    }
    setEditingCategory(category);
    setActiveTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStatus = (id: number, status: string) => {
    if (isDemoMode) {
      alert('⚠️ Modo Demo: Los cambios no se aplicarán');
      return;
    }
    updateStatusMutation.mutate({ id, status });
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    setActiveTab('metrics'); // Volver a métricas al cambiar modo
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
      {/* Toggle Demo Mode Button */}
      <div className="flex justify-end">
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest shadow-lg ${
            isDemoMode
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-yellow-600/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {isDemoMode ? <EyeOff size={14} /> : <Eye size={14} />}
          {isDemoMode ? 'Modo Demo Activo' : 'Activar Demo'}
        </button>
      </div>

      {/* Demo Notice Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Eye className="text-yellow-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-yellow-400 uppercase tracking-tight mb-2">
                🎭 Modo Demostración Activo
              </h3>
              <p className="text-sm text-slate-300">
                Estás viendo datos ficticios para explorar el dashboard. Todos los productos, órdenes y métricas son ejemplos.
                Las ediciones y cambios <strong>no se guardarán</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 bg-slate-900 border border-slate-800 rounded-[2rem] w-fit mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest ${
            activeTab === 'metrics'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <PieChart size={14} /> Métricas
        </button>

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

        <button
          onClick={() => setActiveTab('inactive')}
          className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest relative ${
            activeTab === 'inactive'
              ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Archive size={14} /> Inactivos
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

      {/* Content */}
      {activeTab === 'metrics' ? (
        isDemoMode ? (
          <>
            <DemoMetricsKPIs />
            <DemoMetricsCharts />
          </>
        ) : (
          <MetricsDashboard />
        )
      ) : activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            {isDemoMode ? (
              <div className="bg-slate-900/50 border border-yellow-500/20 p-12 rounded-[2rem] text-center">
                <Eye className="mx-auto text-yellow-500 mb-4" size={48} />
                <h3 className="text-lg font-black text-yellow-400 uppercase tracking-widest mb-2">
                  Modo Demo
                </h3>
                <p className="text-sm text-slate-400">
                  La edición está deshabilitada en modo demostración
                </p>
              </div>
            ) : (
              <ProductForm editingProduct={editingProduct} onCancel={() => setEditingProduct(null)} />
            )}
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
            {isDemoMode ? (
              <div className="bg-slate-900/50 border border-yellow-500/20 p-12 rounded-[2rem] text-center">
                <Eye className="mx-auto text-yellow-500 mb-4" size={48} />
                <h3 className="text-lg font-black text-yellow-400 uppercase tracking-widest mb-2">
                  Modo Demo
                </h3>
                <p className="text-sm text-slate-400">
                  La edición está deshabilitada en modo demostración
                </p>
              </div>
            ) : (
              <CategoryForm editingCategory={editingCategory} onCancel={() => setEditingCategory(null)} />
            )}
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
              <ProductsTable products={inactiveProducts} onEdit={handleEdit} showInactive={true} />
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 p-20 rounded-[3rem] text-center">
              <Archive className="mx-auto text-slate-700 mb-4" size={48} />
              <h3 className="text-lg font-black text-slate-600 uppercase tracking-widest mb-2">
                Sin Productos Inactivos
              </h3>
              <p className="text-sm text-slate-500">No hay productos desactivados en este momento.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6 px-2">
            <TrendingUp className="text-emerald-500" size={20} />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Monitor de Transacciones</h3>
          </div>
          <OrdersTable orders={orders || []} onUpdateStatus={handleUpdateStatus} />
        </div>
      )}
    </div>
  );
};

export default DemoDashboard;