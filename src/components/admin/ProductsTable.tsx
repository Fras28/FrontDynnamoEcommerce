import { useMemo } from 'react';
import { Edit3, Trash2, Tag } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Product } from '../../types';
import { useDeleteProduct } from '../../hooks/useProducts';
import { modals } from '@mantine/modals';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const ProductsTable = ({ products, onEdit }: ProductsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const deleteProduct = useDeleteProduct();

  const handleDelete = (product: Product) => {
    modals.openConfirmModal({
      title: 'Eliminar producto',
      children: `¿Estás seguro de eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProduct.mutate(product.id),
    });
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'imageUrl',
        header: '',
        cell: ({ row }) => (
          <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex-shrink-0">
            {row.original.imageUrl ? (
              <img
                src={row.original.imageUrl}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag size={20} className="text-slate-700" />
              </div>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: 'Producto',
        cell: ({ row }) => (
          <div>
            <h4 className="font-bold text-white text-base">{row.original.name}</h4>
            <p className="text-[10px] text-slate-500 font-black">ID: #{row.original.id}</p>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        cell: ({ row }) => (
          <span className="text-base font-black text-white">
            ${Number(row.original.price).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => (
          <span
            className={`text-sm font-bold ${
              row.original.stock < 10 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {row.original.stock} uds.
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Creado',
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(row.original)}
              className="p-2.5 hover:bg-indigo-500/10 text-indigo-400 rounded-xl transition-all"
              title="Editar"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-xl transition-all"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [onEdit]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Filtro de búsqueda */}
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Buscar productos..."
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Tabla */}
      <div className="overflow-y-auto max-h-[600px] pr-2 space-y-3">
        {table.getRowModel().rows.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
            <p className="text-slate-500 text-sm italic">No hay productos que coincidan</p>
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all group shadow-lg"
            >
              <div className="flex items-center gap-4">
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className={
                      cell.column.id === 'imageUrl'
                        ? ''
                        : cell.column.id === 'actions'
                        ? 'ml-auto'
                        : cell.column.id === 'name'
                        ? 'flex-1 min-w-0'
                        : ''
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsTable;