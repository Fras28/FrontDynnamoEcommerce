import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PackagePlus, Edit3, Save, X, Loader2, Tag, Trash2,
  Image as ImageIcon, GripVertical, Star, Plus,
  Palette, Ruler, Package, AlertCircle, Info, Boxes,
} from 'lucide-react';
import { Product } from '@/types';
import CloudinaryUploader from '../CloudinaryUploader';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { z } from 'zod';
import { useColors, useSizes } from '@/hooks/Usesizesandcolors';

// ── Schema ──────────────────────────────────────────────────────────

const variantSchema = z
  .object({
    sizeId: z.number().optional(),
    colorId: z.number().optional(),
    stock: z.number().min(0, 'El stock no puede ser negativo'),
    sku: z.string().max(50).optional(),
  })
  .refine((data) => data.sizeId !== undefined || data.colorId !== undefined, {
    message: 'Cada variante debe tener al menos un talle o un color',
  });

const productSchema = z
  .object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    description: z.string().optional(),
    price: z.number().positive('El precio debe ser mayor a 0'),
    stock: z.number().min(0, 'El stock no puede ser negativo'),
    images: z.array(z.string().url()).min(1, 'Debe haber al menos una imagen'),
    categoryId: z.number().optional(),
    hasVariants: z.boolean().default(false),
    variants: z.array(variantSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.hasVariants && (!data.variants || data.variants.length === 0)) return false;
      return true;
    },
    { message: 'Si el producto tiene variantes, debe especificar al menos una', path: ['variants'] },
  );

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  editingProduct: Product | null;
  onCancel: () => void;
}

// Clases reutilizables para inputs/selects sobre fondo oscuro
const inputClass =
  'w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all';
const selectClass =
  'w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all';

