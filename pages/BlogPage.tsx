import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { useProducts } from '../ProductContext';

// Blog yazıları verisi
const BLOG_ARTICLES = [
    {
        id: 'yavru-kedi-beslenmesi',
        title: 'Yavru Kedi Beslenmesinde 5 Altın Kural',
        slug: 'yavru-kedi-beslenmesi',
        excerpt: 'Yavru kedinizin sağlıklı büyümesi için dikkat etmeniz gereken beslenme kurallarını öğrenin. Anne sütünden mama geçişine kadar tüm detaylar.',
        content: `
      Yavru kediler, hayatlarının ilk aylarında hızlı bir büyüme sürecindedir. Bu dönemde doğru beslenme, sağlıklı bir yetişkin kedi olmaları için kritik öneme sahiptir.

      ## 1. İlk 4 Hafta: Anne Sütü Vazgeçilmezdir
      Yavru kediler ilk 4 hafta boyunca sadece anne sütüyle beslenmelidir. Anne sütü, bağışıklık sistemini güçlendiren antikorlar içerir.

      ## 2. 4-8 Hafta: Mama Geçişi
      4. haftadan itibaren yumuşatılmış yavru kedi maması verilebilir. Mamaları ılık su ile yumuşatarak başlayın.

      ## 3. Yavru Kedi Maması Seçimi
      Mutlaka "yavru kedi" veya "kitten" yazan mamalar tercih edin. Bu mamalar yüksek protein ve enerji içerir.

      ## 4. Öğün Sayısı
      - 2-3 aylık: Günde 4-5 öğün
      - 3-6 aylık: Günde 3-4 öğün  
      - 6-12 aylık: Günde 2-3 öğün

      ## 5. Temiz Su Her Zaman Hazır Olmalı
      Yavru kedinizin her zaman temiz ve taze suya erişimi olmalıdır.
    `,
        image: '/banners/blog_kitten.png',
        category: 'Beslenme',
        author: 'Dr. Ayşe Veteriner',
        date: '15 Ocak 2026',
        readTime: '5 dk'
    },
    {
        id: 'kopek-eklem-sagligi',
        title: 'Köpeklerde Eklem Sağlığı: Erken Teşhis ve Önleme',
        slug: 'kopek-eklem-sagligi',
        excerpt: 'Büyük ırk köpeklerde sık görülen eklem problemlerini nasıl önleyebilirsiniz? Erken belirtiler ve koruyucu önlemler.',
        content: `
      Eklem problemleri, özellikle büyük ırk köpeklerde yaşlanmayla birlikte sık görülen bir sorundur. Erken önlem almak, köpeğinizin yaşam kalitesini artırır.

      ## Eklem Problemlerinin Belirtileri
      - Yürürken topallama
      - Merdiven çıkmakta zorlanma
      - Sabahları tutukluk
      - Oynamak istememe
      - Eklemlerde şişlik

      ## Koruyucu Önlemler

      ### 1. Uygun Kilo
      Fazla kilo, eklemlere binen yükü artırır. Köpeğinizi ideal kiloda tutun.

      ### 2. Düzenli Egzersiz
      Hafif ve düzenli yürüyüşler eklem sağlığını korur. Aşırı zorlamadan kaçının.

      ### 3. Destekleyici Besinler
      - Glukozamin ve kondroitin içeren mamalar
      - Omega-3 yağ asitleri
      - E vitamini

      ### 4. Uygun Yatak
      Ortopedik köpek yatakları eklem baskısını azaltır.

      ## Ne Zaman Veterinere Gitmelisiniz?
      Yukarıdaki belirtilerden herhangi birini fark ederseniz, vakit kaybetmeden veterinerinize başvurun.
    `,
        image: '/banners/blog_dog.png',
        category: 'Sağlık',
        author: 'Dr. Mehmet Veteriner',
        date: '10 Ocak 2026',
        readTime: '7 dk'
    },
    {
        id: 'tahilsiz-mama-rehberi',
        title: 'Tahılsız Mamalar: Gerçekten Gerekli mi?',
        slug: 'tahilsiz-mama-rehberi',
        excerpt: 'Tahılsız mamaların avantajları ve dezavantajları nelerdir? Hangi durumlarda tercih edilmelidir?',
        content: `
      Son yıllarda tahılsız mamalar popülerlik kazandı. Peki gerçekten her evcil hayvan için uygun mu?

      ## Tahılsız Mama Nedir?
      Tahılsız mamalar, buğday, mısır, pirinç gibi tahıl içermeyen mamalardır. Bunların yerine patates, nohut veya bezelye kullanılır.

      ## Avantajları
      - Tahıl alerjisi olan hayvanlar için ideal
      - Genellikle daha yüksek et oranı
      - Daha kolay sindirilebilir olabilir

      ## Dezavantajları
      - Daha pahalı olabilir
      - Her hayvan için gerekli değil
      - Bazı araştırmalar kalp sağlığı endişelerini işaret ediyor

      ## Kime Önerilir?
      - Tahıl alerjisi teşhis konmuş hayvanlara
      - Sindirim problemleri yaşayanlara
      - Deri problemleri olanlara

      ## Sonuç
      Tahılsız mama seçmeden önce veterinerinize danışın. Her hayvanın ihtiyacı farklıdır.
    `,
        image: '/banners/blog_grain.png',
        category: 'Beslenme',
        author: 'Vet. Hekim Zeynep',
        date: '5 Ocak 2026',
        readTime: '6 dk'
    },
    {
        id: 'kedi-kumu-secimi',
        title: 'Doğru Kedi Kumu Nasıl Seçilir?',
        slug: 'kedi-kumu-secimi',
        excerpt: 'Topaklanan, silika, doğal... Hangi kedi kumu sizin için en uygun? Detaylı karşılaştırma.',
        content: `
      Kedi kumu seçimi, hem kedinizin hem de sizin konforunuz için önemlidir. İşte bilmeniz gerekenler.

      ## Kedi Kumu Türleri

      ### 1. Topaklanan Kum (Bentonit)
      - **Avantajları:** Kolay temizlenir, koku kontrolü iyi
      - **Dezavantajları:** Toz kaldırabilir, ağır

      ### 2. Silika Kristal Kum
      - **Avantajları:** Hafif, az toz, uzun ömürlü
      - **Dezavantajları:** Bazı kediler sevmeyebilir, daha pahalı

      ### 3. Doğal/Organik Kum
      - **Avantajları:** Çevre dostu, yenilebilir
      - **Dezavantajları:** Koku kontrolü zayıf olabilir

      ## Seçim Kriterleri
      1. **Toz Miktarı:** Solunum sağlığı için önemli
      2. **Koku Kontrolü:** Evinizin ferahlığı için
      3. **Topaklanma:** Temizlik kolaylığı
      4. **Kedinizin Tercihi:** En önemli faktör!

      ## Önerimiz
      Ever Clean veya benzeri premium topaklanan kumlar genellikle en iyi sonucu verir.
    `,
        image: '/banners/blog_litter.png',
        category: 'Bakım',
        author: 'Pati Uzmanı Selin',
        date: '1 Ocak 2026',
        readTime: '5 dk'
    }
];

