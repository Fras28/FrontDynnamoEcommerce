import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Edit3, Save, X, Loader2, AlertCircle } from 'lucide-react';
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
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [editingCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
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
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;

  // Ejemplos comunes de categorías
  const presetCategories = [
    { name: 'Electrónica', description: 'Dispositivos y gadgets tecnológicos' },
    { name: 'Ropa', description: 'Indumentaria y textiles' },
    { name: 'Deportes', description: 'Equipamiento deportivo y fitness' },
    { name: 'Hogar', description: 'Decoración y muebles' },
    { name: 'Libros', description: 'Literatura y material educativo' },
    { name: 'Juguetes', description: 'Entretenimiento infantil' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-0">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {editingCategory ? (
              <Edit3 className="text-purple-500" size={24} />
            ) : (
              <Tag className="text-purple-500" size={24} />
            )}
            <h2 className="text-lg sm:text-xl font-black text-white">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
          </div>
          {editingCategory && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ej: Electrónica, Ropa, Deportes..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {errors.name && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
              Descripción (Opcional)
            </label>
            <textarea
              {...register('description')}
              placeholder="Describe esta categoría..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all h-24 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Breve descripción para identificar mejor esta categoría
            </p>
            {errors.description && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Ejemplos comunes */}
          {/* {!editingCategory && (
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
              <p className="text-xs font-bold text-purple-400 mb-2">Categorías comunes:</p>
              <div className="grid grid-cols-2 gap-2">
                {presetCategories.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => reset({ 
                      name: preset.name, 
                      description: preset.description 
                    })}
                    className="group relative p-3 bg-slate-800 hover:bg-purple-600 rounded-lg transition-all text-left"
                  >
                    <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-500 group-hover:text-purple-200 transition-colors mt-0.5 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold text-sm uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingCategory ? 'Actualizar' : 'Crear Categoría'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;