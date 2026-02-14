import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Palette, Edit3, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { Color } from '@/types';
import { useCreateColor, useUpdateColor } from '@/hooks/Usesizesandcolors';


// Schema de validación
const colorSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  hexCode: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Formato inválido (#RRGGBB)')
    .optional()
    .or(z.literal('')),
});

type ColorFormData = z.infer<typeof colorSchema>;

interface ColorFormProps {
  editingColor: Color | null;
  onCancel: () => void;
}

const ColorForm = ({ editingColor, onCancel }: ColorFormProps) => {
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const [selectedColor, setSelectedColor] = useState('#000000');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ColorFormData>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: '',
      hexCode: '',
    },
  });

  const hexCode = watch('hexCode');

  useEffect(() => {
    if (editingColor) {
      reset({
        name: editingColor.name,
        hexCode: editingColor.hexCode || '',
      });
      setSelectedColor(editingColor.hexCode || '#000000');
    } else {
      reset({
        name: '',
        hexCode: '',
      });
      setSelectedColor('#000000');
    }
  }, [editingColor, reset]);

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    setValue('hexCode', color, { shouldValidate: true });
  };

  const onSubmit = async (data: ColorFormData) => {
    try {
      const payload = {
        name: data.name,
        hexCode: data.hexCode || undefined,
      };

      if (editingColor) {
        await updateColor.mutateAsync({
          id: editingColor.id,
          data: payload,
        });
      } else {
        await createColor.mutateAsync(payload);
      }
      reset();
      onCancel();
    } catch (error) {
      console.error('Error al guardar color:', error);
    }
  };

  const isLoading = createColor.isPending || updateColor.isPending;

  // Colores predefinidos comunes
  const presetColors = [
    { name: 'Negro', hex: '#000000' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Rojo', hex: '#EF4444' },
    { name: 'Azul', hex: '#3B82F6' },
    { name: 'Verde', hex: '#22C55E' },
    { name: 'Amarillo', hex: '#FBBF24' },
    { name: 'Rosa', hex: '#EC4899' },
    { name: 'Morado', hex: '#A855F7' },
    { name: 'Naranja', hex: '#F97316' },
    { name: 'Gris', hex: '#6B7280' },
    { name: 'Beige', hex: '#D4A574' },
    { name: 'Celeste', hex: '#38BDF8' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-0">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {editingColor ? (
              <Edit3 className="text-purple-500" size={24} />
            ) : (
              <Palette className="text-purple-500" size={24} />
            )}
            <h2 className="text-lg sm:text-xl font-black text-white">
              {editingColor ? 'Editar Color' : 'Nuevo Color'}
            </h2>
          </div>
          {editingColor && (
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
              Nombre del Color *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ej: Rojo, Azul Marino..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {errors.name && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Código Hexadecimal */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
              Código Hexadecimal (Opcional)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  {...register('hexCode')}
                  placeholder="#000000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono"
                />
                {hexCode && (
                  <div 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded border-2 border-slate-600"
                    style={{ backgroundColor: hexCode }}
                  />
                )}
              </div>
              <div className="relative">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorPickerChange}
                  className="w-12 h-10 rounded-lg cursor-pointer border-2 border-slate-700 bg-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Formato: #RRGGBB (ejemplo: #FF5733)
            </p>
            {errors.hexCode && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} />
                {errors.hexCode.message}
              </p>
            )}
          </div>

          {/* Colores predefinidos */}
          {!editingColor && (
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
              <p className="text-xs font-bold text-purple-400 mb-3">Colores comunes:</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      reset({ name: preset.name, hexCode: preset.hex });
                      setSelectedColor(preset.hex);
                    }}
                    className="group relative h-12 rounded-lg border-2 border-slate-700 hover:border-purple-500 transition-all overflow-hidden"
                    style={{ backgroundColor: preset.hex }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {preset.name}
                      </span>
                    </div>
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
                  {editingColor ? 'Actualizar' : 'Crear Color'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorForm;