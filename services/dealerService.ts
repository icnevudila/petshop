import { supabase } from '../supabaseClient';
import { Dealer, DealerStatus } from '../types';

/**
 * Bayi başvurusu oluştur
 */
export async function applyAsDealer(userId: string, data: {
    company_name: string;
    tax_number: string;
    tax_office: string;
    company_address: string;
    company_phone: string;
    city: string;
    district: string;
}) {
    const { data: dealer, error } = await supabase
        .from('dealers')
        .insert({
            user_id: userId,
            ...data,
            status: 'pending'
        })
        .select()
        .single();

    if (error) {
        console.error('Error applying as dealer:', error);
        throw error;
    }

    return dealer as Dealer;
}

/**
 * Bayi profilini getir (user_id ile)
 */
export async function getDealerByUserId(userId: string): Promise<Dealer | null> {
    const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error getting dealer:', error);
        throw error;
    }

    return data as Dealer;
}

/**
 * Bayi profilini getir (dealer id ile)
 */
export async function getDealerById(dealerId: string): Promise<Dealer | null> {
    const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .eq('id', dealerId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error getting dealer:', error);
        throw error;
    }

    return data as Dealer;
}

/**
 * Bayi profilini güncelle
 */
export async function updateDealerProfile(dealerId: string, updates: Partial<Dealer>) {
    const { data, error } = await supabase
        .from('dealers')
        .update(updates)
        .eq('id', dealerId)
        .select()
        .single();

    if (error) {
        console.error('Error updating dealer:', error);
        throw error;
    }

    return data as Dealer;
}

/**
 * Admin: Tüm bayileri getir
 */
export async function getAllDealers(): Promise<Dealer[]> {
    const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error getting all dealers:', error);
        throw error;
    }

    return (data || []) as Dealer[];
}

/**
 * Admin: Bayi durumunu güncelle
 */
export async function updateDealerStatus(dealerId: string, status: DealerStatus, notes?: string) {
    const updates: any = { status };
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
        .from('dealers')
        .update(updates)
        .eq('id', dealerId)
        .select()
        .single();

    if (error) {
        console.error('Error updating dealer status:', error);
        throw error;
    }

    return data as Dealer;
}

/**
 * Admin: Bayi iskonto oranını güncelle
 */
export async function updateDealerDiscount(dealerId: string, discountRate: number, minOrderAmount?: number) {
    const updates: any = { discount_rate: discountRate };
    if (minOrderAmount !== undefined) updates.min_order_amount = minOrderAmount;

    const { data, error } = await supabase
        .from('dealers')
        .update(updates)
        .eq('id', dealerId)
        .select()
        .single();

    if (error) {
        console.error('Error updating dealer discount:', error);
        throw error;
    }

    return data as Dealer;
}
