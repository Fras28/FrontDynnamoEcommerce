import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2, Mail,
  Lock, Eye, EyeOff, Phone, MapPin
} from 'lucide-react';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '../../schemas/auth';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import { notifications } from '@mantine/notifications';
import { Role } from '../../types';
import Logo from "../../assets/FungiLovers.png"
import { NavLink } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(view === 'login' ? loginSchema : registerSchema),
    defaultValues: view === 'login'
      ? {
        email: '',
        password: '',
      }
      : {
        email: '',
        password: '',
        phone: '',
        address: '',
        role: Role.USER,
      },
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setLoading(true);
    try {
      const response = view === 'login'
        ? await authApi.login(data as LoginFormData)
        : await authApi.register(data as RegisterFormData);

      if (view === 'login') {
        // Login exitoso
        setAuth({
          user: response.user,
          token: response.access_token
        });

        notifications.show({
          title: 'Bienvenido',
          message: 'Sesión iniciada correctamente',
          color: 'indigo',
        });
      } else {
        // Registro exitoso - Mostrar notificación especial
        notifications.show({
          title: '📧 ¡Registro Exitoso!',
          message: (
            <div className="space-y-2">
              <p className="font-semibold">¡Tu cuenta ha sido creada!</p>
              <p className="text-sm">
                Te hemos enviado un correo electrónico a{' '}
                <span className="font-bold text-indigo-600">{(data as RegisterFormData).email}</span>
              </p>
              <p className="text-sm">
                Por favor, revisa tu bandeja de entrada y confirma tu cuenta haciendo clic en el enlace de verificación.
              </p>
              <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-xs text-yellow-800 font-semibold">
                  ⚠️ Importante: Si no recibes el correo en los próximos minutos:
                </p>
                <ul className="text-xs text-yellow-700 mt-1 ml-4 list-disc space-y-1">
                  <li>Revisa tu carpeta de <strong>Spam</strong> o <strong>Correo no deseado</strong></li>
                  <li>Verifica que el email sea correcto</li>
                  <li>Agrega nuestro email a tus contactos para futuros envíos</li>
                </ul>
              </div>
            </div>
          ),
          color: 'green',
          autoClose: 12000, // Se cierra automáticamente después de 12 segundos
          withCloseButton: true,
        });

        // Cambiar automáticamente a la vista de login después de mostrar la notificación
        setTimeout(() => {
          setView('login');
          reset({
            email: (data as RegisterFormData).email, // Pre-llenar el email
            password: '',
          });
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error al procesar la solicitud';
      const errorStatus = error.response?.status;

      // Manejo específico de errores para el login
      if (view === 'login') {
        // Usuario no verificado
        if (errorMessage.toLowerCase().includes('verific') || 
            errorMessage.toLowerCase().includes('confirm') ||
            errorMessage.toLowerCase().includes('activar') ||
            errorStatus === 403) {
          notifications.show({
            title: '⚠️ Cuenta no verificada',
            message: (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Tu cuenta aún no ha sido verificada</p>
                <p className="text-sm">
                  Revisa tu correo electrónico y haz clic en el enlace de verificación que te enviamos.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Si no encuentras el correo, revisa tu carpeta de <strong>Spam</strong>.
                </p>
                <p className="text-xs text-gray-600">
                  ¿No recibiste el correo? Contáctanos para reenviarlo.
                </p>
              </div>
            ),
            color: 'orange',
            autoClose: 10000,
            withCloseButton: true,
          });
        }
        // Usuario no registrado
        else if (errorMessage.toLowerCase().includes('no encontrado') || 
                 errorMessage.toLowerCase().includes('not found') ||
                 errorMessage.toLowerCase().includes('no existe') ||
                 errorStatus === 404) {
          notifications.show({
            title: '❌ Usuario no encontrado',
            message: (
              <div className="space-y-2">
                <p className="text-sm font-semibold">No existe una cuenta con este correo electrónico</p>
                <p className="text-sm">
                  ¿Aún no tienes cuenta? Regístrate haciendo clic en el enlace de abajo.
                </p>
              </div>
            ),
            color: 'red',
            autoClose: 8000,
            withCloseButton: true,
          });
        }
        // Contraseña incorrecta u otros errores
        else {
          notifications.show({
            title: 'Error de autenticación',
            message: errorMessage,
            color: 'red',
          });
        }
      } else {
        // Errores en el registro
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = () => {
    const newView = view === 'login' ? 'register' : 'login';
    setView(newView);

    // Resetear con los valores por defecto correctos según la vista
    reset(newView === 'login'
      ? {
        email: '',
        password: '',
      }
      : {
        email: '',
        password: '',
        phone: '',
        address: '',
        role: Role.USER,
      }
    );
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 bg-cover bg-center bg-no-repeat"
    >
      <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-2">
          <NavLink to="/">
            <img src={Logo} alt="logo" className='m-auto w-36 md:w-40' />
          </NavLink>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            {view === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
          </h2>
          <p className="text-white text-xs font-bold uppercase tracking-widest">
            {view === 'login' ? 'Ingresa tus credenciales' : 'Completa tus datos de envío'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              {...register('email')}
              type="email"
              placeholder="EMAIL@EJEMPLO.COM"
              className="w-full bg-white border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold"
            />
            {errors.email && <p className="text-red-400 text-[10px] mt-1 ml-2">{errors.email.message as string}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="CONTRASEÑA"
              className="w-full bg-white border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-400 text-[10px] mt-1 ml-2">{errors.password.message as string}</p>}
          </div>

          {view === 'register' && (
            <>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  {...register('phone')}
                  type="text"
                  placeholder="TELÉFONO (WSP) - Ej: +54 9 11 1234-5678"
                  className="w-full bg-white border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold"
                />
                {(errors as any).phone && (
                  <p className="text-red-400 text-[10px] mt-1 ml-2">
                    {(errors as any).phone?.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  {...register('address')}
                  type="text"
                  placeholder="DIRECCIÓN DE ENVÍO - Ej: Av. Corrientes 1234, CABA"
                  className="w-full bg-white border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold"
                />
                {(errors as any).address && (
                  <p className="text-red-400 text-[10px] mt-1 ml-2">
                    {(errors as any).address?.message}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center shadow-lg shadow-indigo-500/20 active:scale-95 mt-4 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="pt-6 border-t border-slate-800 text-center">
          <button
            onClick={handleViewChange}
            className="text-white hover:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors italic"
          >
            {view === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;