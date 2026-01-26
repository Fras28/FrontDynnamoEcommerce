import { z } from 'zod';
import { Role } from '../types';

// Schema para Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Schema para Register (incluye phone y address)
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: z
    .string()
    .min(8, 'El teléfono debe tener al menos 8 caracteres')
    .regex(/^[0-9+\s-]+$/, 'El teléfono solo puede contener números, +, espacios y guiones'),
  address: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
  role: z
    .nativeEnum(Role)
    .optional()
    .default(Role.USER),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;