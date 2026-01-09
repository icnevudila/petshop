
import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = 'Türkiye\'nin en güvenilir online pet shop mağazası. Kedi, köpek, kuş, balık mamaları ve aksesuarları aynı gün kargo avantajıyla.',
    image = '/logopng.png',
    url = window.location.href,
    type = 'website'
}) => {
    useEffect(() => {
        // Title güncelleme
        document.title = `${title} | PatiDükkan`;

        // Meta tag güncelleme fonksiyonu
        const updateMeta = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`) ||
                document.querySelector(`meta[property="${name}"]`);

            if (!element) {
                element = document.createElement('meta');
                if (name.startsWith('og:') || name.startsWith('twitter:')) {
                    element.setAttribute('property', name);
                } else {
                    element.setAttribute('name', name);
                }
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Standart Meta Tagler
        updateMeta('description', description);

        // Open Graph / Facebook
        updateMeta('og:type', type);
        updateMeta('og:url', url);
        updateMeta('og:title', title);
        updateMeta('og:description', description);
        updateMeta('og:image', image);

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:url', url);
        updateMeta('twitter:title', title);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', image);

    }, [title, description, image, url, type]);

    return null;
};

export default SEO;
