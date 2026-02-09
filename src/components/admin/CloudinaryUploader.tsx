// src/components/admin/categorias/CloudinaryUploader.tsx
import { useState, ChangeEvent, useRef } from 'react';
import { Loader2, Image as ImageIcon, Camera, Upload, RotateCcw } from 'lucide-react';

interface CloudinaryUploaderProps {
  onImageUploaded: (imageUrl: string | null) => void;
  onMultipleImagesUploaded?: (imageUrls: string[]) => void;
}

const CloudinaryUploader = ({ onImageUploaded, onMultipleImagesUploaded }: CloudinaryUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUD_NAME = 'dqdfpqwl4';
  const UPLOAD_PRESET = 'products_preset';

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await response.json();
    return data.secure_url || null;
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const filesArray = Array.from(files);
      setUploadProgress({ current: 0, total: filesArray.length });

      // Si hay múltiples archivos y existe el callback
      if (filesArray.length > 1 && onMultipleImagesUploaded) {
        const uploadedUrls: string[] = [];

        for (let i = 0; i < filesArray.length; i++) {
          setUploadProgress({ current: i + 1, total: filesArray.length });
          const url = await uploadSingleFile(filesArray[i]);
          if (url) {
            uploadedUrls.push(url);
          }
        }

        onMultipleImagesUploaded(uploadedUrls);
      } else {
        // Subida individual (comportamiento original)
        const url = await uploadSingleFile(filesArray[0]);
        if (url) {
          onImageUploaded(url);
        }
      }
    } catch (err) {
      setError('Error al conectar con Cloudinary');
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      // Limpiamos el input para poder subir los mismos archivos si se desea
      e.target.value = '';
    }
  };

  // ✅ Iniciar cámara
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Usar cámara trasera por defecto
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Esperar a que el video esté listo
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      console.error(err);
    }
  };

  // ✅ Detener cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // ✅ Capturar foto
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Ajustar canvas al tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujar frame actual del video en el canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir canvas a blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      setUploading(true);
      stopCamera();
      
      try {
        // Crear archivo desde el blob
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Subir a Cloudinary
        const url = await uploadSingleFile(file);
        if (url) {
          onImageUploaded(url);
        }
      } catch (err) {
        setError('Error al subir la foto capturada');
        console.error(err);
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  // ✅ Cambiar entre cámara frontal y trasera
  const switchCamera = async () => {
    if (!stream) return;
    
    const currentFacingMode = stream.getVideoTracks()[0].getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    stopCamera();
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: newFacingMode } 
      });
      
      setStream(mediaStream);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      setError('No se pudo cambiar la cámara');
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {showCamera ? (
        // ✅ VISTA DE CÁMARA
        <div className="relative w-full rounded-2xl overflow-hidden bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            className="w-full h-[400px] object-cover"
          />
          
          {/* Canvas oculto para captura */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Controles de cámara */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="flex items-center justify-center gap-4">
              {/* Botón cancelar */}
              <button
                type="button"
                onClick={stopCamera}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                CANCELAR
              </button>
              
              {/* Botón capturar (grande y central) */}
              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 bg-white hover:bg-slate-200 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
              >
                <div className="w-14 h-14 border-4 border-slate-900 rounded-full" />
              </button>
              
              {/* Botón cambiar cámara */}
              <button
                type="button"
                onClick={switchCamera}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
              >
                <RotateCcw size={18} />
                GIRAR
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ✅ VISTA DE UPLOAD NORMAL
        <div className="space-y-3">
          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-3">
            {/* Botón de cámara */}
            <button
              type="button"
              onClick={startCamera}
              disabled={uploading}
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group bg-slate-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-8 h-8 mb-2 text-slate-600 group-hover:text-indigo-500 transition-colors" />
              <p className="text-xs text-slate-400">
                <span className="text-indigo-400 font-bold">Abrir cámara</span>
              </p>
              <p className="text-[10px] text-slate-600 mt-1">
                Captura directa
              </p>
            </button>

            {/* Botón de archivos */}
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group bg-slate-950/50">
              <div className="flex flex-col items-center justify-center">
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 mb-2 text-indigo-500 animate-spin" />
                    <p className="text-xs text-slate-400 font-medium">
                      Subiendo {uploadProgress.current} de {uploadProgress.total}...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-xs text-slate-400">
                      <span className="text-indigo-400 font-bold">Subir archivos</span>
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      Selección múltiple
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-red-400 text-xs font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;