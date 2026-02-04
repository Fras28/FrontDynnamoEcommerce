import { useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';

// Mock data
const mockDashboardMetrics = {
  totalRevenue: 45087960,
  totalOrders: 796,
  averageOrderValue: 48760,
  totalCustomers: 634,
  totalProducts: 63,
};

const mockSalesMetrics = {
  monthly: { totalRevenue: 7082450, totalOrders: 57, growthRate: 23.5 },
  weekly: { totalRevenue: 1785200, totalOrders: 28, growthRate: -12.3 },
  daily: { totalRevenue: 220500, totalOrders: 19, growthRate: 5.2 },
  yearly: { totalRevenue: 45087960, totalOrders: 796, growthRate: 45.8 },
};

const DemoMetricsKPIs = () => {
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const salesMetrics = mockSalesMetrics[salesPeriod];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
            Panel de <span className="text-indigo-400">Métricas</span>
          </h2>
          <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-black uppercase rounded-full">
            MODO DEMO
          </span>
        </div>
        <p className="text-slate-400 text-sm">
          Monitorea el rendimiento de tu negocio en tiempo real
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              ${mockDashboardMetrics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">
              {mockDashboardMetrics.totalOrders} órdenes completadas
            </p>
          </div>
        </div>

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
              ${mockDashboardMetrics.averageOrderValue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Por orden</p>
          </div>
        </div>

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
              {mockDashboardMetrics.totalCustomers}
            </p>
            <p className="text-xs text-slate-400">Usuarios registrados</p>
          </div>
        </div>

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
              {mockDashboardMetrics.totalProducts}
            </p>
            <p className="text-xs text-slate-400">En catálogo activo</p>
          </div>
        </div>
      </div>

      {/* Sales Metrics by Period - OPTIMIZADO PARA MOBILE */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Ventas por Período
          </h3>
          {/* Botones optimizados para mobile */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSalesPeriod(period)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                  salesPeriod === period
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {period === 'daily' ? 'Hoy' : period === 'weekly' ? 'Sem' : period === 'monthly' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">
              Revenue
            </p>
            <p className="text-2xl font-black text-white">
              ${salesMetrics.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">
              Órdenes
            </p>
            <p className="text-2xl font-black text-white">
              {salesMetrics.totalOrders}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black flex items-center gap-2">
              Crecimiento
              {salesMetrics.growthRate >= 0 ? (
                <TrendingUp className="text-emerald-400" size={16} />
              ) : (
                <TrendingUp className="text-red-400 rotate-180" size={16} />
              )}
            </p>
            <p
              className={`text-2xl font-black ${
                salesMetrics.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {salesMetrics.growthRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
        <p className="text-yellow-400 text-xs text-center font-bold">
          📊 Estás viendo datos de demostración. Activa el modo real para ver tus métricas actuales.
        </p>
      </div>
    </div>
  );
};

export default DemoMetricsKPIs;