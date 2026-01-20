import { useState } from 'react';
import { Loader2, BarChart3 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import ProductForm from './ProductForm';
import ProductsTable from './ProductsTable';

interface AdminDashboardProps {
  setGlobalResponse?: (response: { status: number; data: any }) => void;
}

const AdminDashboard = ({ setGlobalResponse }: AdminDashboardProps) => {
  const { data: products, isLoading } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-slate-400 font-medium">Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Formulario de Gestión */}
      <div className="lg:col-span-5">
        <ProductForm editingProduct={editingProduct} onCancel={handleCancelEdit} />
      </div>

      {/* Listado de Inventario */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="font-black flex items-center gap-2 px-2 text-white uppercase tracking-widest text-xs">
          <BarChart3 size={18} className="text-indigo-400" /> Control de Inventario
        </h3>

        <ProductsTable products={products || []} onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default AdminDashboard;