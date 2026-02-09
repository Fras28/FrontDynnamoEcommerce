import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackagePlus, Edit3, Save, X, Loader2, Tag, Trash2, Image as ImageIcon, GripVertical, Star } from 'lucide-react';
import { Product } from '../../../types';
import CloudinaryUploader from '../CloudinaryUploader';
import { useCategories } from '@/hooks/useCategories';
import { ProductFormData, productSchema } from '@/schemas/product';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';

interface ProductFormProps {
  editingProduct: Product | null;
  onCancel: () => void;
}

const ProductForm = ({ editingProduct, onCancel }: ProductFormProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
      images: [],
      categoryId: undefined,
    },
  });

  // Suscribirse a los cambios en el array de imágenes
  const currentImages = watch('images') || [];

  // Efecto para cargar datos al editar
  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: Number(editingProduct.price),
        stock: editingProduct.stock,
        // ✅ CORREGIDO: Extraer solo las URLs del array de objetos
        images: editingProduct.images?.map((img) => img.url) || [],
        categoryId: editingProduct.categoryId || undefined,
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        images: [],
        categoryId: undefined,
      });
    }
  }, [editingProduct, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          data: data,
        });
      } else {
        await createProduct.mutateAsync(data);
      }
      onCancel();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // ✅ Función para añadir nueva imagen al array
  const handleImageUploaded = (url: string | null) => {
    if (url) {
      setValue('images', [...currentImages, url], { shouldValidate: true });
    }
  };

  // ✅ Función para añadir múltiples imágenes
  const handleMultipleImagesUploaded = (urls: string[]) => {
    if (urls.length > 0) {
      setValue('images', [...currentImages, ...urls], { shouldValidate: true });
    }
  };

  // ✅ Función para quitar imagen
  const removeImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    setValue('images', updatedImages, { shouldValidate: true });
  };

  // ✅ Función para mover imagen a la primera posición (hacerla principal)
  const setAsPrimary = (index: number) => {
    if (index === 0) return; // Ya es la principal
    const newImages = [...currentImages];
    const [movedImage] = newImages.splice(index, 1);
    newImages.unshift(movedImage);
    setValue('images', newImages, { shouldValidate: true });
  };

  // ✅ Drag & Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...currentImages];
    const draggedImage = newImages[draggedIndex];
    
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    setValue('images', newImages, { shouldValidate: true });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl transition-all ${
      editingProduct ? 'border-t-4 border-t-indigo-500' : 'border-t-4 border-t-amber-500'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          {editingProduct ? <Edit3 className="text-indigo-400" /> : <PackagePlus className="text-amber-400" />}
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* ✅ SECCIÓN DE IMÁGENES MEJORADA CON DRAG & DROP */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest flex items-center gap-2">
            <ImageIcon size={12} />
            Galería de Imágenes ({currentImages.length}/10)
          </label>
          
          {/* ✅ Mostrar uploader solo si no ha alcanzado el límite */}
          {currentImages.length < 10 && (
            <CloudinaryUploader 
              onImageUploaded={handleImageUploaded}
              onMultipleImagesUploaded={handleMultipleImagesUploaded}
            />
          )}
          
          {currentImages.length >= 10 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-amber-500 text-xs font-bold">
                Has alcanzado el límite de 10 imágenes
              </p>
            </div>
          )}
          
          {/* ✅ Previsualización de Galería con Drag & Drop */}
          {currentImages.length > 0 ? (
            <div className="space-y-3">
              {/* Instrucciones */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                <p className="text-indigo-400 text-xs font-bold flex items-center gap-2">
                  <GripVertical size={14} />
                  Arrastra las imágenes para reordenar. La primera será la principal.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {currentImages.map((url, index) => (
                  <div 
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group aspect-square rounded-xl overflow-hidden border-2 bg-black transition-all cursor-move ${
                      index === 0 
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' 
                        : 'border-slate-800 hover:border-indigo-500'
                    } ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                  >
                    {/* Badge de imagen principal */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-indigo-500 text-white text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={10} fill="white" />
                        PRINCIPAL
                      </div>
                    )}
                    
                    {/* Badge de orden */}
                    <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>

                    {/* Icono de drag */}
                    <div className="absolute bottom-2 left-2 z-10 bg-black/70 text-slate-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical size={14} />
                    </div>
                    
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    
                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-end pb-4 gap-2">
                      {/* Botón para establecer como principal (solo si no lo es) */}
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsPrimary(index)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Star size={12} />
                          MARCAR COMO PRINCIPAL
                        </button>
                      )}
                      
                      {/* Botón de eliminar */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={12} />
                        ELIMINAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center">
              <ImageIcon size={32} className="mx-auto text-slate-700 mb-2" />
              <p className="text-slate-600 text-sm font-bold">
                No hay imágenes agregadas
              </p>
              <p className="text-slate-700 text-xs mt-1">
                Sube al menos una imagen del producto
              </p>
            </div>
          )}
          
          {/* Mensaje de error */}
          {errors.images && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-xs font-bold">{errors.images.message}</p>
            </div>
          )}
          
          {/* Ayuda */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
            <p className="text-slate-500 text-[10px] flex items-center gap-2">
              <Star size={10} className="text-indigo-400" />
              La primera imagen será la imagen principal del producto
            </p>
            <p className="text-slate-500 text-[10px] flex items-center gap-2">
              <GripVertical size={10} className="text-indigo-400" />
              Arrastra para reordenar o usa el botón "Marcar como principal"
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
            Nombre del Producto
          </label>
          <input
            {...register('name')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black font-medium"
            placeholder="Ej: Monitor Gamer 27&quot;"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1 ml-2">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
            Descripción
          </label>
          <textarea
            {...register('description')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-28 resize-none text-black font-medium"
            placeholder="Describe las características principales..."
          />
          {errors.description && <p className="text-red-400 text-xs mt-1 ml-2">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest flex items-center gap-2">
              <Tag size={12} /> Categoría
            </label>
            <select
              {...register('categoryId', { setValueAs: (v) => v === "" ? undefined : Number(v) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black font-medium cursor-pointer appearance-none"
              disabled={loadingCategories}
            >
              <option value="">Sin categoría</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
                Precio
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black font-medium"
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
                Stock
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black font-medium"
              />
              {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock.message}</p>}
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl font-black text-slate-400 border border-slate-800 hover:bg-slate-800 transition-all"
          >
            CANCELAR
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-[2] py-4 rounded-2xl font-black text-slate-950 transition-all flex justify-center items-center gap-2 ${
              editingProduct ? 'bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/20' : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
            } shadow-lg disabled:opacity-50`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>{editingProduct ? <Save size={18} /> : <PackagePlus size={18} />} {editingProduct ? 'ACTUALIZAR' : 'GUARDAR PRODUCTO'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;