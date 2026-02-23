export const generateProductSchema = (product: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map((img: any) => img.url) || [],
    "description": product.description,
    "sku": `ALQ-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Alquimystic"
    },
    "category": product.category?.name,
    "offers": {
      "@type": "Offer",
      "url": `https://alquimystic.com.ar/productos/${product.id}-${product.name.toLowerCase().replace(/\s+/g, '-')}`,
      "priceCurrency": "ARS",
      "price": product.price.toString(),
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Alquimystic"
      }
    },
    "aggregateRating": product.reviews ? {
      "@type": "AggregateRating",
      "ratingValue": product.averageRating || "4.8",
      "reviewCount": product.reviewCount || "127"
    } : undefined
  });
  
  export const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Alquimystic",
    "alternateName": "Alquimystic Fermentos & Fungis",
    "url": "https://alquimystic.com.ar",
    "logo": "https://alquimystic.com.ar/assets/alquemystic.jpg",
    "description": "Especialistas en hongos adaptógenos medicinales. Reishi, Ashwagandha, Cordyceps, Melena de León y más. Bienestar natural respaldado por ciencia.",
    "sameAs": [
      "https://instagram.com/alquimystic",
      "https://facebook.com/alquimystic"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Ventas",
      "areaServed": "AR",
      "availableLanguage": "Spanish"
    }
  });
  
  export const generateFAQSchema = (faqs: Array<{q: string, a: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  });