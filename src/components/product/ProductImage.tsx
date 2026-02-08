import { useState, ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  priority?: boolean; // Si es true, no hace lazy loading (para imágenes críticas)
  aspectRatio?: 'square' | 'video' | 'auto'; // Aspect ratio del contenedor
  showPlaceholder?: boolean; // Mostrar placeholder mientras carga
  onImageLoad?: () => void;
  onImageError?: () => void;
}

/**
 * Componente optimizado para imágenes de productos
 * - Lazy loading nativo
 * - Placeholder mientras carga
 * - Manejo de errores
 * - Aspect ratio para evitar layout shift
 * - Optimizado para mobile
 */
const ProductImage = ({
  src,
  alt,
  priority = false,
  aspectRatio = 'square',
  showPlaceholder = true,
  className = '',
  onImageLoad,
  onImageError,
  ...props
}: ProductImageProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc] = useState(src);

  const handleLoad = () => {
    setImageState('loaded');
    onImageLoad?.();
  };

  const handleError = () => {
    setImageState('error');
    onImageError?.();
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {/* Placeholder mientras carga */}
      {showPlaceholder && imageState === 'loading' && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-slate-700 border-t-slate-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Imagen con error */}
      {imageState === 'error' && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center border border-slate-700">
          <div className="text-center px-4">
            <ImageOff size={24} className="sm:w-8 sm:h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-600 text-[10px] sm:text-xs font-bold">Imagen no disponible</p>
          </div>
        </div>
      )}

      {/* Imagen real */}
      <img
        src={imageSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'} // ✅ Lazy loading nativo
        decoding="async" // ✅ Decodificación asíncrona
        fetchPriority={priority ? 'high' : 'auto'} // ✅ Prioridad de fetch
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export default ProductImage;