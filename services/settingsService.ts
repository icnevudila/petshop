
import { supabase } from '../supabaseClient';
import { SiteSettings } from '../types';

/**
 * Fetch site settings from Supabase
 * Returns null if no settings found or error
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('id', { ascending: true }) // In case single() fails if multiple rows exist (shouldn't happen with constraints)
        .limit(1)
        .single();

    if (error) {
        // PERMISSION DENIED or table not found might happen if migration not run
        console.error('Error fetching site settings:', error);
        return null;
    }

    if (!data) return null;

    return {
        siteName: data.site_name,
        logoUrl: data.logo_url,
        phone: data.phone,
        email: data.email,
        address: data.address,
        topBarMessage: data.top_bar_message,
        socialLinks: {
            facebook: data.social_facebook,
            instagram: data.social_instagram,
            twitter: data.social_twitter,
            youtube: data.social_youtube
        }
    };
}

/**
 * Update site settings in Supabase
 */
export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
    const { error } = await supabase
        .from('site_settings')
        .update({
            site_name: settings.siteName,
            logo_url: settings.logoUrl,
            phone: settings.phone,
            email: settings.email,
            address: settings.address,
            top_bar_message: settings.topBarMessage,
            social_facebook: settings.socialLinks.facebook,
            social_instagram: settings.socialLinks.instagram,
            social_twitter: settings.socialLinks.twitter,
            social_youtube: settings.socialLinks.youtube
        })
        .eq('id', 1);

    if (error) {
        console.error('Error updating site settings:', error);
        throw error;
    }
}
