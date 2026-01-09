
import { supabase } from '../supabaseClient';

export interface Address {
    id: string;
    title: string;
    full_address: string;
    city: string;
    district: string;
    postal_code: string;
    is_default: boolean;
}

/**
 * Get addresses for a user
 */
export async function getAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }

    return data || [];
}

/**
 * Add a new address
 */
export async function addAddress(userId: string, address: Omit<Address, 'id' | 'is_default'>): Promise<void> {
    const { error } = await supabase
        .from('addresses')
        .insert({
            user_id: userId,
            title: address.title,
            full_address: address.full_address,
            city: address.city,
            district: address.district,
            postal_code: address.postal_code
        });

    if (error) {
        console.error('Error adding address:', error);
        throw error;
    }
}

/**
 * Delete an address
 */
export async function deleteAddress(id: string): Promise<void> {
    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting address:', error);
        throw error;
    }
}

/**
 * Set address as default
 * (First unsets current default, then sets new one)
 */
export async function setDefaultAddress(userId: string, addressId: string): Promise<void> {
    // 1. Unset all
    await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

    // 2. Set new default
    const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

    if (error) {
        console.error('Error setting default address:', error);
        throw error;
    }
}
