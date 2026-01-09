import { supabase } from '../supabaseClient';
import { Order, CartEntry } from '../types';

export interface CreateOrderData {
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    notes?: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
    }[];
    totalPrice: number;
}

export interface OrderWithItems extends Order {
    items: {
        id: string;
        product_id: string;
        product_name: string;
        quantity: number;
        unit_price: number;
    }[];
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData): Promise<string> {
    // Start a transaction by creating the order first
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: data.userId || null,
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            customer_phone: data.customerPhone,
            shipping_address: data.shippingAddress,
            notes: data.notes,
            total_price: data.totalPrice,
            status: 'Hazırlanıyor'
        })
        .select()
        .single();

    if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
    }

    // Insert order items
    const orderItems = data.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback order
        await supabase.from('orders').delete().eq('id', order.id);
        throw itemsError;
    }

    // Update product stock
    for (const item of data.items) {
        try {
            await supabase.rpc('decrement_stock', {
                p_product_id: item.productId,
                p_quantity: item.quantity
            });
        } catch {
            // If RPC doesn't exist, just continue
            console.warn('Stock decrement RPC not available');
        }
    }

    return order.id;
}

/**
 * Get orders for a user
 */
export async function getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }

    return (data || []).map(order => ({
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        total_price: parseFloat(order.total_price),
        status: order.status,
        address_info: order.shipping_address,
        created_at: order.created_at
    }));
}

/**
 * Get order by ID with items
 */
export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (orderError) {
        if (orderError.code === 'PGRST116') return null;
        console.error('Error fetching order:', orderError);
        throw orderError;
    }

    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

    if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        throw itemsError;
    }

    return {
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        total_price: parseFloat(order.total_price),
        status: order.status,
        address_info: order.shipping_address,
        created_at: order.created_at,
        items: (items || []).map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price)
        }))
    };
}

/**
 * Track order by ID (public endpoint)
 */
export async function trackOrder(orderId: string, email: string): Promise<OrderWithItems | null> {
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_email', email)
        .single();

    if (orderError) {
        if (orderError.code === 'PGRST116') return null;
        console.error('Error tracking order:', orderError);
        throw orderError;
    }

    const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

    return {
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        total_price: parseFloat(order.total_price),
        status: order.status,
        address_info: order.shipping_address,
        created_at: order.created_at,
        items: (items || []).map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price)
        }))
    };
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

/**
 * Get all orders (admin)
 */
export async function getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }

    return (data || []).map(order => ({
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        total_price: parseFloat(order.total_price),
        status: order.status,
        address_info: order.shipping_address,
        created_at: order.created_at
    }));
}
