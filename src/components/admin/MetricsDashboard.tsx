import { useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  ShoppingBag,
} from 'lucide-react';
import {
  useDashboardMetrics,
  useSalesMetrics,
  useRevenueChart,
  useTopProducts,
  useTopCustomers,
  useSalesByCategory,
} from '../../hooks/useMetrics';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MetricsDashboard = () => {
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data: dashboardMetrics, isLoading: loadingDashboard } = useDashboardMetrics();
  const { data: salesMetrics, isLoading: loadingSales } = useSalesMetrics(salesPeriod);
  const { data: revenueData, isLoading: loadingChart } = useRevenueChart(chartPeriod, 30);
  const { data: topProducts, isLoading: loadingProducts } = useTopProducts(5);
  const { data: topCustomers, isLoading: loadingCustomers } = useTopCustomers(5);
  const { data: categoryData, isLoading: loadingCategories } = useSalesByCategory();

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  if (loadingDashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-500">Cargando métricas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
          Panel de <span className="text-indigo-400">Métricas</span>
        </h2>
        <p className="text-slate-400 text-sm">
          Monitorea el rendimiento de tu negocio en tiempo real
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Total */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <DollarSign className="text-indigo-400" size={24} />
            </div>
            <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">
              Revenue Total
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">
              ${dashboardMetrics?.totalRevenue.toLocaleString() || 0}
            </p>
            <p className="text-xs text-slate-400">
              {dashboardMetrics?.totalOrders || 0} órdenes completadas
            </p>
          </div>
        </div>

        {/* Valor Promedio de Orden */}
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-950/30 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <ShoppingCart className="text-purple-400" size={24} />
            </div>
            <span className="text-xs text-purple-400 font-black uppercase tracking-widest">
              Valor Promedio
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">
              ${dashboardMetrics?.averageOrderValue.toLocaleString() || 0}
            </p>
            <p className="text-xs text-slate-400">Por orden</p>
          </div>
        </div>

        {/* Total Clientes */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Users className="text-emerald-400" size={24} />
            </div>
            <span className="text-xs text-emerald-400 font-black uppercase tracking-widest">
              Clientes
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">
              {dashboardMetrics?.totalCustomers || 0}
            </p>
            <p className="text-xs text-slate-400">Usuarios registrados</p>
          </div>
        </div>

        {/* Productos Activos */}
        <div className="bg-gradient-to-br from-orange-900/30 to-orange-950/30 border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Package className="text-orange-400" size={24} />
            </div>
            <span className="text-xs text-orange-400 font-black uppercase tracking-widest">
              Productos
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">
              {dashboardMetrics?.totalProducts || 0}
            </p>
            <p className="text-xs text-slate-400">En catálogo activo</p>
          </div>
        </div>
      </div>

      {/* Sales Metrics by Period */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Ventas por Período
          </h3>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSalesPeriod(period)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  salesPeriod === period
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {period === 'daily' ? 'Hoy' : period === 'weekly' ? 'Semana' : period === 'monthly' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        {loadingSales ? (
          <div className="py-10 text-center text-slate-500">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black">
                Revenue
              </p>
              <p className="text-2xl font-black text-white">
                ${salesMetrics?.totalRevenue.toLocaleString() || 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black">
                Órdenes
              </p>
              <p className="text-2xl font-black text-white">
                {salesMetrics?.totalOrders || 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black flex items-center gap-2">
                Crecimiento
                {(salesMetrics?.growthRate || 0) >= 0 ? (
                  <TrendingUp className="text-emerald-400" size={16} />
                ) : (
                  <TrendingDown className="text-red-400" size={16} />
                )}
              </p>
              <p
                className={`text-2xl font-black ${
                  (salesMetrics?.growthRate || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {salesMetrics?.growthRate.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Revenue Chart */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Evolución de Ventas
          </h3>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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

        {loadingChart ? (
          <div className="py-10 text-center text-slate-500">Cargando...</div>
        ) : (
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
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-indigo-400" size={20} />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Productos Más Vendidos
            </h3>
          </div>

          {loadingProducts ? (
            <div className="py-10 text-center text-slate-500">Cargando...</div>
          ) : (
            <div className="space-y-3">
              {topProducts?.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl"
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
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-emerald-400" size={20} />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Mejores Clientes
            </h3>
          </div>

          {loadingCustomers ? (
            <div className="py-10 text-center text-slate-500">Cargando...</div>
          ) : (
            <div className="space-y-3">
              {topCustomers?.map((customer, index) => (
                <div
                  key={customer.userId}
                  className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl"
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
          )}
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

        {loadingCategories ? (
          <div className="py-10 text-center text-slate-500">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="totalRevenue"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry: any) => {
                    const percent = entry.percent || 0;
                    const name = entry.categoryName || '';
                    return `${name} (${(percent * 100).toFixed(0)}%)`;
                  }}
                  style={{ fontSize: '11px', fill: '#e2e8f0' }}
                >
                  {categoryData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {categoryData?.map((category, index) => (
                <div key={category.categoryId} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
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
        )}
      </div>
    </div>
  );
};

export default MetricsDashboard;