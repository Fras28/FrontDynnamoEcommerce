// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export const SEO = ({ 
  title, 
  description, 
  image = '/assets/og-image.jpg',
  url = 'https://alquimystic.com.ar',
  type = 'website',
  keywords = 'hongos adaptógenos, hongos medicinales, reishi, ashwagandha, cordyceps, melena de león, bienestar natural, suplementos naturales argentina'
}: SEOProps) => (
  <Helmet>
    <title>{`${title} | Alquimystic - Hongos Adaptógenos`}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    
    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content={type} />
    <meta property="og:locale" content="es_AR" />
    <meta property="og:site_name" content="Alquimystic" />
    
    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    
    {/* IA Optimization */}
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href={url} />
  </Helmet>
);