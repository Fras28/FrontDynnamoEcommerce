import { useState } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ==========================================
// MOCK DATA PARA GRÁFICOS
// ==========================================

const mockRevenueDataByPeriod = {
  daily: [
    { period: '00:00', revenue: 2500, orders: 2 },
    { period: '04:00', revenue: 1200, orders: 1 },
    { period: '08:00', revenue: 4800, orders: 3 },
    { period: '12:00', revenue: 8900, orders: 5 },
    { period: '16:00', revenue: 12300, orders: 7 },
    { period: '20:00', revenue: 6500, orders: 4 },
    { period: '23:59', revenue: 3200, orders: 2 },
  ],
  weekly: [
    { period: 'Lun', revenue: 18500, orders: 37 },
    { period: 'Mar', revenue: 22300, orders: 14 },
    { period: 'Mié', revenue: 19800, orders: 23 },
    { period: 'Jue', revenue: 25600, orders: 8 },
    { period: 'Vie', revenue: 31200, orders: 12 },
    { period: 'Sáb', revenue: 28400, orders: 7 },
    { period: 'Dom', revenue: 15800, orders: 5 },
  ],
  monthly: [
    { period: 'Sem 1', revenue: 45000, orders: 48 },
    { period: 'Sem 2', revenue: 58000, orders: 65 },
    { period: 'Sem 3', revenue: 52000, orders: 53 },
    { period: 'Sem 4', revenue: 67000, orders: 78 },
  ],
};

const mockTopProducts = [
  {
    productId: 2,
    productName: 'Smartwatch Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    totalQuantity: 45,
    totalRevenue: 112495,
    category: 'Electrónica',
  },
  {
    productId: 4,
    productName: 'Zapatillas Running Elite',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    totalQuantity: 32,
    totalRevenue: 105568,
    category: 'Deportes',
  },
  {
    productId: 1,
    productName: 'Auriculares Bluetooth Pro',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    totalQuantity: 38,
    totalRevenue: 60796,
    category: 'Electrónica',
  },
  {
    productId: 6,
    productName: 'Mochila Urbana Premium',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    totalQuantity: 28,
    totalRevenue: 35000,
    category: 'Deportes',
  },
  {
    productId: 5,
    productName: 'Lámpara LED Inteligente',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
    totalQuantity: 22,
    totalRevenue: 19798,
    category: 'Hogar',
  },
];

const mockTopCustomers = [
  {
    userId: 1,
    email: 'juan.perez@email.com',
    orderCount: 12,
    totalSpent: 145680,
    lastOrderDate: '2024-02-01',
  },
  {
    userId: 2,
    email: 'maria.garcia@email.com',
    orderCount: 12,
    totalSpent: 98450,
    lastOrderDate: '2024-01-28',
  },
  {
    userId: 3,
    email: 'carlos.martinez@email.com',
    orderCount: 22,
    totalSpent: 67320,
    lastOrderDate: '2024-01-25',
  },
  {
    userId: 4,
    email: 'lucia.fernandez@email.com',
    orderCount: 9,
    totalSpent: 54890,
    lastOrderDate: '2024-01-30',
  },
  {
    userId: 5,
    email: 'roberto.lopez@email.com',
    orderCount: 14,
    totalSpent: 42150,
    lastOrderDate: '2024-01-22',
  },
];

const mockCategoryData = [
  { categoryId: 1, categoryName: 'Electrónica', totalRevenue: 198459, totalQuantity: 95 },
  { categoryId: 4, categoryName: 'Deportes', totalRevenue: 145680, totalQuantity: 72 },
  { categoryId: 2, categoryName: 'Ropa', totalRevenue: 56780, totalQuantity: 134 },
  { categoryId: 3, categoryName: 'Hogar', totalRevenue: 42350, totalQuantity: 48 },
  { categoryId: 5, categoryName: 'Libros', totalRevenue: 15527, totalQuantity: 28 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

// Custom label para el gráfico de torta
const renderCustomLabel = (entry: any) => {
  const percent = entry.percent || 0;
  const name = entry.categoryName || entry.name || '';
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

// ==========================================
// COMPONENTE DE GRÁFICOS DEMO
// ==========================================

const DemoMetricsCharts = () => {
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const revenueData = mockRevenueDataByPeriod[chartPeriod];

  return (
    <div className="space-y-6">
      {/* Revenue Chart - OPTIMIZADO PARA MOBILE */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-indigo-400" size={20} />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Evolución de Ventas
            </h3>
          </div>
          {/* Botones optimizados para mobile */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                  chartPeriod === period
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {period === 'daily' ? 'Diario' : period === 'weekly' ? 'Semanal' : 'Mensual'}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" stroke="#64748b" style={{ fontSize: '10px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#6366f1', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Órdenes"
              dot={{ fill: '#8b5cf6', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-indigo-400" size={20} />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Productos Más Vendidos
            </h3>
          </div>

          <div className="space-y-3">
            {mockTopProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl hover:bg-slate-800/70 transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-sm font-black text-indigo-400">#{index + 1}</span>
                </div>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-700"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {product.productName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {product.totalQuantity} vendidos • ${product.totalRevenue.toLocaleString()}
                  </p>
                </div>
                {product.category && (
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[9px] font-black uppercase">
                    {product.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-emerald-400" size={20} />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Mejores Clientes
            </h3>
          </div>

          <div className="space-y-3">
            {mockTopCustomers.map((customer, index) => (
              <div
                key={customer.userId}
                className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl hover:bg-slate-800/70 transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-sm font-black text-emerald-400">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{customer.email}</p>
                  <p className="text-xs text-slate-400">
                    {customer.orderCount} órdenes • ${customer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(customer.lastOrderDate).toLocaleDateString('es-AR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="text-purple-400" size={20} />
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Ventas por Categoría
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mockCategoryData}
                dataKey="totalRevenue"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                label={renderCustomLabel}
                labelLine={true}
              >
                {mockCategoryData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f1f5f9'
                }}
                itemStyle={{
                  color: '#f1f5f9',
                }}
                labelStyle={{
                  color: '#f1f5f9',
                  fontWeight: 'bold',
                }}
                formatter={(value: any) => `$${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {mockCategoryData.map((category, index) => (
              <div key={category.categoryId} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{category.categoryName}</p>
                  <p className="text-xs text-slate-400">
                    {category.totalQuantity} unidades • ${category.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
        <p className="text-yellow-400 text-xs text-center font-bold">
          📊 Estos son datos de demostración. Los gráficos muestran información ficticia para propósitos de visualización.
        </p>
      </div>
    </div>
  );
};

export default DemoMetricsCharts;