const ProductForm = ({ editingProduct, onCancel }: ProductFormProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: sizes, isLoading: loadingSizes } = useSizes();
  const { data: colors, isLoading: loadingColors } = useColors();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      categoryId: undefined,
      hasVariants: false,
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  const currentImages = watch('images') || [];
  const hasVariants = watch('hasVariants');

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: Number(editingProduct.price),
        stock: editingProduct.stock,
        images: editingProduct.images?.map((img) => img.url) || [],
        categoryId: editingProduct.categoryId || undefined,
        hasVariants: editingProduct.hasVariants || false,
        variants: [],
      });
    } else {
      reset({ name: '', description: '', price: 0, stock: 0, images: [], categoryId: undefined, hasVariants: false, variants: [] });
    }
  }, [editingProduct, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        // Al editar no se mandan variantes por este form (se gestionan aparte)
        const { hasVariants: _, variants: __, ...updateData } = data;
        await updateProduct.mutateAsync({ id: editingProduct.id, data: updateData });
      } else {
        await createProduct.mutateAsync(data);
      }
      onCancel();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // ── Imagen helpers ─────────────────────────────────────────────

  const handleImageUploaded = (url: string | null) => {
    if (url) setValue('images', [...currentImages, url], { shouldValidate: true });
  };

  const handleMultipleImagesUploaded = (urls: string[]) => {
    if (urls.length > 0) setValue('images', [...currentImages, ...urls], { shouldValidate: true });
  };

  const removeImage = (i: number) =>
    setValue('images', currentImages.filter((_, idx) => idx !== i), { shouldValidate: true });

  const setPrimaryImage = (i: number) => {
    if (i === 0) return;
    const imgs = [...currentImages];
    const [primary] = imgs.splice(i, 1);
    imgs.unshift(primary);
    setValue('images', imgs, { shouldValidate: true });
  };

  const handleDragStart = (i: number) => setDraggedIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === i) return;
    const imgs = [...currentImages];
    const [moved] = imgs.splice(draggedIndex, 1);
    imgs.splice(i, 0, moved);
    setValue('images', imgs, { shouldValidate: true });
    setDraggedIndex(i);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const handleAddVariant = () => append({ sizeId: undefined, colorId: undefined, stock: 0, sku: '' });

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {editingProduct ? (
            <Edit3 className="text-purple-500" size={24} />
          ) : (
            <PackagePlus className="text-indigo-500" size={24} />
          )}
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Información básica ───────────────────────────────── */}
        <div className="bg-slate-900/50 border-t border-l border-r border-slate-800 rounded-t-xl p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
            <Package size={14} className="text-indigo-500" />
            Información Básica
          </h3>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nombre del Producto *</label>
            <input type="text" {...register('name')} placeholder="Ej: Remera Oversize" className={inputClass} />
            {errors.name && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Descripción</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Descripción del producto..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Precio + Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Precio *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`${inputClass} pl-8`}
                />
              </div>
              {errors.price && (
                <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                  <AlertCircle size={12} /> {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                <Tag size={12} className="inline mr-1" />
                Categoría
              </label>
              <select
                {...register('categoryId', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                className={selectClass}
                disabled={loadingCategories}
              >
                <option value="">Sin categoría</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Toggle variantes (solo en creación) ─────────────── */}
        {!editingProduct && (
          <div className="bg-slate-900/50 border-l border-r border-slate-800 p-4 sm:p-5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('hasVariants')}
                className="w-5 h-5 mt-0.5 bg-slate-900 border-2 border-slate-700 rounded checked:bg-purple-600 checked:border-purple-600 cursor-pointer transition-all focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Boxes size={16} className="text-purple-500" />
                  <span className="text-sm font-black text-white">Este producto tiene variantes (talles/colores)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Activa esta opción si el producto está disponible en diferentes talles o colores.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* ── Stock simple (solo sin variantes) ───────────────── */}
        {!hasVariants && (
          <div className="bg-slate-900/50 border-l border-r border-slate-800 p-4 sm:p-5">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Stock Disponible *</label>
            <input type="number" {...register('stock', { valueAsNumber: true })} placeholder="0" className={inputClass} />
            {errors.stock && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} /> {errors.stock.message}
              </p>
            )}
          </div>
        )}

        {/* ── Sección de variantes ─────────────────────────────── */}
        {hasVariants && !editingProduct && (
          <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-l-2 border-r-2 border-purple-800/50 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-purple-300 uppercase flex items-center gap-2">
                <Boxes size={14} className="text-purple-400" />
                Variantes del Producto
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Plus size={14} /> Agregar
              </button>
            </div>

            <div className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3">
              <p className="text-xs text-purple-200 leading-relaxed flex items-start gap-2">
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                Cada variante representa una combinación única de talle y/o color con su propio stock.
              </p>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Variante #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Talle */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                        <Ruler size={12} className="inline mr-1" /> Talle
                      </label>
                      <select
                        {...register(`variants.${index}.sizeId`, {
                          setValueAs: (v) => (v === '' ? undefined : Number(v)),
                        })}
                        className={selectClass}
                        disabled={loadingSizes}
                      >
                        <option value="">Sin talle</option>
                        {sizes?.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                        <Palette size={12} className="inline mr-1" /> Color
                      </label>
                      <select
                        {...register(`variants.${index}.colorId`, {
                          setValueAs: (v) => (v === '' ? undefined : Number(v)),
                        })}
                        className={selectClass}
                        disabled={loadingColors}
                      >
                        <option value="">Sin color</option>
                        {colors?.map((color) => (
                          <option key={color.id} value={color.id}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Stock</label>
                      <input
                        type="number"
                        {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">SKU (Opcional)</label>
                      <input
                        type="text"
                        {...register(`variants.${index}.sku`)}
                        placeholder="SKU123"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {errors.variants?.[index] && (
                    <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.variants[index]?.message || 'Debe tener talle o color'}
                    </p>
                  )}
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Boxes size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay variantes agregadas</p>
                  <p className="text-xs mt-1">Haz clic en "Agregar" para crear una</p>
                </div>
              )}
            </div>

            {errors.variants && typeof errors.variants === 'object' && 'message' in errors.variants && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                <AlertCircle size={12} /> {errors.variants.message as string}
              </p>
            )}
          </div>
        )}

        {/* ── Imágenes ─────────────────────────────────────────── */}
        <div className="bg-slate-900/50 border border-t-0 border-slate-800 rounded-b-xl p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
            <ImageIcon size={14} className="text-pink-500" />
            Imágenes del Producto *
          </h3>

          <CloudinaryUploader
            onImageUploaded={handleImageUploaded}
            onMultipleImagesUploaded={handleMultipleImagesUploaded}
          />

          {errors.images && (
            <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
              <AlertCircle size={12} /> {errors.images.message}
            </p>
          )}

          {currentImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentImages.map((url, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                    index === 0
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                      : 'border-slate-700 hover:border-slate-600'
                  } ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  <img src={url} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-md flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[9px] font-black">PRINCIPAL</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>

                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="absolute bottom-2 left-2 right-2 bg-white/90 hover:bg-white text-slate-900 py-1.5 rounded-md font-bold text-[10px] transition-colors"
                      >
                        Hacer Principal
                      </button>
                    )}

                    <div className="absolute bottom-2 left-2 bg-black/60 text-white p-1 rounded-md">
                      <GripVertical size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Botones de acción ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 p-4 -mx-4 sm:-mx-6 rounded-b-xl mt-1">
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
                <Loader2 size={16} className="animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save size={16} /> {editingProduct ? 'Actualizar' : 'Crear Producto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;