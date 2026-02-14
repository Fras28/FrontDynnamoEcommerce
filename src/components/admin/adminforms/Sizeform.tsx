import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ruler, Edit3, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { Size } from '@/types';
import { useCreateSize, useUpdateSize } from '@/hooks/Usesizesandcolors';


// Schema de validación
const sizeSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(10, 'Máximo 10 caracteres'),
  order: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo')
    .optional(),
});

type SizeFormData = z.infer<typeof sizeSchema>;

interface SizeFormProps {
  editingSize: Size | null;
  onCancel: () => void;
}

const SizeForm = ({ editingSize, onCancel }: SizeFormProps) => {
  const createSize = useCreateSize();
  const updateSize = useUpdateSize();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      name: '',
      order: 0,
    },
  });

  useEffect(() => {
    if (editingSize) {
      reset({
        name: editingSize.name,
        order: editingSize.order,
      });
    } else {
      reset({
        name: '',
        order: 0,
      });
    }
  }, [editingSize, reset]);

  const onSubmit = async (data: SizeFormData) => {
    try {
      if (editingSize) {
        await updateSize.mutateAsync({
          id: editingSize.id,
          data,
        });
      } else {
        await createSize.mutateAsync(data);
      }
      reset();
      onCancel();
    } catch (error) {
      console.error('Error al guardar talle:', error);
    }
  };

  const isLoading = createSize.isPending || updateSize.isPending;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-0">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {editingSize ? (
              <Edit3 className="text-indigo-500" size={24} />
            ) : (
              <Ruler className="text-indigo-500" size={24} />
            )}
            <h2 className="text-lg sm:text-xl font-black text-white">
              {editingSize ? 'Editar Talle' : 'Nuevo Talle'}
            </h2>
          </div>
          {editingSize && (
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
              Nombre del Talle *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ej: S, M, L, 38, 40..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase"
            />
            {errors.name && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Orden */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
              Orden de Aparición
            </label>
            <input
              type="number"
              {...register('order', { valueAsNumber: true })}
              placeholder="0"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Número que determina el orden de los talles (menor = primero)
            </p>
            {errors.order && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} />
                {errors.order.message}
              </p>
            )}
          </div>

          {/* Ejemplos comunes */}
          {!editingSize && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3">
              <p className="text-xs font-bold text-indigo-400 mb-2">Ejemplos comunes:</p>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42'].map((example, idx) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => reset({ name: example, order: idx })}
                    className="px-2 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-bold rounded transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-bold text-sm uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingSize ? 'Actualizar' : 'Crear Talle'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeForm;