# PatiDükkan - Profesyonel Pet Shop E-Ticaret Platformu

PatiDükkan, evcil dostlarınız için en kaliteli ürünleri sunan modern bir e-ticaret platformudur. Bu proje, hem perakende (B2C) hem de toptan (B2B) satış süreçlerini yönetebilen kapsamlı bir e-ticaret çözümüdür.

## Özellikler

### 🛒 B2C (Perakende Müşteri)

* **Gelişmiş Ürün Vitrini:** Kategori, marka ve fiyata göre detaylı filtreleme ve arama.
* **Hızlı Alışveriş:** Hızlı sepet yönetimi ve kolay ödeme süreci.
* **Ürün Detay:** Birlikte alınanlar önerileri, stok takibi ve kampanya etiketleri.
* **Müşteri Paneli:** Sipariş geçmişi, favoriler ve profil yönetimi.

### 🏢 B2B (Bayi Portalı)

* **Bayi Özel Fiyatlandırma:** Her bayiye özel tanımlanan iskonto oranları ile dinamik fiyat hesaplama.
* **Sipariş Takibi:** Toptan sipariş oluşturma, durum takibi ve geçmiş siparişleri görüntüleme.
* **Stok Entegrasyonu:** Sipariş onaylandığında otomatik stok düşümü.
* **Duyarlı Tasarım:** Mobil uyumlu bayi paneli ve hızlı sipariş formu.

### ⚙️ Yönetim Paneli (Admin)

* **Dashboard:** Toplam ciro, sipariş sayıları ve son aktivitelerin anlık takibi.
* **Sipariş Yönetimi:** B2C ve B2B siparişlerini onaylama, kargolama ve iptal etme.
* **Bayi Yönetimi:** Bayi başvurularını inceleme, onaylama ve iskonto oranı belirleme.
* **Dinamik Ayarlar:** Site logosu, iletişim bilgileri ve sosyal medya linklerini panelden güncelleme.

## Teknolojiler

* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide React Icons
* **Veritabanı & Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
* **State Management:** React Context API

## Kurulum

Projeyi yerel ortamda çalıştırmak için:

1. Repoyu klonlayın:

    ```bash
    git clone https://github.com/kullaniciadi/petshop.git
    cd petshop
    ```

2. Bağımlılıkları yükleyin:

    ```bash
    npm install
    ```

3. Çevresel Değişkenleri Ayarlayın:
    `.env` dosyasını oluşturun ve Supabase URL/Key bilgilerinizi ekleyin:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4. Uygulamayı başlatın:

    ```bash
    npm run dev
    ```

## Dağıtım (Deployment)

Proje Vercel, Netlify veya herhangi bir statik site sunucusu üzerinde çalışmaya hazırdır.

1. Build alın:

    ```bash
    npm run build
    ```

2. `dist` klasöründeki dosyaları sunucunuza yükleyin.

## Proje Yapısı

* `/pages`: Uygulama sayfaları (Home, Admin, B2B, Cart vb.)
* `/components`: Yeniden kullanılabilir UI bileşenleri
* `/services`: API ve veritabanı işlemlerini yöneten servisler
* `/context`: Global state yönetimi (Auth, Cart, Product)
* `/types`: TypeScript tip tanımları
