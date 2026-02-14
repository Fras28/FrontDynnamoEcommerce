import { useMemo, useState } from 'react';
import { Edit3, Trash2, Ruler, RefreshCw, Package } from 'lucide-react';
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
import { Size } from '@/types';
import { useDeleteSize, useRestoreSize } from '@/hooks/Usesizesandcolors';


interface SizesTableProps {
  sizes: Size[];
  onEdit: (size: Size) => void;
  showInactive?: boolean;
}

const SizesTable = ({ sizes, onEdit, showInactive = false }: SizesTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const deleteSize = useDeleteSize();
  const restoreSize = useRestoreSize();

  const safeSizes = useMemo(() => (Array.isArray(sizes) ? sizes : []), [sizes]);

  const handleRestore = (size: Size) => {
    modals.openConfirmModal({
      title: <span className="font-black uppercase italic text-emerald-500">Reactivar Talle</span>,
      children: (
        <p className="text-sm text-slate-400">
          ¿Deseas volver a activar el talle <span className="text-white font-bold">"{size.name}"</span>? 
          Volverá a estar disponible para productos.
        </p>
      ),
      labels: { confirm: 'ACTIVAR', cancel: 'CANCELAR' },
      confirmProps: { color: 'teal' },
      onConfirm: () => restoreSize.mutate(size.id),
    });
  };

  const handleDelete = (size: Size) => {
    modals.openConfirmModal({
      title: <span className="font-black uppercase italic text-red-500">Eliminar Talle</span>,
      children: (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            ¿Estás seguro de eliminar el talle <span className="text-red-500 font-bold">"{size.name}"</span>?
          </p>
          {size._count && size._count.variants > 0 && (
            <p className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              ⚠️ Este talle tiene {size._count.variants} variante(s) asociada(s). Se desactivará en lugar de eliminarse.
            </p>
          )}
        </div>
      ),
      labels: { confirm: 'ELIMINAR', cancel: 'CANCELAR' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteSize.mutate(size.id),
    });
  };

  const columns = useMemo<ColumnDef<Size>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Talle',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${showInactive ? 'bg-slate-700/30' : 'bg-indigo-500/10'} border ${showInactive ? 'border-slate-700' : 'border-indigo-500/20'} flex items-center justify-center`}>
              <Ruler className={showInactive ? 'text-slate-600' : 'text-indigo-400'} size={18} />
            </div>
            <div className="flex flex-col">
              <span className={`font-black italic uppercase text-sm ${showInactive ? 'text-slate-500 line-through' : 'text-white'}`}>
                {info.getValue() as string}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                Orden: {info.row.original.order}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: '_count.variants',
        header: 'Variantes',
        cell: (info) => {
          const count = info.row.original._count?.variants || 0;
          return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              count === 0 
                ? 'bg-slate-500/10 border-slate-500/20 text-slate-500' 
                : showInactive
                ? 'bg-slate-700/30 border-slate-700 text-slate-600'
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
            {showInactive ? (
              <button 
                onClick={() => handleRestore(info.row.original)} 
                className="p-2 bg-orange-500/10 hover:bg-orange-600 rounded-xl text-orange-500 hover:text-white transition-all group"
                title="Reactivar talle"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onEdit(info.row.original)} 
                  className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-xl text-slate-400 hover:text-white transition-colors"
                  title="Editar talle"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(info.row.original)} 
                  className="p-2 bg-slate-800 hover:bg-red-600 rounded-xl text-slate-400 hover:text-white transition-colors"
                  title="Eliminar talle"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [onEdit, showInactive]
  );

  const table = useReactTable({
    data: safeSizes,
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
        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={showInactive ? "BUSCAR EN INACTIVOS..." : "BUSCAR TALLE..."}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {table.getRowModel().rows.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
            <Ruler size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">
              {showInactive ? 'No hay talles inactivos' : 'No se encontraron talles'}
            </p>
          </div>
        ) : (
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

export default SizesTable;