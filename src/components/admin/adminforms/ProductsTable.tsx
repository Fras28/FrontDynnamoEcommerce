import { useMemo, useState } from 'react';
import { Edit3, Trash2, Tag, DollarSign, RefreshCw, Package } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';

import { modals } from '@mantine/modals';
import { useDeleteProduct, useRestoreProduct } from '@/hooks/useProducts';
import { Product } from '@/types';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  showInactive?: boolean;
}

const ProductsTable = ({ products, onEdit, showInactive = false }: ProductsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const deleteProduct = useDeleteProduct();
  const restoreProduct = useRestoreProduct(); 

  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  const handleRestore = (product: Product) => {
    modals.openConfirmModal({
      title: <span className="font-black uppercase italic text-emerald-500">Reactivar Producto</span>,
      children: (
        <p className="text-sm text-slate-400">
          ¿Deseas volver a activar <span className="text-white font-bold">"{product.name}"</span>? 
          Volverá a estar visible en el catálogo principal.
        </p>
      ),
      labels: { confirm: 'ACTIVAR', cancel: 'CANCELAR' },
      confirmProps: { color: 'teal' },
      onConfirm: () => restoreProduct.mutate(product.id),
    });
  };

  const handleDelete = (product: Product) => {
    modals.openConfirmModal({
      title: <span className="font-black uppercase italic text-red-500">Eliminar Producto</span>,
      children: (
        <p className="text-sm text-slate-400">
          ¿Estás seguro de eliminar <span className="text-red-500 font-bold">"{product.name}"</span>?
        </p>
      ),
      labels: { confirm: 'ELIMINAR', cancel: 'CANCELAR' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProduct.mutate(product.id),
    });
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'images',
        header: 'Vista',
        cell: (info) => {
          const product = info.row.original;
          // ✅ CORREGIDO: Obtener la primera imagen del array
          const primaryImage = product.images?.[0]?.url;
          const fallback = 'https://placehold.co/100x100/1e293b/4f46e5?text=No+Img';
          
          return (
            <div className={`relative w-14 h-14 rounded-xl bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center group ${showInactive ? 'grayscale opacity-50' : ''}`}>
              {primaryImage ? (
                <img 
                  src={primaryImage} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                  onError={(e) => (e.currentTarget.src = fallback)}
                  alt={product.name}
                />
              ) : (
                <Package size={20} className="text-slate-600" />
              )}
              {/* Badge de cantidad de imágenes */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-1 right-1 bg-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  +{product.images.length - 1}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Producto',
        cell: (info) => (
          <div className="flex flex-col">
            <span className={`font-black italic uppercase text-sm ${showInactive ? 'text-slate-500 line-through' : 'text-white'}`}>
              {info.getValue() as string}
            </span>
            <span className="text-[10px] text-slate-500 font-bold truncate max-w-[200px]">
              {info.row.original.description || 'SIN DESCRIPCIÓN'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Categoría',
        cell: (info) => {
          const category = info.getValue() as Product['category'];
          return category ? (
            <div className="flex items-center gap-2">
              <Tag size={12} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-400">{category.name}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-600">Sin categoría</span>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        cell: (info) => (
          <div className={`flex items-center font-black ${showInactive ? 'text-slate-600' : 'text-indigo-400'}`}>
            <DollarSign size={12} />
            <span>{Number(info.getValue()).toLocaleString('es-AR')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue() as number;
          const isLowStock = stock > 0 && stock <= 5;
          const isOutOfStock = stock === 0;
          
          return (
            <div className="flex items-center gap-2">
              <span className={`font-black text-sm ${
                isOutOfStock ? 'text-red-500' : 
                isLowStock ? 'text-amber-500' : 
                'text-emerald-500'
              }`}>
                {stock}
              </span>
              {isLowStock && !isOutOfStock && (
                <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                  BAJO
                </span>
              )}
              {isOutOfStock && (
                <span className="text-[8px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">
                  AGOTADO
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: 'actions',
        cell: (info) => (
          <div className="flex gap-2 justify-end">
            {showInactive ? (
              <button 
                onClick={() => handleRestore(info.row.original)} 
                className="p-2 bg-orange-500/10 hover:bg-orange-600 rounded-xl text-orange-500 hover:text-white transition-all group"
                title="Reactivar producto"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onEdit(info.row.original)} 
                  className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-xl text-slate-400 hover:text-white transition-colors"
                  title="Editar producto"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(info.row.original)} 
                  className="p-2 bg-slate-800 hover:bg-red-600 rounded-xl text-slate-400 hover:text-white transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [onEdit, showInactive, deleteProduct, restoreProduct]
  );

  const table = useReactTable({
    data: safeProducts,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={showInactive ? "BUSCAR EN ARCHIVADOS..." : "BUSCAR PRODUCTO..."}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <div 
              key={row.id} 
              className={`bg-slate-900 border border-slate-800 p-4 rounded-2xl transition-all flex items-center gap-4 ${
                showInactive ? 'opacity-75 hover:opacity-100 border-orange-500/10' : 'hover:border-slate-600'
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <div 
                  key={cell.id} 
                  className={
                    cell.column.id === 'images' ? '' : 
                    cell.column.id === 'actions' ? 'ml-auto' : 
                    'flex-1 min-w-0'
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-800 rounded-3xl">
            <Package size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">
              No se encontraron resultados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTable;