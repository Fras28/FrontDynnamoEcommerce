import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Edit3, Save, X, Loader2 } from 'lucide-react';
import { categorySchema, CategoryFormData } from '../../../schemas/category';
import { useCreateCategory, useUpdateCategory } from '../../../hooks/useCategories';
import { Category } from '../../../types';

interface CategoryFormProps {
  editingCategory: Category | null;
  onCancel: () => void;
}

const CategoryForm = ({ editingCategory, onCancel }: CategoryFormProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        description: editingCategory.description || '',
      });
    }
  }, [editingCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        data,
      });
    } else {
      await createCategory.mutateAsync(data);
    }
    reset();
    onCancel();
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl transition-all ${
        editingCategory ? 'border-t-4 border-t-purple-500' : 'border-t-4 border-t-emerald-500'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          {editingCategory ? (
            <Edit3 className="text-purple-400" />
          ) : (
            <Tag className="text-emerald-400" />
          )}
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>
        {editingCategory && (
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
            Nombre de la Categoría
          </label>
          <input
            {...register('name')}
            placeholder="Ej: Electrónica"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500 text-black"
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
            placeholder="Describe esta categoría..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none text-black"
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-black text-slate-950 transition-all flex justify-center items-center gap-2 ${
            editingCategory
              ? 'bg-purple-500 hover:bg-purple-400 shadow-lg shadow-purple-500/20'
              : 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : editingCategory ? (
            <>
              <Save size={18} /> ACTUALIZAR
            </>
          ) : (
            'GUARDAR CATEGORÍA'
          )}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
