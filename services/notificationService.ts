
/**
 * Notification Service
 * Simulates sending emails for order confirmations, shipping updates, etc.
 * In production, this would connect to Supabase Edge Functions or EmailJS.
 */

export const sendOrderConfirmation = async (order: any, isB2B: boolean = false) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.groupCollapsed(`📧 [SIMULATION] Email Sent: Sipariş Onayı #${order.id}`);
    console.log('To:', order.customerEmail || order.shipping_address);
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

/**
 * NotificationService class wrapper - provides static methods for dealer service compatibility
 */
export class NotificationService {
    static async sendDealerApplicationReceivedEmail(companyName: string, email: string) {
        return sendDealerApplicationReceived({ company_name: companyName, user_id: email });
    }

    static async sendDealerApplicationStatusEmail(email: string, companyName: string, status: string) {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.groupCollapsed(`📧 [SIMULATION] Email Sent: Bayi Başvuru Durumu`);
        console.log('To:', email);
        console.log('Company:', companyName);
        console.log('Status:', status);
        console.groupEnd();
        return true;
    }

    static async sendOrderConfirmationEmail(order: any, isB2B: boolean = false) {
        return sendOrderConfirmation(order, isB2B);
    }

    static async sendShippingUpdateEmail(orderId: string, status: string, trackingNumber?: string) {
        return sendShippingUpdate(orderId, status, trackingNumber);
    }
}