const BlogPage: React.FC = () => {
    const { blogPosts, loading } = useProducts();

    // Use placeholder if no posts yet, or just show loading/empty state
    // For now, let's assume we want to show nothing or a message if empty

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-[240px] md:pt-[360px] pb-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Filter published posts just in case (though service does this)
    const publishedPosts = blogPosts.filter(p => p.is_published);

    if (publishedPosts.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-[240px] md:pt-[360px] pb-20 container mx-auto px-4 text-center">
                <h1 className="text-3xl font-bold text-secondary mb-4">Henüz blog yazısı bulunmuyor.</h1>
                <p className="text-gray-500">Yakında çok daha fazlası burada olacak!</p>
            </div>
        );
    }

    const featuredPost = publishedPosts[0];
    const otherPosts = publishedPosts.slice(1);

    return (
        <div className="min-h-screen bg-white pt-[240px] md:pt-[360px] pb-20">

            {/* Header */}
            <section className="container mx-auto px-4 mb-12">
                <div className="text-center max-w-2xl mx-auto">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4">
                        Pati Blog
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-secondary mb-4">
                        Evcil Hayvan Rehberi
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Patili dostlarınızın sağlığı, beslenmesi ve bakımı hakkında uzman içerikler.
                    </p>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="container mx-auto px-4 mb-16">
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="aspect-[4/3] md:aspect-auto">
                                <img
                                    src={featuredPost.img}
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                                    {featuredPost.category}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-secondary mb-4 leading-tight">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                    {featuredPost.content.substring(0, 150)}...
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><User size={14} /> {featuredPost.author}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(featuredPost.created_at).toLocaleDateString('tr-TR')}</span>
                                    {/* Read time could be calculated */}
                                    <span className="flex items-center gap-1"><Clock size={14} /> 5 dk</span>
                                </div>
                                <Link
                                    to={`/blog/${featuredPost.slug}`}
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all w-fit"
                                >
                                    Devamını Oku <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Article Grid */}
            <section className="container mx-auto px-4">
                <h3 className="text-2xl font-black text-secondary mb-8">Tüm Yazılar</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map(article => (
                        <article
                            key={article.id}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all group"
                        >
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={article.img}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-orange-50 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Tag size={12} /> {article.category}
                                    </span>
                                    {/* <span className="text-xs text-gray-400">{article.readTime}</span> */}
                                </div>
                                <h4 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {article.title}
                                </h4>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {article.content.substring(0, 100)}...
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                                    <Link
                                        to={`/blog/${article.slug}`}
                                        className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        Oku <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="container mx-auto px-4 mt-20">
                <div className="bg-gradient-to-r from-secondary to-gray-800 rounded-[2rem] p-10 md:p-16 text-center text-white">
                    <h3 className="text-2xl md:text-3xl font-black mb-4">Pati Bülteni'ne Abone Olun</h3>
                    <p className="text-white/70 mb-8 max-w-lg mx-auto">
                        Yeni yazılar, kampanyalar ve özel tekliflerden haberdar olun.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="flex-1 px-6 py-4 rounded-xl text-secondary font-medium focus:ring-2 focus:ring-primary outline-none"
                        />
                        <button className="bg-primary hover:bg-primary-hover px-8 py-4 rounded-xl font-bold transition-all">
                            Abone Ol
                        </button>
                    </form>
                </div>
            </section>

        </div>
    );
};

export default BlogPage;
