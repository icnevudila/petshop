
/**
 * Notification Service
 * Simulates sending emails for order confirmations, shipping updates, etc.
 * In production, this would connect to Supabase Edge Functions or EmailJS.
 */

export const sendOrderConfirmation = async (order: any, isB2B: boolean = false) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.groupCollapsed(`📧 [SIMULATION] Email Sent: Sipariş Onayı #${order.id}`);
    console.log('To:', order.customerEmail || order.shipping_address); // B2B might not have direct email in order object sometimes
    console.log('Subject:', isB2B ? `Toptan Sipariş Alındı: #${order.id}` : `Siparişiniz Alındı: #${order.id}`);
    console.log('Body Preview:', `Sayın Müşterimiz, siparişiniz başarıyla alınmıştır. Toplam Tutar: ₺${order.totalPrice || order.total_price}`);
    console.groupEnd();

    return true;
};

export const sendDealerApplicationReceived = async (dealerMap: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    console.groupCollapsed(`📧 [SIMULATION] Email Sent: Yeni Bayi Başvurusu`);
    console.log('To:', 'admin@patidukkan.com');
    console.log('Subject:', 'Yeni Bayi Başvurusu Bekliyor');
    console.log('Body Preview:', `Firma: ${dealerMap.company_name} - Yetkili: ${dealerMap.user_id}`);
    console.groupEnd();

    return true;
};

export const sendShippingUpdate = async (orderId: string, status: string, trackingNumber?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    console.groupCollapsed(`📧 [SIMULATION] Email Sent: Sipariş Durumu Güncellendi`);
    console.log('Order ID:', orderId);
    console.log('New Status:', status);
    if (trackingNumber) console.log('Tracking Number:', trackingNumber);
    console.groupEnd();

    return true;
};
