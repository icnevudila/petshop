
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

// TODO: Replace this with actual email service (Resend, SendGrid, etc.)
// For now, we'll log emails to console to simulate sending.
const sendEmail = async ({ to, subject, html }: EmailOptions) => {
    console.group('📧 [EMAIL SENT]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content (HTML): ${html.substring(0, 100)}...`);
    console.groupEnd();
    return Promise.resolve({ success: true });
};

export const NotificationService = {
    /**
     * Notify admins about new dealer application
     */
    async sendDealerApplicationReceivedEmail(companyName: string, email: string) {
        // In a real app, you would fetch admin emails from DB or config
        const adminEmail = 'admin@patidukkan.com';

        await sendEmail({
            to: adminEmail,
            subject: 'Yeni Bayi Başvurusu: ' + companyName,
            html: `
                <h1>Yeni Bayi Başvurusu</h1>
                <p><strong>Firma:</strong> ${companyName}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p>Lütfen admin panelinden başvuruyu inceleyin.</p>
                <a href="${window.location.origin}/admin?tab=dealers">Admin Paneline Git</a>
            `
        });
    },

    /**
     * Notify dealer about status change (Approved/Rejected)
     */
    async sendDealerApplicationStatusEmail(email: string, companyName: string, status: 'approved' | 'rejected') {
        const isApproved = status === 'approved';
        const subject = isApproved ? 'Bayi Başvurunuz Onaylandı! 🎉' : 'Bayi Başvurunuz Hakkında';

        await sendEmail({
            to: email,
            subject,
            html: `
                <h1>Sayın ${companyName},</h1>
                ${isApproved
                    ? `<p>Bayi başvurunuz <strong>onaylanmıştır</strong>. Artık bayi girişi yapabilir ve özel fiyatlarla sipariş verebilirsiniz.</p>
                       <a href="${window.location.origin}/bayi/giris">Bayi Girişi Yap</a>`
                    : `<p>Bayi başvurunuz yapılan inceleme sonucu maalesef <strong>onaylanamamıştır</strong>.</p>`
                }
                <p>Saygılarımızla,<br>PatiDükkan Ekibi</p>
            `
        });
    },

    /**
     * Notify dealer and admin about new B2B order
     */
    async sendOrderCreatedEmail(orderId: string, companyName: string, totalAmount: number, dealerEmail: string) {
        // 1. Notify Dealer
        await sendEmail({
            to: dealerEmail,
            subject: 'Siparişiniz Alındı - #' + orderId.slice(0, 8),
            html: `
                <h1>Siparişiniz Alındı</h1>
                <p>Sayın ${companyName},</p>
                <p><strong>#${orderId.slice(0, 8)}</strong> numaralı siparişiniz başarıyla oluşturulmuştur.</p>
                <p><strong>Toplam Tutar:</strong> ₺${totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                <p>Siparişiniz incelendikten sonra onaylanacaktır.</p>
                <a href="${window.location.origin}/bayi/siparisler">Sipariş Takibi</a>
            `
        });

        // 2. Notify Admin
        await sendEmail({
            to: 'admin@patidukkan.com',
            subject: 'Yeni Bayi Siparişi - ' + companyName,
            html: `
                <h1>Yeni Bayi Siparişi</h1>
                <p><strong>Bayi:</strong> ${companyName}</p>
                <p><strong>Tutar:</strong> ₺${totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                <a href="${window.location.origin}/admin?tab=dealers">Siparişi İncele</a>
            `
        });
    },

    /**
     * Notify dealer about order status update
     */
    async sendOrderStatusChangedEmail(orderId: string, companyName: string, dealerEmail: string, newStatus: string) {
        await sendEmail({
            to: dealerEmail,
            subject: `Sipariş Durumu Güncellendi: ${newStatus} - #${orderId.slice(0, 8)}`,
            html: `
                <h1>Sipariş Durumu Güncellendi</h1>
                <p>Sayın ${companyName},</p>
                <p><strong>#${orderId.slice(0, 8)}</strong> numaralı siparişinizin durumu <strong>${newStatus}</strong> olarak güncellenmiştir.</p>
                <a href="${window.location.origin}/bayi/siparisler">Sipariş Detayı</a>
            `
        });
    }
};
