import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

const CloudinaryUploader = ({ currentImage, onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);

  const CLOUD_NAME = 'dqdfpqwl4';
  const UPLOAD_PRESET = 'products_preset'; // Deberás crear este preset en Cloudinary

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('cloud_name', CLOUD_NAME);
      formData.append('folder', 'products'); // Organiza las imágenes en una carpeta

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      
      // URL optimizada de Cloudinary
      const optimizedUrl = data.secure_url.replace('/upload/', '/upload/w_800,h_800,c_fill,q_auto,f_auto/');
      
      setPreview(optimizedUrl);
      onImageUploaded(optimizedUrl);
    } catch (err) {
      console.error('Error uploading:', err);
      setError('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUploaded(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
        Imagen del Producto
      </label>
      
      <div className="relative">
        {preview ? (
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <label className="relative flex flex-col items-center justify-center w-full h-48 bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 mb-3 text-indigo-500 animate-spin" />
                  <p className="text-sm text-slate-400 font-medium">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 mb-3 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                  <p className="mb-2 text-sm text-slate-400 font-medium">
                    <span className="text-indigo-400">Click para subir</span> o arrastra aquí
                  </p>
                  <p className="text-xs text-slate-600">PNG, JPG, WEBP (Máx. 5MB)</p>
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
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      <p className="text-[10px] text-slate-600 ml-2">
        La imagen se subirá a Cloudinary automáticamente
      </p>
    </div>
  );
};

export default CloudinaryUploader;