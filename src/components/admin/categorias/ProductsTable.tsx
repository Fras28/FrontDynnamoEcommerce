import { useMemo, useState } from 'react';
import { Edit3, Trash2, Tag, DollarSign, RefreshCw } from 'lucide-react';
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
import { useDeleteProduct, useRestoreProduct } from '@/hooks/useProducts'; // ✅ Hook para reactivar incluido
import { Product } from '@/types';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  showInactive?: boolean; // ✅ Agrega esta línea para que TypeScript no de error
}

const ProductsTable = ({ products, onEdit, showInactive = false }: ProductsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const deleteProduct = useDeleteProduct();
  const restoreProduct = useRestoreProduct(); 

  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  // Manejador para Reactivar productos desde la pestaña de Inactivos
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
          ¿Estás seguro de eliminar <span className="text-white font-bold">"{product.name}"</span>?
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
        accessorKey: 'imageUrl',
        header: 'Vista',
        cell: (info) => {
          const url = info.getValue() as string;
          const fallback = 'https://placehold.co/100x100/1e293b/4f46e5?text=No+Img';
          return (
            <div className={`w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center ${showInactive ? 'grayscale opacity-50' : ''}`}>
              <img 
                src={url || fallback} 
                className="w-full h-full object-cover" 
                onError={(e) => (e.currentTarget.src = fallback)}
              />
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
            <span className="text-[10px] text-slate-500 font-bold truncate max-w-[150px]">
              {info.row.original.description || 'SIN DESCRIPCIÓN'}
            </span>
          </div>
        ),
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
        id: 'actions',
        cell: (info) => (
          <div className="flex gap-2 justify-end">
            {showInactive ? (
              // ✅ Botón de reactivación naranja para inactivos
              <button 
                onClick={() => handleRestore(info.row.original)} 
                className="p-2 bg-orange-500/10 hover:bg-orange-600 rounded-xl text-orange-500 hover:text-white transition-all group"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            ) : (
              // Botones normales para activos
              <>
                <button onClick={() => onEdit(info.row.original)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-xl text-slate-400 hover:text-white transition-colors">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(info.row.original)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-xl text-slate-400 hover:text-white transition-colors">
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
                  className={cell.column.id === 'imageUrl' ? '' : cell.column.id === 'actions' ? 'ml-auto' : 'flex-1 min-w-0'}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-800 rounded-3xl">
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