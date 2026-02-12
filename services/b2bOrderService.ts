import { supabase } from '../supabaseClient';
import { DealerOrder, DealerOrderItem, DealerOrderStatus } from '../types';
import { NotificationService } from './notificationService';
import { getDealerById } from './dealerService';

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
    // 0. Validate Dealer and Min Order Amount
    const dealer = await getDealerById(dealerId);
    if (!dealer) throw new Error('Bayi bulunamadı');

    const totalPrice = items.reduce(
        (sum, item) => sum + item.discounted_unit_price * item.quantity,
        0
    );

    if (dealer.min_order_amount > 0 && totalPrice < dealer.min_order_amount) {
        throw new Error(`Minimum sipariş tutarı ₺${dealer.min_order_amount.toLocaleString('tr-TR')} olmalıdır.`);
    }

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

    // 3. Notify
    try {
        // Need dealer's email. Since dealers -> profiles relation exists on user_id
        const { data: dealerData } = await supabase
            .from('dealers')
            .select('*, profile:profiles(email)')
            .eq('id', dealerId)
            .single();

        const email = (dealerData as any)?.profile?.email;
        if (email) {
            await NotificationService.sendOrderCreatedEmail(
                order.id,
                dealerData.company_name,
                totalPrice,
                email
            );
        }
    } catch (e) {
        console.error('Failed to send notification:', e);
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
        .select(`
            *,
            dealer:dealers(
                *,
                profile:profiles(email)
            )
        `)
        .single();

    if (error) {
        console.error('Error updating dealer order status:', error);
        throw error;
    }

    // Notify
    try {
        const dealer = (data as any)?.dealer;
        const email = dealer?.profile?.email;
        if (email && dealer) {
            await NotificationService.sendOrderStatusChangedEmail(
                data.id,
                dealer.company_name,
                email,
                status
            );
        }
    } catch (e) {
        console.error('Failed to send notification:', e);
    }

    return data as DealerOrder;
}
