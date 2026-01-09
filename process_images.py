"""
Ürün görsellerini işleme scripti
- Hafif renk ayarı yapar
- İnce turuncu saydam border ekler
- Telife takılmamak için ufak değişiklikler
"""

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
import os
import shutil

# Kaynak ve hedef klasörler
SOURCE_FOLDERS = {
    'kopek_mama': [
        r'ürünler\Köpek Ürünleri ve Aksesuarları_ Yüksek Kalite, Geniş Çeşitlilik',
        r'ürünler\Kaliteli ve Eğlenceli Köpek Oyun Ürünleri - Farklı Türlerde Köpek Oyuncakları',
        r'ürünler\Kaliteli ve Uygun Fiyatlı Köpek Bakım Ürünleri _ Geniş Ürün Yelpazesi',
        r'ürünler\Kaliteli ve Şık Köpek Aksesuarları - Geniş Ürün Yelpazesi',
    ],
    'kedi_mama': [
        r'ürünler\Kaliteli ve Sağlıklı Kedi Ürünleri, Oyuncaklar ve Aksesuarlar',
        r'ürünler\Kaliteli ve Sağlıklı Kedi Bakım Ürünleri _ Kedinizin İhtiyaçlarını Karşılayın',
        r'ürünler\Kedi Aksesuarları_ Yüksek Kaliteli ve Şık Ürünler - Kedinizin İhtiyaçları İçin Her Şey',
        r'ürünler\En Eğlenceli ve Eğitici Kedi Oyunları - Sizin ve Evcil Dostunuz İçin Kaliteli Zaman',
    ],
    'akvaryum': [
        r'ürünler\Canlı Renkli Dünyalar_ Akvaryumda Eğlenceli ve Huzurlu Bir Deneyim',
        r'ürünler\Akvaryum Bakımı_ Balıklarınızın Sağlığı ve Mutluluğu İçin İpuçları',
        r'ürünler\Su Altı Dünyasını Keşfetmek İçin İdeal Aksesuarlar - Akvaryum Aksesuarları',
        r'ürünler\Akıllı Tasarım ve Doğal Güzellik İle Evinizi Süsleyin_ En İyi Akvaryum Çeşitleri ve Bakım Önerileri!',
        r'ürünler\Akvaryum Canlıları İçin En İyi Beslenme_ Akvaryum Yemleri ve Besinler',
    ],
    'kemirgen': [
        r'ürünler\Sağlıklı ve Dengeli Bir Diyet İçin Guinea Pig Beslenme Rehberi',
        r'ürünler\En İyi Bakım İpuçlarıyla Guinea Pig\'e Nasıl Sağlık ve Mutluluk Kazandırabilirsiniz_',
        r'ürünler\Keyifli ve Eğlenceli Deneyimlerin Adresi_ Guinea Pig Oyunları!',
        r'ürünler\Sevimli ve Evcil Cüce Kirpiler_ Gine Pig Bakımı, Beslenme ve Sağlık İpuçları',
    ],
}

TARGET_FOLDERS = {
    'kopek_mama': 'products/kopek/mama',
    'kedi_mama': 'products/kedi/mama',
    'akvaryum': 'products/akvaryum/tank',
    'kemirgen': 'products/kemirgen/yem',
}

def process_image(input_path, output_path):
    """
    Görseli işle:
    1. Çok hafif renk/doygunluk ayarı
    2. İnce turuncu saydam border ekle
    """
    try:
        img = Image.open(input_path)
        
        # RGBA'ya çevir (şeffaflık için)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # 1. Çok hafif doygunluk artışı (%1 - neredeyse görünmez)
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.01)
        
        # 2. Çok ince turuncu saydam border ekle (1px, %15 opaklık)
        width, height = img.size
        border_thickness = 1  # Sadece 1 piksel
        
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Turuncu renk, %15 opaklık (255 * 0.15 = 38) - çok belli belirsiz
        orange_transparent = (255, 140, 0, 38)
        
        draw.rectangle(
            [0, 0, width - 1, height - 1],
            outline=orange_transparent
        )
        
        # Overlay'i birleştir
        img = Image.alpha_composite(img, overlay)
        
        # RGB'ye çevir ve kaydet (JPEG için)
        if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
            img = img.convert('RGB')
        
        img.save(output_path, quality=95)
        return True
        
    except Exception as e:
        print(f"Hata: {input_path} - {str(e)}")
        return False

def get_clean_filename(filename):
    """Dosya adını temizle ve kısalt"""
    # Uzantıyı al
    name, ext = os.path.splitext(filename)
    
    # Özel karakterleri temizle
    clean_name = name.replace('_', ' ').replace('  ', ' ').strip()
    
    # Çok uzunsa kısalt
    if len(clean_name) > 50:
        clean_name = clean_name[:50]
    
    # Türkçe karakterleri koru ama dosya sistemi için güvenli yap
    safe_name = clean_name.replace(':', '-').replace('/', '-').replace('\\', '-')
    safe_name = safe_name.replace('"', '').replace("'", '').replace('?', '')
    
    return safe_name + ext

def main():
    base_path = r'c:\Users\TP2\Documents\petshop'
    processed_count = 0
    error_count = 0
    
    for category, source_folders in SOURCE_FOLDERS.items():
        target_folder = os.path.join(base_path, TARGET_FOLDERS[category])
        os.makedirs(target_folder, exist_ok=True)
        
        print(f"\n{'='*50}")
        print(f"Kategori: {category}")
        print(f"Hedef: {target_folder}")
        print(f"{'='*50}")
        
        file_counter = 1
        
        for source_folder in source_folders:
            full_source = os.path.join(base_path, source_folder)
            
            if not os.path.exists(full_source):
                print(f"  ⚠️ Klasör bulunamadı: {source_folder}")
                continue
            
            print(f"\n  📁 İşleniyor: {source_folder[:50]}...")
            
            for filename in os.listdir(full_source):
                # Sadece görsel dosyaları
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    # .opdownload uzantılı dosyaları atla
                    if '.opdownload' in filename:
                        continue
                    
                    input_path = os.path.join(full_source, filename)
                    
                    # Yeni dosya adı oluştur (numaralı)
                    ext = os.path.splitext(filename)[1]
                    new_filename = f"{category}_{file_counter:03d}{ext}"
                    output_path = os.path.join(target_folder, new_filename)
                    
                    if process_image(input_path, output_path):
                        processed_count += 1
                        file_counter += 1
                        
                        # Her 10 dosyada bir progress göster
                        if processed_count % 10 == 0:
                            print(f"    ✅ {processed_count} görsel işlendi...")
                    else:
                        error_count += 1
    
    print(f"\n{'='*50}")
    print(f"✅ TAMAMLANDI!")
    print(f"   İşlenen: {processed_count} görsel")
    print(f"   Hata: {error_count} görsel")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
