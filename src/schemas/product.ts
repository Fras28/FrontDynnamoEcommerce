import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  price: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor a 0')
    .min(0.01, 'El precio mínimo es 0.01'),
  stock: z
    .number({ invalid_type_error: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  categoryId: z.number().int().positive().optional(), 
  // ✅ CORREGIDO: Array de URLs para múltiples imágenes
  images: z
    .array(z.string().url('Cada imagen debe ser una URL válida'))
    .min(1, 'Debes subir al menos una imagen')
    .max(10, 'Máximo 10 imágenes permitidas'),
});

export type ProductFormData = z.infer<typeof productSchema>;