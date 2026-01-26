import { useMemo, useState } from 'react';
import { Edit3, Trash2, Tag, Package } from 'lucide-react';
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
import { Category } from '@/types';
import { useDeleteCategory } from '@/hooks/useCategories';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

const CategoriesTable = ({ categories, onEdit }: CategoriesTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const deleteCategory = useDeleteCategory();

  const safeCategories = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);

  const handleDelete = (category: Category) => {
    modals.openConfirmModal({
      title: <span className="font-black uppercase italic text-red-500">Eliminar Categoría</span>,
      children: (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            ¿Estás seguro de eliminar <span className="text-white font-bold">"{category.name}"</span>?
          </p>
          {category._count && category._count.products > 0 && (
            <p className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              ⚠️ Esta categoría tiene {category._count.products} producto(s) asociado(s). No podrás eliminarla.
            </p>
          )}
        </div>
      ),
      labels: { confirm: 'ELIMINAR', cancel: 'CANCELAR' },
      confirmProps: { 
        color: 'red',
        disabled: category._count ? category._count.products > 0 : false
      },
      onConfirm: () => deleteCategory.mutate(category.id),
    });
  };

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Categoría',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Tag className="text-purple-400" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black italic uppercase text-sm">{info.getValue() as string}</span>
              <span className="text-[10px] text-slate-500 font-bold truncate max-w-[200px]">
                {info.row.original.description || 'SIN DESCRIPCIÓN'}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: '_count.products',
        header: 'Productos',
        cell: (info) => {
          const count = info.row.original._count?.products || 0;
          return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              count === 0 
                ? 'bg-slate-500/10 border-slate-500/20 text-slate-500' 
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
            }`}>
              <Package size={12} />
              <span className="text-[10px] font-black">{count} ITEMS</span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        cell: (info) => (
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => onEdit(info.row.original)} 
              className="p-2 bg-slate-800 hover:bg-purple-600 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => handleDelete(info.row.original)} 
              className="p-2 bg-slate-800 hover:bg-red-600 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [onEdit]
  );

  const table = useReactTable({
    data: safeCategories,
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
          placeholder="BUSCAR CATEGORÍA..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {table.getRowModel().rows.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] italic">
              No hay categorías registradas
            </p>
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-slate-600 transition-all flex items-center gap-4">
              {row.getVisibleCells().map((cell) => (
                <div 
                  key={cell.id} 
                  className={
                    cell.column.id === 'name' ? 'flex-1 min-w-0' : 
                    cell.column.id === 'actions' ? 'ml-auto' : 
                    ''
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesTable;