
// src/config/storeTheme.ts
// ─────────────────────────────────────────────────────────────────────────────
// UN SOLO LUGAR para definir los colores de cada store.
// Cambiá aquí y se refleja en ProductDetail, RelatedProducts, ProductCard, etc.
// ─────────────────────────────────────────────────────────────────────────────

export type StoreTheme = {
    pageBg: string;
    cardBg: string;
    cardBorder: string;
    cardBorderHover: string;
    cardShadowHover: string;
    primary: string;
    primaryHover: string;
    buttonGradient: string;
    buttonGradientHover: string;
    accent: string;
    categoryBadge: string;
    variantHover: string;
    thumbnailActive: string;
    spinnerTrack: string;
    spinnerHead: string;
    shareHover: string;
    relatedTagColor: string;
    relatedNameHover: string;
    relatedPrice: string;
    relatedAddBtn: string;
    ring: string;
  };
  
  const themes: Record<string, StoreTheme> = {
  
    // 🔴 Gregories
    gregories: {
      pageBg:              'bg-stone-950',
      cardBg:              'bg-stone-900',
      cardBorder:          'border-stone-800',
      cardBorderHover:     'hover:border-red-500/50',
      cardShadowHover:     'hover:shadow-red-500/10',
      primary:             'bg-red-600',
      primaryHover:        'hover:bg-red-500',
      buttonGradient:      'from-red-600 to-rose-700',
      buttonGradientHover: 'hover:from-red-500 hover:to-rose-600',
      accent:              'text-red-400',
      categoryBadge:       'text-red-400',
      variantHover:        'hover:border-red-500',
      thumbnailActive:     'border-red-500',
      spinnerTrack:        'border-red-500/20',
      spinnerHead:         'border-t-red-500',
      shareHover:          'hover:border-red-500 hover:text-red-500',
      relatedTagColor:     'text-red-500',
      relatedNameHover:    'group-hover/card:text-red-400',
      relatedPrice:        'text-red-400',
      relatedAddBtn:       'bg-red-600 text-white',
      ring:                'focus:ring-red-500',
    },
  
    // 🟫 Lookarround
    lookarround: {
      pageBg:              'bg-stone-950',
      cardBg:              'bg-stone-900',
      cardBorder:          'border-stone-700',
      cardBorderHover:     'hover:border-amber-600/50',
      cardShadowHover:     'hover:shadow-amber-500/10',
      primary:             'bg-amber-700',
      primaryHover:        'hover:bg-amber-600',
      buttonGradient:      'from-amber-700 to-yellow-700',
      buttonGradientHover: 'hover:from-amber-600 hover:to-yellow-600',
      accent:              'text-amber-500',
      categoryBadge:       'text-amber-400',
      variantHover:        'hover:border-amber-500',
      thumbnailActive:     'border-amber-500',
      spinnerTrack:        'border-amber-500/20',
      spinnerHead:         'border-t-amber-500',
      shareHover:          'hover:border-amber-500 hover:text-amber-500',
      relatedTagColor:     'text-amber-500',
      relatedNameHover:    'group-hover/card:text-amber-400',
      relatedPrice:        'text-amber-400',
      relatedAddBtn:       'bg-amber-700 text-white',
      ring:                'focus:ring-amber-500',
    },
  
    // 🟣 Alquemystic
    alquemystic: {
      pageBg:              'bg-slate-950',
      cardBg:              'bg-slate-900',
      cardBorder:          'border-purple-900/50',
      cardBorderHover:     'hover:border-purple-500/50',
      cardShadowHover:     'hover:shadow-purple-500/10',
      primary:             'bg-purple-600',
      primaryHover:        'hover:bg-purple-500',
      buttonGradient:      'from-purple-600 to-violet-700',
      buttonGradientHover: 'hover:from-purple-500 hover:to-violet-600',
      accent:              'text-purple-400',
      categoryBadge:       'text-purple-400',
      variantHover:        'hover:border-purple-500',
      thumbnailActive:     'border-purple-500',
      spinnerTrack:        'border-purple-500/20',
      spinnerHead:         'border-t-purple-500',
      shareHover:          'hover:border-purple-500 hover:text-purple-500',
      relatedTagColor:     'text-purple-500',
      relatedNameHover:    'group-hover/card:text-purple-400',
      relatedPrice:        'text-purple-400',
      relatedAddBtn:       'bg-purple-600 text-white',
      ring:                'focus:ring-purple-500',
    },
  };
  
  /**
   * Retorna el tema del store activo.
   * Lee VITE_STORE_SLUG del .env de cada deploy.
   *
   * .env  →  VITE_STORE_SLUG=lookarround | gregories | alquemystic
   */
  export const getTheme = (): StoreTheme => {
    const slug = (import.meta.env.VITE_STORE_SLUG as string) || 'lookarround';
    return themes[slug] ?? themes['lookarround'];
  };
  
  export default themes;