/**
 * Utilidad para generar slugs SEO-friendly
 */

/**
 * Convierte un texto en un slug URL-friendly
 * Ejemplo: "Laptop Gaming ROG" -> "laptop-gaming-rog"
 */
export const generateSlug = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      // Reemplazar caracteres especiales del español
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .replace(/^-+/, '') // Eliminar guiones al inicio
      .replace(/-+$/, ''); // Eliminar guiones al final
  };
  
  /**
   * Genera URL del producto con slug
   * Formato: /productos/[id]-[slug]
   * Ejemplo: /productos/123-laptop-gaming-rog
   */
  export const generateProductUrl = (id: number, name: string): string => {
    const slug = generateSlug(name);
    return `/productos/${id}-${slug}`;
  };
  
  /**
   * Extrae el ID de una URL de producto con slug
   * Ejemplo: "123-laptop-gaming-rog" -> 123
   */
  export const extractProductId = (slugWithId: string): number | null => {
    const match = slugWithId.match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : null;
  };
  
  /**
   * Genera URL del catálogo con filtro de categoría
   * Formato: /catalogo?categoria=[slug]
   * Ejemplo: /catalogo?categoria=laptops
   */
  export const generateCatalogUrl = (categorySlug?: string): string => {
    if (categorySlug) {
      return `/catalogo?categoria=${generateSlug(categorySlug)}`;
    }
    return '/catalogo';
  };
  
  /**
   * Genera URL de admin con modo de vista
   * Formato: /admin/[seccion]
   * Ejemplo: /admin/inventario
   */
  export const generateAdminUrl = (section?: string): string => {
    if (section) {
      return `/admin/${section}`;
    }
    return '/admin';
  };