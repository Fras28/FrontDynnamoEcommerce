import { useState } from 'react';
import { 
  Package, ClipboardList, Tag, 
  PieChart, Ruler, Palette, Plus, Archive 
} from 'lucide-react';

// Tablas originales
import ProductsTable from '../adminforms/ProductsTable';
import CategoriesTable from '../adminforms/CategoriesTable';
import SizesTable from '../adminforms/Sizestable';
import ColorsTable from '../adminforms/Colorstable';
import OrdersTable from '../OrdersTable';

// Métricas Demo
import DemoMetricsKPIs from './Demometricskpis';
import DemoMetricsCharts from './Demometricscharts';

// ==========================================
// MOCK DATA COMPLETO Y CORRECTAMENTE TIPADO
// ==========================================

const now = new Date().toISOString();

// Categorías Mock
const mockCategories = [
  { 
    id: 1, 
    name: 'Electrónica', 
    description: 'Gadgets y tecnología',
    createdAt: now,
    updatedAt: now,
    _count: { products: 12 }
  },
  { 
    id: 2, 
    name: 'Ropa', 
    description: 'Moda y textiles',
    createdAt: now,
    updatedAt: now,
    _count: { products: 25 }
  },
  { 
    id: 3, 
    name: 'Deportes', 
    description: 'Equipamiento deportivo',
    createdAt: now,
    updatedAt: now,
    _count: { products: 8 }
  },
  { 
    id: 4, 
    name: 'Hogar', 
    description: 'Decoración y muebles',
    createdAt: now,
    updatedAt: now,
    _count: { products: 15 }
  },
];

// Talles Mock
const mockSizes = [
  { 
    id: 1, 
    name: 'XS', 
    order: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { variants: 15 }
  },
  { 
    id: 2, 
    name: 'S', 
    order: 1,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { variants: 28 }
  },
  { 
    id: 3, 
    name: 'M', 
    order: 2,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { variants: 42 }
  },
  { 
    id: 4, 
    name: 'L', 
    order: 3,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { variants: 35 }
  },
  { 
    id: 5, 
    name: 'XL', 
    order: 4,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { variants: 22 }
  },
  { 
    id: 6, 
    name: 'XXL', 
    order: 5,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    _count: { variants: 12 }
  },
];

// Talles Inactivos Mock
const mockInactiveSizes = [
  { 
    id: 7, 
    name: 'XXXL', 
    order: 6,
    isActive: false,
    createdAt: now,
    updatedAt: now,
    _count: { variants: 5 }
  },
];

// Colores Mock
const mockColors = [
  { 
    id: 1, 
    name: 'Negro', 
    hexCode: '#000000',
    isActive: true, 
    createdAt: now, 
    updatedAt: now,
    _count: { variants: 45 }
  },
  { 
    id: 2, 
    name: 'Blanco', 
    hexCode: '#FFFFFF',
    isActive: true, 
    createdAt: now, 
    updatedAt: now,
    _count: { variants: 38 }
  },
  { 
    id: 3, 
    name: 'Rojo', 
    hexCode: '#EF4444',
    isActive: true, 
    createdAt: now, 
    updatedAt: now,
    _count: { variants: 22 }
  },
  { 
    id: 4, 
    name: 'Azul', 
    hexCode: '#3B82F6',
    isActive: true, 
    createdAt: now, 
    updatedAt: now,
    _count: { variants: 31 }
  },
  { 
    id: 5, 
    name: 'Verde', 
    hexCode: '#22C55E',
    isActive: true, 
    createdAt: now, 
    updatedAt: now,
    _count: { variants: 18 }
  },
  { 
    id: 6, 
    name: 'Gris', 
    hexCode: '#6B7280',
    isActive: true, 
    createdAt: now, 
    updatedAt: now,
    _count: { variants: 25 }
  },
];

// Colores Inactivos Mock
const mockInactiveColors = [
  { 
    id: 7, 
    name: 'Naranja Brillante', 
    hexCode: '#FF6B00',
    isActive: false, 
    createdAt: now, 
    updatedAt: now,
    _count: { variants: 3 }
  },
];

