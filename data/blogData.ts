
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    featured?: boolean;
    tags: string[];
}

export const BLOG_ARTICLES: BlogPost[] = [
    {
        id: 'yavru-kedi-beslenmesi',
        title: 'Yavru Kedi Beslenmesinde 5 Altın Kural',
        slug: 'yavru-kedi-beslenmesi',
        excerpt: 'Yavru kedinizin sağlıklı büyümesi için dikkat etmeniz gereken beslenme kurallarını, mama seçimini ve porsiyon kontrolünü uzman veteriner görüşleriyle derledik.',
        content: `Yavru kediler, hayatlarının ilk aylarında inanılmaz bir hızla büyürler. Bu dönemde alacakları besinler, bağışıklık sistemlerinden kemik gelişimlerine kadar tüm hayatlarını etkiler. İşte dikkat etmeniz gerekenler:

## 1. Anne Sütü ve Süt Tozu
İlk 4 hafta anne sütü şarttır. Eğer anne yoksa, veteriner onaylı "kitten milk replacer" kullanılmalıdır. Asla inek sütü verilmemelidir, çünkü kediler laktozu sindiremez ve bu ishal gibi ciddi sorunlara yol açabilir.

## 2. Kuru Mamaya Geçiş
4-5. haftalarda ıslatılmış kuru mama ile tanıştırma başlayabilir. Mamayı ılık suyla yumuşatıp püre haline getirerek sunabilirsiniz. 8. haftaya gelindiğinde tamamen kuru mamaya geçmiş olmaları gerekir.

## 3. Protein ve Yağ Oranı
Yavru kedilerin enerji ihtiyacı yetişkinlerden 3 kat fazladır. Bu yüzden seçtiğiniz mamanın protein oranının en az %34, yağ oranının ise %18 civarında olması idealdir. Taurin, DHA ve EPA gibi takviyeler beyin ve göz gelişimi için kritiktir.

## 4. Sık ve Az Beslenme
Yavru kedilerin mideleri küçüktür. Günlük mama miktarını tek seferde değil, günde 4-5 öğüne bölerek vermelisiniz. 6. aydan sonra öğün sayısı 2-3'e düşürülebilir.

## 5. Su Tüketimi
Kuru mama ile beslenen kedilerde su tüketimi çok önemlidir. Evin farklı noktalarına temiz su kapları koyarak su içmeyi teşvik edin.`,
        image: '/banners/blog_kitten.png',
        category: 'Beslenme',
        author: 'Dr. Ayşe Yılmaz',
        date: '15 Ocak 2026',
        readTime: '5 dk',
        featured: true,
        tags: ['Kedi', 'Yavru Kedi', 'Beslenme', 'Sağlık']
    },
    {
        id: 'kopek-egitimi-temelleri',
        title: 'Köpek Eğitimine Nereden Başlamalı?',
        slug: 'kopek-egitimi-temelleri',
        excerpt: 'Köpeğinizle harika bir iletişim kurmanın temeli eğitimden geçer. Pozitif pekiştirme yöntemleriyle temel itaat eğitiminin ipuçları.',
        content: `Köpek eğitimi, sadece komutları öğretmek değil, tüylü dostunuzla aranızdaki bağı güçlendirmektir. İşte başlangıç için temel adımlar:

## 1. Pozitif Pekiştirme
Cesa değil, ödül odaklı olun. Köpeğiniz istenen bir davranışı sergilediğinde onu anında ödüllendirin (mama, sevgi veya oyun). Bu, davranışı tekrar etme isteğini artırır.

## 2. Tutarlılık
Evdeki herkesin aynı kuralları uygulaması gerekir. "Otur" komutu için biri "Otur", diğeri "Çök" diyorsa köpek kafa karışıklığı yaşar.

## 3. Kısa ve Eğlenceli Seanslar
Eğitim seanslarını 5-10 dakika ile sınırlı tutun. Uzun süre odaklanmak köpekler için zordur. Eğitimi her zaman oyunla ve pozitif bir notla bitirin.

## 4. Sosyalleşme
Eğitim sadece evde olmaz. Köpeğinizi farklı insanlarla, hayvanlarla ve ortamlarla (park, veteriner, kalabalık cadde) tanıştırın. Bu, korku ve agresyon problemlerini önler.`,
        image: '/banners/blog_dog_training.png',
        category: 'Eğitim',
        author: 'Eğitmen Caner Öz',
        date: '12 Ocak 2026',
        readTime: '8 dk',
        featured: false,
        tags: ['Köpek', 'Eğitim', 'Davranış']
    },
    {
        id: 'evcil-hayvan-seyahat',
        title: 'Evcil Hayvanla Seyahat Rehberi',
        slug: 'evcil-hayvan-seyahat',
        excerpt: 'Tatile giderken patili dostunuzu geride bırakmayın! Araba, uçak ve otobüs yolculuklarında dikkat edilmesi gerekenler.',
        content: `Seyahat etmek güzeldir, ama en yakın dostunuz yanınızdaysa daha da güzeldir. İşte güvenli ve konforlu bir yolculuk için ipuçları:

## Araba Yolculuğu
* **Emniyet:** Köpeğiniz arka koltukta emniyet kemeri aparatı ile bağlanmalı veya kedi/küçük köpek taşıma kutusunda olmalıdır.
* **Molalar:** Her 2-3 saatte bir ihtiyaç molası verin.
* **Havasızlık:** Asla ama asla evcil hayvanınızı park halindeki araçta yalnız bırakmayın. Sıcaklık dakikalar içinde ölümcül seviyelere çıkabilir.

## Uçak Yolculuğu
* **Prosedürler:** Her havayolunun kuralı farklıdır. Bilet almadan önce mutlaka evcil hayvan kotasını ve taşıma çantası standartlarını kontrol edin.
* **Sağlık Kontrolü:** Uçuştan önce veteriner kontrolü ve "uçabilir" raporu gerekebilir.
* **Sakinleştirici:** Veterinerinize danışmadan sakinleştirici ilaç vermeyin.`,
        image: '/banners/blog_travel.png',
        category: 'Yaşam',
        author: 'Gezgin Pati',
        date: '10 Ocak 2026',
        readTime: '6 dk',
        featured: false,
        tags: ['Seyahat', 'İpuçları', 'Yaşam']
    },
    {
        id: 'kedi-kumu-secimi',
        title: 'Doğru Kedi Kumu Nasıl Seçilir?',
        slug: 'kedi-kumu-secimi',
        excerpt: 'Bentonit, silika, doğal... Kediniz ve eviniz için en uygun kedi kumu hangisi? Tozsuz ve koku yapmayan kum tavsiyeleri.',
        content: `Kedi kumu seçimi, hem kedinizin sağlığı hem de evinizin hijyeni için kritiktir. 

## Bentonit (Topaklanan) Kumlar
En yaygın türdür. Sıvıyı emince topaklaşır, temizlemesi kolaydır.
* **Artı:** İyi koku hapseder, ekonomiktir.
* **Eksi:** Toz yapabilir, eve dağılabilir.

## Silika (Kristal) Kumlar
Sıvıyı ve kokuyu içine hapseder.
* **Artı:** Tozsuzdur, az bakım gerektirir.
* **Eksi:** Patilere batabilir, bazı kediler dokusunu sevmez.

## Doğal (Organik) Kumlar
Çam, mısır, buğday gibi malzemelerden yapılır.
* **Artı:** Çevre dostudur, tuvalete atılabilir (bazıları), kimyasal içermez.
* **Eksi:** Topaklanma performansı bentonit kadar iyi olmayabilir.

**Öneri:** Kediniz hangi kumu seviyorsa en iyisi odur! Ani değişikliklerden kaçının, kum değiştirirken eskisini yenisiyle karıştırarak geçiş yapın.`,
        image: '/banners/blog_litter.png',
        category: 'Bakım',
        author: 'Pati Uzmanı Selin',
        date: '08 Ocak 2026',
        readTime: '4 dk',
        featured: false,
        tags: ['Kedi', 'Bakım', 'Hijyen']
    },
    {
        id: 'kopeklerde-eklem-sagligi',
        title: 'Köpeklerde Eklem Sağlığı ve Koruma',
        slug: 'kopeklerde-eklem-sagligi',
        excerpt: 'Özellikle büyük ırklarda görülen eklem problemlerini nasıl önleyebilirsiniz? Glukozamin kullanımı ve egzersiz önerileri.',
        content: `Yaşlı köpeklerin kabusu olan artrit ve kalça displazisi, aslında gençken alınan önlemlerle geciktirilebilir.

## Risk Faktörleri
* Aşırı kilo (Obezite)
* Kaygan zeminler
* Aşırı ve kontrolsüz egzersiz (özellikle büyüme çağında)
* Genetik yatkınlık

## Koruma Yolları
1. **İdeal Kilo:** Ekstra her kilo, eklemlere binen yükü artırır.
2. **Doğru Beslenme:** Omega-3 (Balık yağı), Glukozamin ve Kondroitin sülfat içeren mamalar veya takviyeler kullanın.
3. **Kontrollü Egzersiz:** Fırlat-getir oyunlarını abartmayın, ani dönüşler eklemleri zorlar. Yüzme, eklemleri yormayan harika bir egzersizdir.`,
        image: '/banners/blog_joints.png',
        category: 'Sağlık',
        author: 'Vet. Hekim Mehmet',
        date: '05 Ocak 2026',
        readTime: '7 dk',
        featured: false,
        tags: ['Köpek', 'Sağlık', 'Yaşlılık']
    },
    {
        id: 'kedi-oyuncaklari',
        title: 'Kediniz İçin En İyi 5 Oyuncak Türü',
        slug: 'kedi-oyuncaklari',
        excerpt: 'Sıkılan kediler mutsuz olur! Avcılık içgüdülerini tatmin edecek ve enerjilerini atacakları oyuncak önerileri.',
        content: `Kediler doğuştan avcıdır. Ev kedilerinin bu içgüdülerini oyunla tatmin etmesi gerekir, aksi halde agresifleşebilir veya depresyona girebilirler.

1. **Oltalar:** Sizin yönettiğiniz, kedinin takip edip yakalamaya çalıştığı tüylü uçlu çubuklar. En iyi interaktif oyundur.
2. **Lazer:** Harika bir koşu egzersizidir ama sonunda "yakalayabilecekleri" somut bir şey olmadığı için hayal kırıklığı yaratabilir. Oyun sonunda gerçek bir oyuncakla veya mamayla ödüllendirin.
3. **Kedi Otu (Catnip) Oyuncakları:** Çoğu kedi buna bayılır! Rahatlatır ve oyun isteğini artırır.
4. **Zeka Oyunları:** Mama saklanan bulmacalar, kedinizin zihnini çalıştırır ve yeme hızını yavaşlatır.
5. **Tüneller:** Saklanıp pusu kurmayı seven kediler için idealdir.`,
        image: '/banners/blog_toys.png',
        category: 'Eğlence',
        author: 'PatiSever',
        date: '03 Ocak 2026',
        readTime: '3 dk',
        featured: false,
        tags: ['Kedi', 'Oyun', 'Eğlence']
    },
    {
        id: 'balik-bakimi-101',
        title: 'Akvaryum Kurulumu: Başlangıç Rehberi',
        slug: 'balik-bakimi-101',
        excerpt: 'Beta veya Japon balığı beslemek isteyenler için temel akvaryum kurulumu, su değerleri ve filtre seçimi.',
        content: `Akvaryum sadece su dolu bir cam değildir, yaşayan bir ekosistemdir.

## 1. Akvaryum Boyutu
"Küçük akvaryum daha kolaydır" yanlıştır. Küçük hacimde su değerleri çok çabuk bozulur. Başlangıç için en az 30-50 litre önerilir.

## 2. Azot Döngüsü
Balıkları koymadan önce akvaryumu kurup filtreyi en az 1-2 hafta boş çalıştırmalısınız. Yararlı bakterilerin oluşması (Biyolojik Döngü) şarttır.

## 3. Ekipmanlar
* **Filtre:** Olmazsa olmazdır. Suyu temizler ve oksijen sağlar.
* **Isıtıcı:** Özellikle tropik balıklar (Lepistes, Beta vb.) sabit sıcaklık ister.
* **Işık:** Bitkiler ve balıkların biyolojik ritmi için gereklidir.`,
        image: '/banners/blog_fish.png',
        category: 'Akvaryum',
        author: 'Su Dünyası',
        date: '01 Ocak 2026',
        readTime: '10 dk',
        featured: false,
        tags: ['Balık', 'Akvaryum', 'Rehber']
    }
];

export const BLOG_CATEGORIES = ['Tümü', 'Beslenme', 'Sağlık', 'Bakım', 'Eğitim', 'Yaşam', 'Eğlence', 'Akvaryum'];
