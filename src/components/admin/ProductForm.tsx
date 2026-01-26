import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackagePlus, Edit3, Save, X, Loader2 } from 'lucide-react';
import { productSchema, ProductFormData } from '../../schemas/product';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { Product } from '../../types';
import CloudinaryUploader from './CloudinaryUploader';


interface ProductFormProps {
  editingProduct: Product | null;
  onCancel: () => void;
}

const ProductForm = ({ editingProduct, onCancel }: ProductFormProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: '',
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: Number(editingProduct.price),
        stock: editingProduct.stock,
        imageUrl: editingProduct.imageUrl || '',
      });
    }
  }, [editingProduct, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        data,
      });
    } else {
      await createProduct.mutateAsync(data);
    }
    reset();
    onCancel();
  };

  const handleImageUploaded = (url: string | null) => {
    setValue('imageUrl', url || '');
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl transition-all ${
        editingProduct ? 'border-t-4 border-t-indigo-500' : 'border-t-4 border-t-amber-500'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          {editingProduct ? (
            <Edit3 className="text-indigo-400" />
          ) : (
            <PackagePlus className="text-amber-400" />
          )}
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        {editingProduct && (
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Uploader de Imagen */}
        <CloudinaryUploader
          currentImage={imageUrl}
          onImageUploaded={handleImageUploaded}
        />

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
            Nombre
          </label>
          <input
            {...register('name')}
            placeholder="Ej: Monitor 4K"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
            Descripción
          </label>
          <textarea
            {...register('description')}
            placeholder="Detalles técnicos..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none text-black"
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
              Precio ($)
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {errors.price && (
              <p className="text-red-400 text-xs mt-1 ml-2">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
              Stock
            </label>
            <input
              {...register('stock', { valueAsNumber: true })}
              type="number"
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {errors.stock && (
              <p className="text-red-400 text-xs mt-1 ml-2">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-black text-slate-950 transition-all flex justify-center items-center gap-2 ${
            editingProduct
              ? 'bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20'
              : 'bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : editingProduct ? (
            <>
              <Save size={18} /> ACTUALIZAR
            </>
          ) : (
            'GUARDAR PRODUCTO'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;