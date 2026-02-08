// src/components/admin/categorias/CloudinaryUploader.tsx
import { useState, ChangeEvent } from 'react';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  onImageUploaded: (imageUrl: string | null) => void;
}

const CloudinaryUploader = ({ onImageUploaded }: CloudinaryUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CLOUD_NAME = 'dqdfpqwl4';
  const UPLOAD_PRESET = 'products_preset';

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      if (data.secure_url) {
        // Enviamos la URL al formulario padre
        onImageUploaded(data.secure_url);
      }
    } catch (err) {
      setError('Error al conectar con Cloudinary');
    } finally {
      setUploading(false);
      // Limpiamos el input para poder subir el mismo archivo si se desea
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group bg-slate-950/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-2 text-indigo-500 animate-spin" />
                <p className="text-xs text-slate-400 font-medium">Subiendo...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 mb-2 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                <p className="text-xs text-slate-400">
                  <span className="text-indigo-400 font-bold">Subir imagen</span>
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="text-red-400 text-[10px] mt-2 ml-2">{error}</p>}
    </div>
  );
};

export default CloudinaryUploader;