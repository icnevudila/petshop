
import { supabase } from '../supabaseClient';
import { Campaign } from '../types';

/**
 * Get all campaigns
 */
export async function getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }

    return data || [];
}

/**
 * Add a campaign
 */
export async function addCampaign(campaign: Campaign): Promise<void> {
    const { error } = await supabase
        .from('campaigns')
        .insert({
            id: campaign.id,
            title: campaign.title,
            image_url: campaign.image_url,
            target_url: campaign.target_url,
            location: campaign.location,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            target_category_id: campaign.target_category_id,
            is_active: true
        });

    if (error) {
        console.error('Error adding campaign:', error);
        throw error;
    }
}

/**
 * Update a campaign
 */
export async function updateCampaign(campaign: Campaign): Promise<void> {
    const { error } = await supabase
        .from('campaigns')
        .update({
            title: campaign.title,
            image_url: campaign.image_url,
            target_url: campaign.target_url,
            location: campaign.location,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            target_category_id: campaign.target_category_id
        })
        .eq('id', campaign.id);

    if (error) {
        console.error('Error updating campaign:', error);
        throw error;
    }
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting campaign:', error);
        throw error;
    }
}