// Productos Mock
const mockProducts = [
  { 
    id: 1, 
    name: 'Auriculares Bluetooth Pro', 
    description: 'Auriculares con cancelación de ruido',
    price: 15999, 
    stock: 45, 
    categoryId: 1,
    category: { id: 1, name: 'Electrónica', description: 'Gadgets y tecnología' }, 
    isActive: true, 
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', productId: 1, isPrimary: true, order: 0 }
    ],
    hasVariants: false,
    variants: [],
    createdAt: now,
    updatedAt: now
  },
  { 
    id: 2, 
    name: 'Smartwatch Fitness', 
    description: 'Reloj inteligente con monitor de actividad',
    price: 24999, 
    stock: 32, 
    categoryId: 1,
    category: { id: 1, name: 'Electrónica', description: 'Gadgets y tecnología' }, 
    isActive: true, 
    images: [
      { id: 2, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', productId: 2, isPrimary: true, order: 0 }
    ],
    hasVariants: false,
    variants: [],
    createdAt: now,
    updatedAt: now
  },
  { 
    id: 3, 
    name: 'Remera Deportiva', 
    description: 'Remera transpirable para running',
    price: 4999, 
    stock: 0,
    categoryId: 2,
    category: { id: 2, name: 'Ropa', description: 'Moda y textiles' }, 
    isActive: true, 
    images: [
      { id: 3, url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', productId: 3, isPrimary: true, order: 0 }
    ],
    hasVariants: true,
    variants: [
      { id: 1, productId: 3, sizeId: 2, colorId: 1, stock: 10, isActive: true, createdAt: now, updatedAt: now },
      { id: 2, productId: 3, sizeId: 3, colorId: 1, stock: 15, isActive: true, createdAt: now, updatedAt: now },
      { id: 3, productId: 3, sizeId: 2, colorId: 2, stock: 8, isActive: true, createdAt: now, updatedAt: now },
    ],
    createdAt: now,
    updatedAt: now
  },
  { 
    id: 4, 
    name: 'Zapatillas Running Elite', 
    description: 'Zapatillas de alto rendimiento',
    price: 32999, 
    stock: 0,
    categoryId: 3,
    category: { id: 3, name: 'Deportes', description: 'Equipamiento deportivo' }, 
    isActive: true, 
    images: [
      { id: 4, url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', productId: 4, isPrimary: true, order: 0 }
    ],
    hasVariants: true,
    variants: [
      { id: 4, productId: 4, sizeId: 2, colorId: 4, stock: 5, isActive: true, createdAt: now, updatedAt: now },
      { id: 5, productId: 4, sizeId: 3, colorId: 4, stock: 12, isActive: true, createdAt: now, updatedAt: now },
      { id: 6, productId: 4, sizeId: 4, colorId: 1, stock: 8, isActive: true, createdAt: now, updatedAt: now },
    ],
    createdAt: now,
    updatedAt: now
  },
  { 
    id: 5, 
    name: 'Lámpara LED Inteligente', 
    description: 'Lámpara regulable con control remoto',
    price: 8999, 
    stock: 22, 
    categoryId: 4,
    category: { id: 4, name: 'Hogar', description: 'Decoración y muebles' }, 
    isActive: true, 
    images: [
      { id: 5, url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400', productId: 5, isPrimary: true, order: 0 }
    ],
    hasVariants: false,
    variants: [],
    createdAt: now,
    updatedAt: now
  },
];

// Productos Inactivos Mock
const mockInactiveProducts = [
  { 
    id: 6, 
    name: 'Mouse Inalámbrico (Descontinuado)', 
    description: 'Modelo anterior',
    price: 2999, 
    stock: 0, 
    categoryId: 1,
    category: { id: 1, name: 'Electrónica', description: 'Gadgets y tecnología' }, 
    isActive: false, 
    images: [
      { id: 6, url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', productId: 6, isPrimary: true, order: 0 }
    ],
    hasVariants: false,
    variants: [],
    createdAt: now,
    updatedAt: now
  },
];

// Órdenes Mock
const mockOrders = [
  {
    id: 1,
    userId: 1,
    total: 48998,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    paymentMethod: 'mercadopago',
    paymentStatus: 'APPROVED',
    discount: 0,
    finalTotal: 48998,
    items: [
      {
        id: 1,
        productId: 1,
        variantId: null,
        quantity: 2,
        price: 15999,
        product: {
          id: 1,
          name: 'Auriculares Bluetooth Pro',
          images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' }]
        }
      },
      {
        id: 2,
        productId: 5,
        variantId: null,
        quantity: 2,
        price: 8999,
        product: {
          id: 5,
          name: 'Lámpara LED Inteligente',
          images: [{ url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400' }]
        }
      }
    ],
    user: {
      id: 1,
      email: 'cliente1@email.com',
      phone: '+54 9 11 1234-5678',
      address: 'Av. Corrientes 1234, CABA'
    }
  },
  {
    id: 2,
    userId: 2,
    total: 32999,
    status: 'SHIPPED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    paymentMethod: 'transfer',
    paymentStatus: 'APPROVED',
    discount: 0,
    finalTotal: 32999,
    items: [
      {
        id: 3,
        productId: 4,
        variantId: 5,
        quantity: 1,
        price: 32999,
        product: {
          id: 4,
          name: 'Zapatillas Running Elite',
          images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }]
        },
        variant: {
          id: 5,
          productId: 4,
          sizeId: 3,
          colorId: 4,
          stock: 12,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          size: { id: 3, name: 'M', order: 2, isActive: true, createdAt: now, updatedAt: now },
          color: { id: 4, name: 'Azul', hexCode: '#3B82F6', isActive: true, createdAt: now, updatedAt: now }
        }
      }
    ],
    user: {
      id: 2,
      email: 'cliente2@email.com',
      phone: '+54 9 11 9876-5432',
      address: 'Calle Falsa 123, Buenos Aires'
    }
  },
  {
    id: 3,
    userId: 3,
    total: 9998,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    paymentMethod: 'cash',
    paymentStatus: 'PENDING',
    discount: 1000,
    finalTotal: 8998,
    items: [
      {
        id: 4,
        productId: 3,
        variantId: 2,
        quantity: 2,
        price: 4999,
        product: {
          id: 3,
          name: 'Remera Deportiva',
          images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' }]
        },
        variant: {
          id: 2,
          productId: 3,
          sizeId: 3,
          colorId: 1,
          stock: 15,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          size: { id: 3, name: 'M', order: 2, isActive: true, createdAt: now, updatedAt: now },
          color: { id: 1, name: 'Negro', hexCode: '#000000', isActive: true, createdAt: now, updatedAt: now }
        }
      }
    ],
    user: {
      id: 3,
      email: 'cliente3@email.com',
      phone: '+54 9 11 5555-1234',
      address: 'San Martín 456, La Plata'
    }
  }
];

// ==========================================
// COMPONENTE DASHBOARD (DEMO)
// ==========================================

// ⚠️ Este componente NO recibe props - es completamente standalone
const DemoDashboard = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'inventory' | 'orders' | 'categories' | 'sizes' | 'colors' | 'inactive'>('metrics');

  const handleReadOnlyAction = () => {
    alert('⚠️ Modo Demo: Las funciones de escritura (crear/editar/eliminar) están deshabilitadas.\n\nEste es un entorno de demostración con datos ficticios.');
  };

  // Header visual para los formularios bloqueados
  const MockFormHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-500/10 rounded-2xl">
          <Icon className="text-indigo-400" size={24} />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">Modo solo lectura</p>
        </div>
      </div>
      
      <div className="space-y-4 opacity-30 pointer-events-none">
        <div className="h-10 sm:h-12 bg-slate-800 rounded-xl w-full animate-pulse" />
        <div className="h-10 sm:h-12 bg-slate-800 rounded-xl w-full animate-pulse" />
        <div className="h-24 sm:h-32 bg-slate-800 rounded-xl w-full animate-pulse" />
      </div>
      
      <button className="w-full py-3 sm:py-4 bg-slate-800 text-slate-500 rounded-xl font-black uppercase text-xs tracking-widest cursor-not-allowed flex items-center justify-center gap-2">
        🔒 Solo Lectura - Modo Demo
      </button>
    </div>
  );

  // Separar activos e inactivos
  const activeSizes = mockSizes;
  const inactiveSizes = mockInactiveSizes;
  const activeColors = mockColors;
  const inactiveColors = mockInactiveColors;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 overflow-x-hidden">
      
      {/* Selector de Tabs - Optimizado para mobile */}
      <div className="flex flex-wrap gap-2 sm:gap-3 p-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl sm:rounded-[2rem] w-full sm:w-fit overflow-x-auto scrollbar-hide">
        {[
          { id: 'metrics', label: 'Métricas', icon: PieChart, color: 'bg-indigo-600' },
          { id: 'inventory', label: 'Productos', icon: Package, color: 'bg-blue-600' },
          { id: 'categories', label: 'Categorías', icon: Tag, color: 'bg-purple-600' },
          { id: 'sizes', label: 'Talles', icon: Ruler, color: 'bg-cyan-600' },
          { id: 'colors', label: 'Colores', icon: Palette, color: 'bg-pink-600' },
          { id: 'orders', label: 'Ventas', icon: ClipboardList, color: 'bg-emerald-600' },
          { id: 'inactive', label: 'Inactivos', icon: Archive, color: 'bg-orange-600' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider sm:tracking-widest flex-shrink-0 ${
              activeTab === tab.id ? `${tab.color} text-white shadow-lg` : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <tab.icon size={14} className="flex-shrink-0" /> 
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido según el tab activo */}
      <div className="mt-8">
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <DemoMetricsKPIs />
            <DemoMetricsCharts />
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-8">
              <MockFormHeader title="Nuevo Producto" icon={Plus} />
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Package className="text-blue-500 flex-shrink-0" size={18} />
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">
                      Inventario de Productos
                    </h3>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                    {mockProducts.length} productos activos
                  </span>
                </div>
                <ProductsTable products={mockProducts as any} onEdit={handleReadOnlyAction} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <MockFormHeader title="Nueva Categoría" icon={Tag} />
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Tag className="text-purple-500 flex-shrink-0" size={18} />
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">
                      Gestión de Categorías
                    </h3>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                    {mockCategories.length} categorías
                  </span>
                </div>
                <CategoriesTable categories={mockCategories as any} onEdit={handleReadOnlyAction} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sizes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <MockFormHeader title="Nuevo Talle" icon={Ruler} />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Ruler className="text-cyan-500 flex-shrink-0" size={18} />
                  <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">
                    Gestión de Talles
                  </h3>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                  {activeSizes.length} activos / {inactiveSizes.length} inactivos
                </span>
              </div>
              
              {/* Talles Activos */}
              <SizesTable sizes={activeSizes as any} onEdit={handleReadOnlyAction} showInactive={false} />
              
              {/* Talles Inactivos */}
              {inactiveSizes.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest px-2">
                    Talles Inactivos
                  </h4>
                  <SizesTable sizes={inactiveSizes as any} onEdit={handleReadOnlyAction} showInactive={true} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <MockFormHeader title="Nuevo Color" icon={Palette} />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Palette className="text-pink-500 flex-shrink-0" size={18} />
                  <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">
                    Gestión de Colores
                  </h3>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                  {activeColors.length} activos / {inactiveColors.length} inactivos
                </span>
              </div>
              
              {/* Colores Activos */}
              <ColorsTable colors={activeColors as any} onEdit={handleReadOnlyAction} showInactive={false} />
              
              {/* Colores Inactivos */}
              {inactiveColors.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest px-2">
                    Colores Inactivos
                  </h4>
                  <ColorsTable colors={inactiveColors as any} onEdit={handleReadOnlyAction} showInactive={true} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 px-2">
              <ClipboardList className="text-emerald-500 flex-shrink-0" size={18} />
              <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">
                Monitor de Transacciones
              </h3>
            </div>
            <OrdersTable orders={mockOrders} onUpdateStatus={handleReadOnlyAction} />
          </div>
        )}

        {activeTab === 'inactive' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Info Banner */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-orange-500/20 rounded-xl flex-shrink-0">
                  <Archive className="text-orange-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Productos Desactivados
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Estos productos fueron eliminados pero se mantienen en el sistema porque tienen órdenes asociadas. 
                    Puedes reactivarlos en cualquier momento.
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                      <span className="text-slate-400 font-bold whitespace-nowrap">
                        {mockInactiveProducts.length} productos inactivos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-indigo-500 flex-shrink-0"></div>
                      <span className="text-slate-400 font-bold whitespace-nowrap">
                        {mockProducts.length} productos activos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Productos Inactivos */}
            {mockInactiveProducts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Archive className="text-orange-500 flex-shrink-0" size={18} />
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider sm:tracking-widest">
                      Productos Archivados
                    </h3>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase italic">
                    {mockInactiveProducts.length} items desactivados
                  </span>
                </div>
                <ProductsTable 
                  products={mockInactiveProducts as any} 
                  onEdit={handleReadOnlyAction}
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
        )}
      </div>

      {/* Banner de Modo Demo - Siempre visible en la parte inferior */}
      <div className="mt-8 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <span className="text-yellow-500 font-black text-sm">🎭</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-yellow-400 uppercase mb-1">Modo Demostración Activo</h4>
            <p className="text-xs text-slate-400">
              Estás visualizando datos de ejemplo. Todas las funciones de edición están deshabilitadas. 
              Para trabajar con datos reales, desactiva el modo demo desde el botón superior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;