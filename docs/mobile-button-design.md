# Mobil Buton Özelleştirme Planı

## Konsept

Trendyol/Hepsiburada tarzında ama kendimize özgü, premium görünümlü mobil butonlar.

## Önerilen Tasarım Özellikleri

### 1. Alt Navigasyon Butonları

- **Stil**: Yumuşak gradyan arka planlar
- **İkonlar**: Renkli, canlı ikonlar (turuncu/primary renk vurgusu)
- **Hover/Active**: Hafif büyüme animasyonu + glow efekti
- **Badge**: Sepet/favori sayıları için özel tasarım badge'ler

### 2. "Sepete Ekle" Butonları

- **Mobil**: Tam genişlik, gradient arka plan
- **İkon**: Sepet ikonu + ok işareti
- **Animasyon**: Tıklandığında pulse efekti
- **Feedback**: Başarılı ekleme için checkmark animasyonu

### 3. Filtre/Sıralama Butonları

- **Stil**: Outlined style, rounded corners
- **İkon**: Sol tarafta ikon, sağda sayı badge'i
- **Renk**: Primary renk border + hover'da dolu

## Uygulama Adımları

1. ✅ MobileBottomNav'a gradient ve glow efektleri ekle
2. ⏳ ProductCard'daki "Sepete Ekle" butonunu özelleştir
3. ⏳ CategoryPage'deki "Filtrele" butonunu yeniden tasarla
4. ⏳ Micro-animasyonlar ekle (hover, click, success states)

## Renk Paleti

- Primary: #ea580c (turuncu)
- Gradient: linear-gradient(135deg, #ea580c 0%, #fb923c 100%)
- Success: #10b981 (yeşil)
- Background: #ffffff
- Shadow: rgba(234, 88, 12, 0.2)
