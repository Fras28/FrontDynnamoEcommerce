import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, UserPlus, Loader2, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '../../schemas/auth';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import { notifications } from '@mantine/notifications';
import { Role } from '../../types';

const AuthForm = () => {
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
    defaultValues: {
      email: '',
      password: '',
      ...(view === 'register' && { role: Role.USER }),
    },
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setLoading(true);
    try {
      const response = view === 'login' 
        ? await authApi.login(data as LoginFormData)
        : await authApi.register(data as RegisterFormData);

      if (response.access_token) {
        setAuth(response.access_token);
        notifications.show({
          title: '¡Bienvenido!',
          message: view === 'login' ? 'Sesión iniciada correctamente' : 'Cuenta creada exitosamente',
          color: 'green',
        });
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Error en la autenticación',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const switchView = () => {
    setView(view === 'login' ? 'register' : 'login');
    reset();
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
          {view === 'login' ? (
            <LogIn className="text-white w-8 h-8" />
          ) : (
            <UserPlus className="text-white w-8 h-8" />
          )}
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {view === 'login' ? 'BIENVENIDO' : 'ÚNETE AHORA'}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {view === 'login'
            ? 'Ingresa tus credenciales para continuar'
            : 'Completa los datos para registrarte'}
        </p>
      </div>

      <div className="flex p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
        <button
          onClick={() => view !== 'login' && switchView()}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            view === 'login'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          LOGIN
        </button>
        <button
          onClick={() => view !== 'register' && switchView()}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            view === 'register'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          REGISTRO
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            {...register('email')}
            type="email"
            placeholder="Email corporativo"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña segura"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.password.message}</p>
          )}
        </div>

        {view === 'register' && (
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <select
              {...register('role' as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-black appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={Role.USER}>ROL: USUARIO CLIENTE</option>
              <option value={Role.ADMIN}>ROL: ADMINISTRADOR</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center shadow-lg shadow-indigo-500/20 active:scale-95 mt-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : view === 'login' ? (
            'ACCEDER AL SISTEMA'
          ) : (
            'CREAR MI PERFIL'
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;