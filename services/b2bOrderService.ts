import { supabase } from '../supabaseClient';
import { DealerOrder, DealerOrderItem, DealerOrderStatus } from '../types';

interface CreateOrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    discounted_unit_price: number;
}

/**
 * Toptan sipariş oluştur
 */
export async function createDealerOrder(
    dealerId: string,
    items: CreateOrderItem[],
    shippingAddress: string,
    discountApplied: number,
    notes?: string
): Promise<DealerOrder> {
    const totalPrice = items.reduce(
        (sum, item) => sum + item.discounted_unit_price * item.quantity,
        0
    );

    // 1. Siparişi oluştur
    const { data: order, error: orderError } = await supabase
        .from('dealer_orders')
        .insert({
            dealer_id: dealerId,
            total_price: totalPrice,
            discount_applied: discountApplied,
            shipping_address: shippingAddress,
            notes: notes || null,
            status: 'Beklemede'
        })
        .select()
        .single();

    if (orderError) {
        console.error('Error creating dealer order:', orderError);
        throw orderError;
    }

    // 2. Sipariş kalemlerini oluştur
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discounted_unit_price: item.discounted_unit_price
    }));

    const { error: itemsError } = await supabase
        .from('dealer_order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Error creating dealer order items:', itemsError);
        throw itemsError;
    }

    return order as DealerOrder;
}

/**
 * Bayi siparişlerini getir
 */
export async function getDealerOrders(dealerId: string): Promise<DealerOrder[]> {
    const { data, error } = await supabase
        .from('dealer_orders')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error getting dealer orders:', error);
        throw error;
    }

    return (data || []) as DealerOrder[];
}

/**
 * Sipariş detayını kalemlerle birlikte getir
 */
export async function getDealerOrderDetail(orderId: string): Promise<DealerOrder | null> {
    const { data: order, error: orderError } = await supabase
        .from('dealer_orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (orderError) {
        if (orderError.code === 'PGRST116') return null;
        console.error('Error getting dealer order:', orderError);
        throw orderError;
    }

    const { data: items, error: itemsError } = await supabase
        .from('dealer_order_items')
        .select('*')
        .eq('order_id', orderId);

    if (itemsError) {
        console.error('Error getting dealer order items:', itemsError);
        throw itemsError;
    }

    return { ...order, items: items || [] } as DealerOrder;
}

/**
 * Admin: Tüm toptan siparişleri getir
 */
export async function getAllDealerOrders(): Promise<DealerOrder[]> {
    const { data, error } = await supabase
        .from('dealer_orders')
        .select(`
      *,
      dealer:dealers(*)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error getting all dealer orders:', error);
        throw error;
    }

    return (data || []) as DealerOrder[];
}

/**
 * Admin: Sipariş durumunu güncelle
 */
export async function updateDealerOrderStatus(orderId: string, status: DealerOrderStatus) {
    const { data, error } = await supabase
        .from('dealer_orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

    if (error) {
        console.error('Error updating dealer order status:', error);
        throw error;
    }

    return data as DealerOrder;
}
