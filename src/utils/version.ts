// src/utils/version.ts

/**
 * Obtiene la versión actual de la aplicación desde package.json
 * Esta información se inyecta en tiempo de build por Vite
 */
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

/**
 * Obtiene el nombre de la aplicación
 */
export const APP_NAME = 'Alquimystic Store';

/**
 * Información completa de la versión
 */
export const VERSION_INFO = {
  version: APP_VERSION,
  name: APP_NAME,
  buildDate: import.meta.env.VITE_BUILD_DATE || new Date().toISOString(),
  environment: import.meta.env.MODE,
};

/**
 * Formatea la versión para mostrar
 */
export const getFormattedVersion = (): string => {
  return `v${APP_VERSION}`;
};

/**
 * Obtiene información completa de versión formateada
 */
export const getVersionDetails = (): string => {
  const env = VERSION_INFO.environment === 'production' ? 'prod' : 'dev';
  return `${getFormattedVersion()} (${env})`;
};