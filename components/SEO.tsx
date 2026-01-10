import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    jsonLd?: Record<string, any>;
    image?: string;
    type?: 'website' | 'product' | 'article';
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    jsonLd,
    image = '/logopng.png',
    type = 'website'
}) => {
    const siteTitle = "PatiDükkan | Premium Pet Market";
    const fullTitle = title === siteTitle ? title : `${title} | PatiDükkan`;
    const siteUrl = "https://patidukkan.vercel.app";
    const currentUrl = canonical || siteUrl;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content="PatiDükkan" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
