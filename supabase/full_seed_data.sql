-- =============================================
-- PetShop Complete Seed Data
-- Run this in Supabase SQL Editor
-- Generated: 2026-01-09
-- Contains ALL 71 products from constants.ts
-- =============================================

-- MARKALAR (Brands)
INSERT INTO brands (id, name, slug, logo_url) VALUES
  ('royal-canin', 'Royal Canin', 'royal-canin', '/marka_fotograflari/Royal Canin/000001.jpg'),
  ('hills', 'Hill''s', 'hills', '/marka_fotograflari/Hill_s/000001.jpg'),
  ('acana', 'Acana', 'acana', '/marka_fotograflari/Acana/000001.jpg'),
  ('proplan', 'Pro Plan', 'proplan', '/marka_fotograflari/Purina Pro Plan/000001.jpg'),
  ('nd', 'N&D Farmina', 'nd', '/marka_fotograflari/Farmina/000001.jpg'),
  ('orijen', 'Orijen', 'orijen', '/marka_fotograflari/Orijen/000001.jpg'),
  ('brit-care', 'Brit Care', 'brit-care', '/markalar/brit.png'),
  ('felicia', 'Felicia', 'felicia', '/markalar/felicia.png'),
  ('reflex', 'Reflex', 'reflex', '/markalar/Group_135141.webp'),
  ('jungle', 'Jungle', 'jungle', '/markalar/Group_135142.avif'),
  ('enjoy', 'Enjoy', 'enjoy', '/markalar/Group_135146.avif'),
  ('bestpet', 'BestPet', 'bestpet', '/markalar/Group_135148.webp'),
  ('dogido', 'Dogido', 'dogido', '/markalar/Group_135149.webp'),
  ('proline', 'ProLine', 'proline', '/markalar/Group_135152.webp'),
  ('ever-clean', 'Ever Clean', 'ever-clean', '/markalar/ever-clean.webp'),
  ('schesir', 'Schesir', 'schesir', '/markalar/marca-logo-schesir.jpg'),
  ('wanpy', 'Wanpy', 'wanpy', '/markalar/wanpy.png'),
  ('exclusion', 'Exclusion', 'exclusion', '/markalar/exclusion.png'),
  ('lavital', 'LaVital', 'lavital', '/markalar/Group_23071.webp'),
  ('purelife', 'PureLife', 'purelife', '/markalar/petcomfor.jpg')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, logo_url = EXCLUDED.logo_url;

-- KATEGORİLER (Categories) - Ana Kategoriler
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ('kedi', 'Kedi', 'kedi', NULL),
  ('kopek', 'Köpek', 'kopek', NULL),
  ('kus', 'Kuş', 'kus', NULL),
  ('balik', 'Balık', 'balik', NULL),
  ('kemirgen', 'Kemirgen', 'kemirgen', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Kedi Alt Kategorileri
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ('kedi-mamasi', 'Kedi Mamaları', 'kedi-mamasi', 'kedi'),
  ('kedi-kumu', 'Kedi Kumu', 'kedi-kumu', 'kedi'),
  ('kedi-oyuncak', 'Kedi Oyuncakları', 'kedi-oyuncak', 'kedi'),
  ('kedi-bakim', 'Kedi Bakım Ürünleri', 'kedi-bakim', 'kedi'),
  ('kedi-tirmalama', 'Kedi Tırmalama Ürünleri', 'kedi-tirmalama', 'kedi'),
  ('kedi-saglik', 'Kedi Sağlık Ürünleri', 'kedi-saglik', 'kedi'),
  ('kedi-mama-kap', 'Kedi Mama ve Su Kapları', 'kedi-mama-kap', 'kedi'),
  ('kedi-odul', 'Kedi Ödülleri', 'kedi-odul', 'kedi'),
  ('kedi-tuvalet', 'Kedi Tuvalet Kabı ve Aksesuarları', 'kedi-tuvalet', 'kedi'),
  ('kedi-vitamin', 'Kedi Vitaminleri', 'kedi-vitamin', 'kedi'),
  ('kedi-tasma', 'Kedi Tasmaları', 'kedi-tasma', 'kedi'),
  ('kedi-tasima', 'Kedi Taşıma ve Seyahat Ürünleri', 'kedi-tasima', 'kedi'),
  ('kedi-hijyen', 'Kedi Hijyen ve Bakım Ürünleri', 'kedi-hijyen', 'kedi'),
  ('kedi-yatak', 'Kedi Yatakları', 'kedi-yatak', 'kedi')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Köpek Alt Kategorileri
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ('kopek-mamasi', 'Köpek Mamaları', 'kopek-mamasi', 'kopek'),
  ('kopek-oyuncak', 'Köpek Oyuncakları', 'kopek-oyuncak', 'kopek'),
  ('kopek-bakim', 'Köpek Bakım Ürünleri', 'kopek-bakim', 'kopek'),
  ('kopek-tasma', 'Köpek Tasma ve Kayışları', 'kopek-tasma', 'kopek'),
  ('kopek-yatak', 'Köpek Yatakları ve Kulübeleri', 'kopek-yatak', 'kopek'),
  ('kopek-mama-kap', 'Köpek Mama ve Su Kapları', 'kopek-mama-kap', 'kopek'),
  ('kopek-odul', 'Köpek Ödülleri', 'kopek-odul', 'kopek'),
  ('kopek-saglik', 'Köpek Sağlık Ürünleri', 'kopek-saglik', 'kopek'),
  ('kopek-vitamin', 'Köpek Vitaminleri', 'kopek-vitamin', 'kopek'),
  ('kopek-tasima', 'Köpek Taşıma Ürünleri', 'kopek-tasima', 'kopek'),
  ('kopek-giyim', 'Köpek Giyim', 'kopek-giyim', 'kopek')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Kuş, Balık, Kemirgen Alt Kategorileri
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ('kus-yemi', 'Kuş Yemleri', 'kus-yemi', 'kus'),
  ('kus-kafes', 'Kuş Kafesleri', 'kus-kafes', 'kus'),
  ('kus-aksesuar', 'Kuş Aksesuarları', 'kus-aksesuar', 'kus'),
  ('balik-yemi', 'Balık Yemleri', 'balik-yemi', 'balik'),
  ('akvaryum', 'Akvaryum Ürünleri', 'akvaryum', 'balik'),
  ('kemirgen-yemi', 'Kemirgen Yemleri', 'kemirgen-yemi', 'kemirgen'),
  ('kemirgen-kafes', 'Kemirgen Kafesleri', 'kemirgen-kafes', 'kemirgen')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- =============================================
-- ÜRÜNLER (Products) - Part 1: KEDİ MAMALARI (p1-p12)
-- =============================================
INSERT INTO products (id, name, slug, description, price, discounted_price, stock, brand_id, category_id, images, tags, features, is_active, rating, review_count) VALUES
('p1', 'Royal Canin Mother & Babycat Yavru Kedi Maması 2kg', 'royal-canin-mother-babycat-2kg', 
  'Anne ve yavru kediler için özel formül. Bağışıklık sistemini destekler, kolay sindirilebilir yapısıyla hassas midelere uygundur.',
  945.00, 850.00, 25, 'royal-canin', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (1).jpg', '/trendyol kedi maması/1_org_zoom (2).jpg'],
  ARRAY['Yavru', 'Premium', 'Bağışıklık'], ARRAY['Yüksek Protein', 'Kolay Sindirim', 'DHA Destekli'],
  true, 4.9, 512),

('p2', 'Royal Canin Indoor Ev Kedisi Maması 4kg', 'royal-canin-indoor-4kg',
  'Ev içinde yaşayan kediler için özel formül. Kilo kontrolü sağlar, tüy yumağı oluşumunu azaltır.',
  1250.00, 1099.00, 30, 'royal-canin', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (3).jpg', '/trendyol kedi maması/1_org_zoom (4).jpg'],
  ARRAY['Indoor', 'Kilo Kontrolü'], ARRAY['Düşük Kalori', 'Tüy Yumağı Kontrolü', 'L-Karnitin'],
  true, 4.8, 328),

('p3', 'Hill''s Science Plan Kısırlaştırılmış Kedi Maması 3kg', 'hills-sterile-cat-3kg',
  'Kısırlaştırılmış kediler için bilimsel formül. Kilo kontrolü ve idrar yolu sağlığını destekler.',
  1150.00, 990.00, 45, 'hills', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (5).jpg', '/trendyol kedi maması/1_org_zoom (6).jpg'],
  ARRAY['Kısırlaştırılmış', 'Kilo Kontrolü'], ARRAY['L-Karnitin', 'Dengeli Mineral', 'Omega 3-6'],
  true, 4.9, 840),

('p4', 'N&D Prime Tavuklu Narlı Tahılsız Kedi Maması 1.5kg', 'nd-prime-tavuk-nar-1-5kg',
  'Doğal nar özleri ve serbest gezen tavuk etiyle hazırlanan tahılsız premium mama.',
  780.00, 699.00, 24, 'nd', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (7).jpg', '/trendyol kedi maması/1_org_zoom (8).jpg'],
  ARRAY['Tahılsız', 'Premium'], ARRAY['Tahılsız', 'Nar Özlü', 'Taze Et'],
  true, 4.8, 320),

('p5', 'Acana Wild Prairie Tahılsız Kedi Maması 1.8kg', 'acana-wild-prairie-1-8kg',
  'Biyolojik olarak uygun, çoklu protein kaynaklı tahılsız mama. Tavuk, hindi ve yumurta içerir.',
  1450.00, 1299.00, 18, 'acana', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (9).jpg', '/trendyol kedi maması/1_org_zoom (10).jpg'],
  ARRAY['Tahılsız', 'Premium', 'Çoklu Protein'], ARRAY['%70 Et', 'Kanada Üretim', 'WholePrey'],
  true, 5.0, 156),

('p6', 'Pro Plan Sterilised Somonlu Kısır Kedi Maması 3kg', 'proplan-sterilised-somon-3kg',
  'OptiRenal formülü ile böbrek sağlığını destekler. Kısırlaştırılmış kediler için ideal.',
  980.00, 879.00, 35, 'proplan', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (11).jpg', '/trendyol kedi maması/1_org_zoom (14).jpg'],
  ARRAY['Kısırlaştırılmış', 'Somonlu'], ARRAY['OptiRenal', 'Böbrek Sağlığı', 'Omega Yağ Asitleri'],
  true, 4.7, 445),

('p7', 'Orijen Cat & Kitten Tahılsız Kedi Maması 1.8kg', 'orijen-cat-kitten-1-8kg',
  'Ödüllü tahılsız formül. %85 kümes hayvanları ve balık, %15 meyve ve sebze.',
  1650.00, NULL, 12, 'orijen', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (16).jpg', '/trendyol kedi maması/1_org_zoom (19).jpg'],
  ARRAY['Tahılsız', 'Super Premium'], ARRAY['%85 Et', 'Fresh Regional', 'Biologically Appropriate'],
  true, 5.0, 89),

('p8', 'Brit Care Sterilised Ördekli Kedi Maması 2kg', 'brit-care-sterilised-ordek-2kg',
  'Hipoalerjenik formül, hassas sindirim sistemi için ördek proteini.',
  720.00, 649.00, 40, 'brit-care', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (20).jpg', '/trendyol kedi maması/1_org_zoom (21).jpg'],
  ARRAY['Hipoalerjenik', 'Ördekli'], ARRAY['Tek Protein', 'Patatesiz', 'Prebiyotik'],
  true, 4.6, 267),

('p9', 'Reflex Plus Tavuklu Yetişkin Kedi Maması 1.5kg', 'reflex-plus-tavuk-1-5kg',
  'Dengeli beslenme için tavuk etli ekonomik formül. Parlak tüyler için omega yağları.',
  289.00, 249.00, 80, 'reflex', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (22).jpg', '/trendyol kedi maması/1_org_zoom (23).jpg'],
  ARRAY['Ekonomik', 'Tavuklu'], ARRAY['Ekonomik', 'Omega 3-6', 'Taurin'],
  true, 4.3, 892),

('p10', 'Jungle Somonlu Yetişkin Kedi Maması 1.5kg', 'jungle-somon-1-5kg',
  'Somon balığı ile zenginleştirilmiş, parlak tüyler ve sağlıklı deri için.',
  245.00, 219.00, 65, 'jungle', 'kedi-mamasi',
  ARRAY['/trendyol kedi maması/1_org_zoom (24).jpg', '/trendyol kedi maması/1_org_zoom (25).jpg'],
  ARRAY['Ekonomik', 'Somonlu'], ARRAY['Somon Yağı', 'Vitamin E', 'Çinko'],
  true, 4.2, 654),

('p11', 'Ever Clean Extra Strength Kokusuz Kedi Kumu 10L', 'ever-clean-extra-strength-10l',
  'Aktif karbon teknolojisi ile maksimum koku kontrolü. Topaklanan, toz kaldırmayan formül.',
  640.00, 549.00, 100, 'ever-clean', 'kedi-kumu',
  ARRAY['/trendyol kedi maması/1_org_zoom (26).jpg', '/trendyol kedi maması/1_org_zoom (27).jpg'],
  ARRAY['Kokusuz', 'Ekstra Güçlü'], ARRAY['Aktif Karbon', 'Sıfır Toz', '14 Gün Koku Kontrolü'],
  true, 5.0, 2100),

('p12', 'Ever Clean Lavanta Kokulu Kedi Kumu 6L', 'ever-clean-lavanta-6l',
  'Lavanta esansı ile ferahlatıcı koku. Üstün topaklanma özelliği.',
  420.00, 379.00, 75, 'ever-clean', 'kedi-kumu',
  ARRAY['/trendyol kedi maması/1_org_zoom (28).jpg', '/trendyol kedi maması/1_org_zoom (29).jpg'],
  ARRAY['Lavanta', 'Parfümlü'], ARRAY['Lavanta Özü', 'Hızlı Topaklanma', 'Kolay Temizlik'],
  true, 4.8, 1456)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, price = EXCLUDED.price, discounted_price = EXCLUDED.discounted_price,
  stock = EXCLUDED.stock, images = EXCLUDED.images, tags = EXCLUDED.tags, features = EXCLUDED.features,
  is_active = EXCLUDED.is_active, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count;
-- =============================================
-- ÜRÜNLER Part 2: KÖPEK MAMALARI (p13-p26)
-- =============================================
INSERT INTO products (id, name, slug, description, price, discounted_price, stock, brand_id, category_id, images, tags, features, is_active, rating, review_count) VALUES
('p13', 'Royal Canin Medium Adult Yetişkin Köpek Maması 4kg', 'royal-canin-medium-adult-4kg',
  'Orta ırk yetişkin köpekler için optimal beslenme. Sindirim sağlığı ve ideal kilo.',
  890.00, 799.00, 28, 'royal-canin', 'kopek-mamasi',
  ARRAY['/Köpek Maması/royal elite yetişkin köpek maması.webp'], ARRAY['Orta Irk', 'Yetişkin'],
  ARRAY['Sindirim Sağlığı', 'Omega Yağları', 'Şekil Koruma'], true, 4.8, 623),

('p14', 'Pro Plan Medium Puppy Kuzulu Yavru Köpek Maması 3kg', 'proplan-medium-puppy-kuzu-3kg',
  'Yavru köpekler için OptiStart formülü. Beyin gelişimi ve güçlü bağışıklık.',
  890.00, NULL, 30, 'proplan', 'kopek-mamasi',
  ARRAY['/Köpek Maması/purelife puppy kuzulu yavru köpek maması.jpg'], ARRAY['Yavru', 'Kuzulu'],
  ARRAY['OptiStart', 'DHA', 'Kolostrum'], true, 4.7, 150),

('p15', 'Acana Grass-Fed Lamb Tahılsız Köpek Maması 2kg', 'acana-grassfed-lamb-2kg',
  'Sadece otla beslenen kuzu eti. Tek protein kaynaklı, hassas mideler için.',
  1350.00, 1200.00, 12, 'acana', 'kopek-mamasi',
  ARRAY['/trendyol köpek maması/1_org_zoom (3).jpg'], ARRAY['Tahılsız', 'Premium', 'Kuzulu'],
  ARRAY['Tek Protein', 'Hassas Sindirim', 'Kanada Üretim'], true, 5.0, 88),

('p16', 'Hill''s Science Plan Adult Tavuklu Köpek Maması 2.5kg', 'hills-adult-tavuk-2-5kg',
  'Yetişkin köpekler için bilimsel beslenme. Kas yapısı ve enerji dengesi.',
  780.00, 699.00, 22, 'hills', 'kopek-mamasi',
  ARRAY['/Köpek Maması/Hill''s Prescription Diet.webp'], ARRAY['Yetişkin', 'Tavuklu'],
  ARRAY['Yüksek Protein', 'Omega 6', 'Vitamin E'], true, 4.7, 334),

('p17', 'N&D Quinoa Skin & Coat Somonlu Köpek Maması 2.5kg', 'nd-quinoa-skin-coat-2-5kg',
  'Deri ve tüy sağlığı için kinoa ve somon. Tahılsız fonksiyonel mama.',
  1120.00, 999.00, 16, 'nd', 'kopek-mamasi',
  ARRAY['/trendyol köpek maması/1_org_zoom (6).jpg'], ARRAY['Tahılsız', 'Deri Sağlığı'],
  ARRAY['Kinoa', 'Zerdeçal', 'Omega 3'], true, 4.9, 178),

('p18', 'Reflex Premium Kuzulu Pirinçli Köpek Maması 3kg', 'reflex-premium-kuzu-pirinc-3kg',
  'Kuzu eti ve pirinç ile dengeli beslenme. Tüm ırklar için uygundur.',
  395.00, 349.00, 55, 'reflex', 'kopek-mamasi',
  ARRAY['/Köpek Maması/reflex-premium-kuzulu-ve-pirincli-yetiskin-kopek-mamasi-yetiskin-kuru-kopek-mamasi-reflex-1329064-45-B.jpg'],
  ARRAY['Ekonomik', 'Kuzulu'], ARRAY['Kuzu & Pirinç', 'Omega Yağları', 'Vitamin Kompleksi'], true, 4.4, 567),

('p19', 'Jungle Kuzu Etli Yetişkin Köpek Maması 2.5kg', 'jungle-kuzu-yetiskin-2-5kg',
  'Kuzu etiyle lezzetli ve besleyici. Tüm ırklar için uygun ekonomik seçenek.',
  285.00, 249.00, 70, 'jungle', 'kopek-mamasi',
  ARRAY['/Köpek Maması/jungle-yetiskin-kopek-mamasi-kuzu-etli-275-kg-yetiskin-kopek-mamasi-jungle-29164-22-B.jpg'],
  ARRAY['Ekonomik', 'Kuzulu'], ARRAY['Kuzu Eti', 'Doğal Lezzet', 'Vitamin D'], true, 4.1, 423),

('p20', 'Enjoy Tavuklu Yetişkin Köpek Maması 15kg', 'enjoy-tavuk-yetiskin-15kg',
  'Büyük paket ekonomisi. Tavuk proteini ile dengeli günlük beslenme.',
  789.00, 699.00, 25, 'enjoy', 'kopek-mamasi',
  ARRAY['/Köpek Maması/enjoy-tavuklu-yetiskin-kopek-mamasi-15-72625-.webp'],
  ARRAY['Ekonomik', 'Büyük Paket'], ARRAY['15kg Ekonomik', 'Tavuk', 'Günlük Beslenme'], true, 4.2, 312),

('p21', 'BestPet Kuzu Etli Yetişkin Köpek Maması 15kg', 'bestpet-kuzu-15kg',
  'Premium kuzu eti ile besleyici formül. Büyük ırk köpekler için idealdir.',
  849.00, 749.00, 20, 'bestpet', 'kopek-mamasi',
  ARRAY['/Köpek Maması/bestpet-lamb-kuzu-etli-yetiskin-kopek-mamasi-15-kg-kopek-kuru-mamalari-bestpet-90388-69-B.jpg'],
  ARRAY['Büyük Paket', 'Kuzulu'], ARRAY['Kuzu Eti', 'Eklem Sağlığı', 'Parlak Tüy'], true, 4.3, 289),

('p22', 'Dogido Etli Yetişkin Köpek Maması 15kg', 'dogido-etli-15kg',
  'Karışık et aromalı, lezzetli ve ekonomik. Günlük enerji ihtiyacını karşılar.',
  695.00, 599.00, 35, 'dogido', 'kopek-mamasi',
  ARRAY['/Köpek Maması/dogido yetişken köpek maması.png'],
  ARRAY['Ekonomik', 'Etli'], ARRAY['Karışık Et', 'Enerji Dengesi', 'Vitamin Destekli'], true, 4.0, 567),

('p23', 'ProLine Tavuklu Yetişkin Köpek Maması 3kg', 'proline-tavuk-3kg',
  'Tavuk proteini ile güçlü kaslar. Aktif köpekler için dengeli formül.',
  329.00, 289.00, 45, 'proline', 'kopek-mamasi',
  ARRAY['/Köpek Maması/proline yetişken köpek maması.png'],
  ARRAY['Ekonomik', 'Tavuklu'], ARRAY['Tavuk', 'Aktif Köpekler', 'Kas Yapısı'], true, 4.2, 234),

('p24', 'Felicia Düşük Tahıllı Kuzulu Köpek Maması 3kg', 'felicia-dusuk-tahil-kuzu-3kg',
  'Düşük tahıl içerikli, hassas sindirim için kuzu eti ve pirinç.',
  445.00, 399.00, 38, 'felicia', 'kopek-mamasi',
  ARRAY['/Köpek Maması/felicia-dusuk-tahilli-kuzulu-ve-pirincli-yetiskin-kopek-mamasi-3-kg-kopek-kuru-mamalari-felicia-98465-92-B.jpg'],
  ARRAY['Düşük Tahıl', 'Kuzulu'], ARRAY['Düşük Tahıl', 'Kuzu & Pirinç', 'Hassas Sindirim'], true, 4.5, 178),

('p25', 'LaVital Büyük Irk Yavru Köpek Maması 3kg', 'lavital-buyuk-irk-yavru-3kg',
  'Büyük ırk yavru köpekler için özel formül. Eklem ve kemik sağlığı destekli.',
  489.00, 439.00, 25, 'lavital', 'kopek-mamasi',
  ARRAY['/Köpek Maması/lavital-buyuk-irk-yavru-kuru-kopek-mamasi-maxi-puppy-kuzu-etli-3kg-489-90-O.jpg'],
  ARRAY['Yavru', 'Büyük Irk'], ARRAY['Eklem Desteği', 'Kalsiyum', 'DHA'], true, 4.6, 123),

('p26', 'PureLife Puppy Kuzulu Yavru Köpek Maması 3kg', 'purelife-puppy-kuzu-3kg',
  'Yavru köpekler için saf ve doğal kuzu eti. Büyüme dönemini destekler.',
  520.00, 469.00, 30, 'purelife', 'kopek-mamasi',
  ARRAY['/Köpek Maması/purelife puppy kuzulu yavru köpek maması.jpg'],
  ARRAY['Yavru', 'Kuzulu'], ARRAY['Saf Kuzu', 'Doğal', 'Büyüme Desteği'], true, 4.5, 98)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, price = EXCLUDED.price, discounted_price = EXCLUDED.discounted_price,
  stock = EXCLUDED.stock, images = EXCLUDED.images, tags = EXCLUDED.tags, features = EXCLUDED.features,
  is_active = EXCLUDED.is_active, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count;

-- =============================================
-- ÜRÜNLER Part 3: YENİ KEDİ MAMALARI & DİĞER (p27-p42)
-- =============================================
INSERT INTO products (id, name, slug, description, price, discounted_price, stock, brand_id, category_id, images, tags, features, is_active, rating, review_count) VALUES
('p27', 'N&D Düşük Tahıllı Somonlu Kısırlaştırılmış Kedi Maması 10kg', 'nd-dusuk-tahil-somon-10kg',
  'Kısırlaştırılmış kediler için düşük tahıllı, somonlu premium mama.',
  2850.00, 2499.00, 15, 'nd', 'kedi-mamasi',
  ARRAY['/kedi mamaları/imgi_10_nd-dusuk-tahilli-somonlu-kisirlastirilmis-kedi-mamasi-10-kg-68764f31aad93.jpg'],
  ARRAY['Kısırlaştırılmış', 'Düşük Tahıl', 'Premium'], ARRAY['Düşük Tahıl', 'Omega 3-6', 'Somon'],
  true, 4.9, 267),

('p28', 'Paw Paw Gurme Renkli Kedi Maması 15kg', 'paw-paw-gurme-renkli-15kg',
  'Renkli ve lezzetli granüllerle gurme beslenme deneyimi.',
  1290.00, 1099.00, 40, 'jungle', 'kedi-mamasi',
  ARRAY['/kedi mamaları/imgi_11_paw-paw-gurme-renkli-kedi-mamasi-15-kg-66c325936ca7c.jpg'],
  ARRAY['Ekonomik', 'Gurme', 'Büyük Paket'], ARRAY['15kg Ekonomik', 'Renkli Granüller'],
  true, 4.3, 412),

('p29', 'Pro Plan Original Kitten Tavuklu Yavru Kedi Maması 10kg', 'proplan-kitten-tavuk-10kg',
  'Yavru kediler için bilimsel formül. Beyin gelişimi ve bağışıklık sistemi desteği.',
  2450.00, 2199.00, 18, 'proplan', 'kedi-mamasi',
  ARRAY['/kedi mamaları/imgi_12_pro-plan-original-kitten-tavuklu-ve-pirincli-yavru-kedi-mamasi-10-kg-66ba2e9deeeb4.jpg'],
  ARRAY['Yavru', 'Premium', 'Tavuklu'], ARRAY['DHA Beyin Gelişimi', 'Kolostrum', 'Yüksek Protein'],
  true, 4.8, 356),

('p30', 'N&D Tropical Selection Tavuklu Kısır Kedi Maması 10kg', 'nd-tropical-tavuk-kisir-10kg',
  'Tropikal meyvelerle zenginleştirilmiş kısırlaştırılmış kedi maması.',
  2750.00, 2399.00, 12, 'nd', 'kedi-mamasi',
  ARRAY['/kedi mamaları/imgi_13_nd-tropical-selection-tavuklu-kisir-yetiskin-kedi-mamasi-10-kg-66c4d5064a7cb.jpg'],
  ARRAY['Kısırlaştırılmış', 'Tropikal', 'Premium'], ARRAY['Tropikal Meyve', 'Kilo Kontrolü'],
  true, 4.7, 189),

('p31', 'Pro Plan Kısırlaştırılmış Tavuk Hindi Kedi Maması 10.2kg', 'proplan-kisir-tavuk-hindi-10kg',
  'Kısırlaştırılmış kediler için tavuk ve hindi ile protein dengesi.',
  2650.00, 2299.00, 22, 'proplan', 'kedi-mamasi',
  ARRAY['/kedi mamaları/imgi_14_pro-plan-kisirlastirilmis-tavukhindili-kedi-mamasi-102-kg-66d70df6f19e1.jpg'],
  ARRAY['Kısırlaştırılmış', 'Premium'], ARRAY['Tavuk & Hindi', 'Optirenal', 'Kilo Kontrolü'],
  true, 4.8, 423),

('p32', 'N&D Düşük Tahıllı Tavuklu Narlı Kısır Kedi Maması 10kg', 'nd-tavuk-nar-kisir-10kg',
  'Tavuk ve nar kombinasyonu ile antioksidan destekli.',
  2890.00, 2549.00, 10, 'nd', 'kedi-mamasi',
  ARRAY['/kedi mamaları/imgi_15_nd-dusuk-tahilli-tavuklu-ve-narli-kisirlastirilmis-yetiskin-kedi-mamasi-10-kg-68cd3b94a2da2.jpg'],
  ARRAY['Kısırlaştırılmış', 'Düşük Tahıl', 'Narlı'], ARRAY['Nar Antioksidan', 'Düşük Tahıl'],
  true, 4.9, 312),

('p33', 'Goody Etli Yetişkin Kedi Maması 15kg', 'goody-etli-yetiskin-15kg',
  'Ekonomik ve lezzetli etli mama. Günlük beslenme ihtiyaçlarını karşılar.',
  890.00, 749.00, 55, 'jungle', 'kedi-mamasi',
  ARRAY['/kedi mamaları/imgi_16_goody-etli-yetiskin-kedi-mamasi-15-kg-66c416d28c42f.jpg'],
  ARRAY['Ekonomik', 'Etli', 'Büyük Paket'], ARRAY['15kg Ekonomik', 'Et Proteini'],
  true, 4.2, 567),

('p34', 'Nature Plan Papağan Yemi 800g x 5 Adet', 'nature-plan-papagan-yemi-800g',
  'Papağanlar için özel karışım yem. Vitamin ve mineral destekli.',
  349.00, 299.00, 35, 'jungle', 'kus-yemi',
  ARRAY['/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/imgi_10_nature-plan-papagan-yemi-800-g-x-5-adet-66c3b16044b4e.jpg'],
  ARRAY['Kuş', 'Papağan', 'Yem'], ARRAY['Vitamin Destekli', 'Doğal', '5 Adet Paket'],
  true, 4.6, 187),

('p35', 'Garden Mix Platin Sarı Dal Darı 150gr', 'garden-mix-sari-dal-dari-150gr',
  'Muhabbet kuşları ve kanarya için dal darı. Doğal ve lezzetli ödül.',
  45.00, 39.00, 80, 'jungle', 'kus-yemi',
  ARRAY['/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/imgi_11_garden-mix-platin-sari-dal-dari-150gr-66c54835ecf60.jpg'],
  ARRAY['Kuş', 'Ödül', 'Darı'], ARRAY['Doğal', 'Dal Darı', 'Ödül Yem'],
  true, 4.8, 342),

('p36', 'Gold Wings Premium Muhabbet Kuşu Yemi 1kg', 'gold-wings-muhabbet-yemi-1kg',
  'Premium kalite muhabbet kuşu yemi. Zengin vitamin ve mineral içeriği.',
  89.00, 79.00, 65, 'jungle', 'kus-yemi',
  ARRAY['/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/imgi_17_gold-wings-premium-muhabbet-kusu-yemi-1-kg-66c5482670e81.jpg'],
  ARRAY['Kuş', 'Muhabbet', 'Premium'], ARRAY['Premium', 'Vitamin Zengin', '1kg Paket'],
  true, 4.7, 256),

('p37', 'Dayang Ayaklı Papağan Kafesi Siyah 45x45x156cm', 'dayang-papagan-kafesi-siyah',
  'Büyük papağanlar için geniş yaşam alanı. Ayaklı tasarım.',
  2890.00, 2499.00, 8, 'jungle', 'kus-kafes',
  ARRAY['/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/imgi_23_dayang-ayakli-papagan-kafesi-siyah-457x457x156-cm-66e821dd9431b.jpg'],
  ARRAY['Kuş', 'Kafes', 'Papağan'], ARRAY['Ayaklı', 'Geniş', 'Kolay Temizlik'],
  true, 4.5, 89),

('p38', 'Miapet Kuşlar İçin Pleksi Ahşap Merdiven Oyuncak 30cm', 'miapet-kus-merdiven-oyuncak-30cm',
  'Kuşlar için eğlenceli merdiven oyuncak. Ahşap ve pleksi malzeme.',
  79.00, 69.00, 45, 'jungle', 'kus-aksesuar',
  ARRAY['/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/Kuş Ürünleri Ürünleri ve Fiyatları - idefix/imgi_15_miapet-kuslar-icin-pleksi-ahsap-oyuncak-merdiven-30-cm-66c0e86353a06.jpg'],
  ARRAY['Kuş', 'Oyuncak', 'Aksesuar'], ARRAY['Ahşap', 'Pleksi', 'Eğlenceli'],
  true, 4.4, 123),

('p39', 'Tetra Discus Granül Balık Yemi 10Lt 3kg', 'tetra-discus-granul-10lt-3kg',
  'Discus balıkları için özel granül yem. Renk parlaklığı ve sağlıklı gelişim.',
  1850.00, 1599.00, 12, 'jungle', 'balik-yemi',
  ARRAY['/Balık Ürünleri ve Fiyatları - idefix/Balık Ürünleri ve Fiyatları - idefix/imgi_10_tetra-discus-granul-balik-yemi-10-lt-3-kg-66c54cfe8409c.jpg'],
  ARRAY['Balık', 'Discus', 'Premium'], ARRAY['Granül', 'Renk Parlaklığı', 'Premium'],
  true, 4.9, 156),

('p40', 'Sobo HS-300 Akvaryum Cam Isıtıcı 300W', 'sobo-akvaryum-isitici-300w',
  'Akvaryum için güvenilir cam ısıtıcı. Ayarlanabilir sıcaklık kontrolü.',
  289.00, 249.00, 25, 'jungle', 'akvaryum',
  ARRAY['/Balık Ürünleri ve Fiyatları - idefix/Balık Ürünleri ve Fiyatları - idefix/imgi_11_sobo-hs-300-akvaryum-cam-isitici-300w-67333f5549907.jpg'],
  ARRAY['Akvaryum', 'Isıtıcı', 'Ekipman'], ARRAY['300W', 'Cam', 'Ayarlanabilir'],
  true, 4.6, 234),

('p41', 'Sobo WP-3300 Akvaryum Kafa Motoru', 'sobo-wp3300-kafa-motoru',
  'Güçlü akvaryum filtre motoru. Sessiz çalışma, yüksek verimlilik.',
  345.00, 299.00, 18, 'jungle', 'akvaryum',
  ARRAY['/Balık Ürünleri ve Fiyatları - idefix/Balık Ürünleri ve Fiyatları - idefix/imgi_12_sobo-wp-3300-kafa-motoru-66c5314d9b734.jpg'],
  ARRAY['Akvaryum', 'Filtre', 'Motor'], ARRAY['Güçlü', 'Sessiz', 'Verimli'],
  true, 4.5, 178),

('p42', 'Kanki Pet Mini Akvaryum Mor Sehpa 30cm', 'kanki-mini-akvaryum-mor-30cm',
  'Dekoratif mini akvaryum seti. Renkli kapak ve şık tasarım.',
  459.00, 399.00, 15, 'jungle', 'akvaryum',
  ARRAY['/Balık Ürünleri ve Fiyatları - idefix/Balık Ürünleri ve Fiyatları - idefix/imgi_13_kanki-pet-kp3018-mini-akvaryum-mor-sehpa-30-cm-66d83e050e043.jpg'],
  ARRAY['Akvaryum', 'Mini', 'Dekoratif'], ARRAY['Mini', 'Sehpalı', 'Dekoratif'],
  true, 4.3, 98)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, price = EXCLUDED.price, discounted_price = EXCLUDED.discounted_price,
  stock = EXCLUDED.stock, images = EXCLUDED.images, tags = EXCLUDED.tags, features = EXCLUDED.features,
  is_active = EXCLUDED.is_active, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count;

-- =============================================
-- ÜRÜNLER Part 4: HAMSTER, TAVŞAN & ÖZEL IRK ÜRÜNLERİ (p43-p71)
-- =============================================
INSERT INTO products (id, name, slug, description, price, discounted_price, stock, brand_id, category_id, images, tags, features, is_active, rating, review_count) VALUES
('p43', 'Vitakraft Menu Premium Hamster Yemi 1000gr', 'vitakraft-hamster-yemi-1000gr',
  'Premium kalite hamster yemi. Dengeli beslenme, vitamin destekli.',
  189.00, 169.00, 40, 'jungle', 'kemirgen-yemi',
  ARRAY['/Hamster Ürünleri ve Fiyatları - idefix/Hamster Ürünleri ve Fiyatları - idefix/imgi_5_vitakraft-menu-premium-hamster-yemi-1000-gr-66c548dd7c94b.jpg'],
  ARRAY['Hamster', 'Yem', 'Premium'], ARRAY['Premium', 'Vitamin Destekli', '1kg'],
  true, 4.7, 289),

('p44', 'Garden Mix Kemirgenler İçin Kuru Yonca', 'garden-mix-kemirgen-kuru-yonca',
  'Hamster ve kemirgenler için doğal kuru yonca. Lif kaynağı.',
  65.00, 55.00, 60, 'jungle', 'kemirgen-yemi',
  ARRAY['/Hamster Ürünleri ve Fiyatları - idefix/Hamster Ürünleri ve Fiyatları - idefix/imgi_10_garden-mix-kemirgenler-icin-kuru-yonca-66e8f8f13784e.jpg'],
  ARRAY['Hamster', 'Yonca', 'Doğal'], ARRAY['Doğal', 'Lif Kaynağı', 'Sağlıklı'],
  true, 4.5, 167),

('p45', 'Eurogold QH-40711 Hamster Kafesi 34x23x29cm', 'eurogold-hamster-kafesi-40711',
  'Kompakt hamster kafesi. Çark ve aksesuar dahil.',
  459.00, 399.00, 22, 'jungle', 'kemirgen-kafes',
  ARRAY['/Hamster Ürünleri ve Fiyatları - idefix/Hamster Ürünleri ve Fiyatları - idefix/imgi_12_eurogold-qh-40711-hamster-kafesi-34x23x29-olculerinde-66c3b1980681c.jpg'],
  ARRAY['Hamster', 'Kafes'], ARRAY['Çark Dahil', 'Kompakt', 'Kolay Temizlik'],
  true, 4.4, 145),

('p46', 'Dayang Aksesuarlı Hamster Kafesi Renkli 35x26x23cm', 'dayang-aksesuarli-hamster-kafesi',
  'Renkli ve eğlenceli hamster kafesi. Tüm aksesuarlar dahil.',
  529.00, 459.00, 18, 'jungle', 'kemirgen-kafes',
  ARRAY['/Hamster Ürünleri ve Fiyatları - idefix/Hamster Ürünleri ve Fiyatları - idefix/imgi_15_dayang-aksesuarli-hamster-kafesi-renkli-35x26x23-cm-677d14c7a9516.jpg'],
  ARRAY['Hamster', 'Kafes', 'Aksesuarlı'], ARRAY['Aksesuarlı', 'Renkli', 'Eğlenceli'],
  true, 4.6, 112),

('p47', 'Hamster Banyosu Kumu Sinsilla 6kg 20Lt', 'hamster-banyo-kumu-6kg',
  'Hamster ve kemirgenler için özel banyo kumu. Hijyenik ve doğal.',
  189.00, 165.00, 35, 'jungle', 'kemirgen-yemi',
  ARRAY['/Hamster Ürünleri ve Fiyatları - idefix/Hamster Ürünleri ve Fiyatları - idefix/imgi_6_hamster-banyosu-kumu-sinsilla-gerbils-chinchilla-fare-degus-icin-banyo-veya-lazimlik-kumu-6-kg-20-lt-68cccbe8a2c40.jpg'],
  ARRAY['Hamster', 'Banyo Kumu', 'Hijyen'], ARRAY['6kg', 'Hijyenik', 'Doğal'],
  true, 4.3, 98),

('p48', 'Vitakraft Menu Rabbit Tavşan Yemi 1000gr', 'vitakraft-tavsan-yemi-1000gr',
  'Premium tavşan yemi. Dengeli vitamin ve mineral içeriği.',
  195.00, 175.00, 38, 'jungle', 'kemirgen-yemi',
  ARRAY['/Tavşan Ürünleri ve Fiyatları - idefix/Tavşan Ürünleri ve Fiyatları - idefix/imgi_10_vitakraft-menu-rabbit-tavsan-yemi-1000-gr-66c548dd60f37.jpg'],
  ARRAY['Tavşan', 'Yem', 'Premium'], ARRAY['Premium', 'Vitamin Zengin', '1kg'],
  true, 4.8, 234),

('p49', 'Orijin Tavşan Kafesi 45x32x31cm', 'orijin-tavsan-kafesi-45x32x31',
  'Geniş tavşan kafesi. Rahat yaşam alanı ve kolay erişim.',
  689.00, 599.00, 14, 'jungle', 'kemirgen-kafes',
  ARRAY['/Tavşan Ürünleri ve Fiyatları - idefix/Tavşan Ürünleri ve Fiyatları - idefix/imgi_11_orijin-tavsan-kafesi-45x32x31-cm-66c548e8a467f.jpg'],
  ARRAY['Tavşan', 'Kafes'], ARRAY['Geniş', 'Kolay Erişim', 'Dayanıklı'],
  true, 4.5, 89),

('p50', 'Mandu Ahşap Tavşan Evi Büyük Boy', 'mandu-ahsap-tavsan-evi-buyuk',
  'Doğal ahşap tavşan evi. Sıcak ve rahat yaşam alanı.',
  459.00, 399.00, 20, 'jungle', 'kemirgen-kafes',
  ARRAY['/Tavşan Ürünleri ve Fiyatları - idefix/Tavşan Ürünleri ve Fiyatları - idefix/imgi_15_mandu-ahsap-tavsan-evi-buyuk-boy-66ba23ec4fffe.jpg'],
  ARRAY['Tavşan', 'Ev', 'Ahşap'], ARRAY['Ahşap', 'Büyük Boy', 'Doğal'],
  true, 4.7, 156),

('p51', 'Quik Kuru Yonca Kemirgen Otu 350gr', 'quik-kuru-yonca-kemirgen-350gr',
  'Tavşan ve kemirgenler için kuru yonca. Lif ve vitamin kaynağı.',
  55.00, 45.00, 75, 'jungle', 'kemirgen-yemi',
  ARRAY['/Tavşan Ürünleri ve Fiyatları - idefix/Tavşan Ürünleri ve Fiyatları - idefix/imgi_12_quik-kuru-yonca-kemirgen-otu-350-gr-167-66bbc7de54225.jpg'],
  ARRAY['Tavşan', 'Yonca', 'Doğal'], ARRAY['Kuru Yonca', 'Lif Kaynağı', '350gr'],
  true, 4.4, 198),

('p52', 'Zampa Pedro Tavşan ve Guinea Pig Kafesi 69x44.5x35.5cm', 'zampa-pedro-tavsan-kafesi',
  'Geniş tavşan ve guinea pig kafesi. Premium kalite, dayanıklı yapı.',
  1290.00, 1099.00, 10, 'jungle', 'kemirgen-kafes',
  ARRAY['/Tavşan Ürünleri ve Fiyatları - idefix/Tavşan Ürünleri ve Fiyatları - idefix/imgi_25_zampa-pedro-tavsan-ve-guinea-pig-kafesi-69x445x355-cm-693a40c74a249.png'],
  ARRAY['Tavşan', 'Guinea Pig', 'Kafes'], ARRAY['Geniş', 'Premium', 'Dayanıklı'],
  true, 4.6, 67),

-- ÖZEL IRK KÖPEK MAMALARI
('p53', 'Royal Canin Cavalier King Charles Adult 1.5kg', 'royal-canin-cavalier-adult-1-5kg',
  'Cavalier King Charles ırkı için özel formül. Kalp sağlığını destekler.',
  845.00, 749.00, 22, 'royal-canin', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_001.jpg'],
  ARRAY['Özel Irk', 'Premium', 'Cavalier'], ARRAY['Kalp Sağlığı', 'Parlak Tüy', 'Özel Irk'],
  true, 4.9, 187),

('p54', 'Royal Canin Chihuahua Adult 1.5kg', 'royal-canin-chihuahua-adult-1-5kg',
  'Chihuahua ırkı için özel granül boyutu. Küçük çeneler için ideal.',
  795.00, 699.00, 28, 'royal-canin', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_003.jpg'],
  ARRAY['Özel Irk', 'Premium', 'Chihuahua'], ARRAY['Mini Granül', 'Yüksek Enerji', 'Özel Irk'],
  true, 4.8, 234),

('p55', 'Royal Canin Pug Adult 1.5kg', 'royal-canin-pug-adult-1-5kg',
  'Pug ırkı için kilo kontrolü formülü. Solunum ve sindirim sağlığı.',
  825.00, 729.00, 20, 'royal-canin', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_005.jpg'],
  ARRAY['Özel Irk', 'Premium', 'Pug'], ARRAY['Kilo Kontrolü', 'Solunum Desteği', 'Özel Irk'],
  true, 4.7, 198),

('p56', 'Royal Canin Shih Tzu Adult 1.5kg', 'royal-canin-shih-tzu-adult-1-5kg',
  'Shih Tzu ırkı için tüy bakımı formülü. Uzun tüyler için özel besinler.',
  815.00, 719.00, 24, 'royal-canin', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_007.jpg'],
  ARRAY['Özel Irk', 'Premium', 'Shih Tzu'], ARRAY['Tüy Bakımı', 'Omega Yağları', 'Özel Irk'],
  true, 4.9, 156),

('p57', 'Royal Canin Yorkshire Terrier Adult 1.5kg', 'royal-canin-yorkshire-adult-1-5kg',
  'Yorkshire Terrier için ipeksi tüy formülü. Biyotin ve EPA-DHA destekli.',
  835.00, 739.00, 26, 'royal-canin', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_009.jpg'],
  ARRAY['Özel Irk', 'Premium', 'Yorkshire'], ARRAY['İpeksi Tüy', 'Biyotin', 'Özel Irk'],
  true, 4.8, 289),

('p58', 'Acana Small Breed Tahılsız Mama 1.8kg', 'acana-small-breed-1-8kg',
  'Küçük ırk köpekler için biyolojik olarak uygun, tahılsız formül.',
  1390.00, 1249.00, 15, 'acana', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_011.jpg'],
  ARRAY['Tahılsız', 'Premium', 'Küçük Irk'], ARRAY['%70 Et', 'Tahılsız', 'Biyolojik'],
  true, 5.0, 134),

('p59', 'Wanpy Tavuklu Köpek Ödül Bisküvisi 100gr', 'wanpy-tavuk-biskuvi-100gr',
  'Gerçek tavuk etiyle hazırlanan lezzetli ödül bisküvisi. Eğitim için ideal.',
  89.00, 75.00, 85, 'wanpy', 'kopek-odul',
  ARRAY['/products/kopek/mama/kopek_mama_019.jpg'],
  ARRAY['Ödül', 'Tavuklu', 'Eğitim'], ARRAY['Gerçek Tavuk', 'Eğitim', 'Lezzetli'],
  true, 4.7, 456),

('p60', 'Schesir Jölede Tavuk Fileto Köpek Konservesi 150gr', 'schesir-jole-tavuk-150gr',
  'Doğal jöle içinde lezzetli tavuk filetosu. Katkısız, saf protein.',
  69.00, 59.00, 60, 'schesir', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_053.jpg'],
  ARRAY['Konserve', 'Doğal', 'Tavuklu'], ARRAY['Doğal Jöle', 'Saf Protein', 'Katkısız'],
  true, 4.8, 312),

('p61', 'Hill''s Science Plan Küçük Irk Yetişkin 3kg', 'hills-small-adult-3kg',
  'Küçük ırk yetişkin köpekler için bilimsel formül. Sindirim ve enerji dengesi.',
  890.00, 799.00, 32, 'hills', 'kopek-mamasi',
  ARRAY['/products/kopek/mama/kopek_mama_220.jpg'],
  ARRAY['Bilimsel', 'Küçük Irk', 'Yetişkin'], ARRAY['Sindirim Sağlığı', 'Enerji Dengesi'],
  true, 4.8, 276),

('p62', 'Royal Canin British Shorthair Adult 10kg', 'royal-canin-british-shorthair-10kg',
  'British Shorthair ırkı için özel formül. Kas yapısı ve kalp sağlığını destekler.',
  2890.00, 2549.00, 12, 'royal-canin', 'kedi-mamasi',
  ARRAY['/products/kedi/mama/kedi_mama_001.jpg'],
  ARRAY['Özel Irk', 'Premium', 'British Shorthair'], ARRAY['Kas Yapısı', 'Kalp Sağlığı'],
  true, 4.9, 187),

('p63', 'Hill''s Science Plan Kitten Healthy Development 3kg', 'hills-kitten-3kg',
  'Yavru kediler için beyin ve görme gelişimini destekleyen bilimsel formül.',
  890.00, 779.00, 28, 'hills', 'kedi-mamasi',
  ARRAY['/products/kedi/mama/kedi_mama_014.jpg'],
  ARRAY['Yavru', 'Bilimsel', 'Gelişim'], ARRAY['DHA', 'Beyin Gelişimi', 'Bağışıklık'],
  true, 4.8, 234),

('p64', 'Hill''s Science Plan Adult Optimal Care 10kg', 'hills-adult-optimal-10kg',
  'Yetişkin kediler için optimal beslenme. Parlak tüy ve sağlıklı sindirim.',
  2450.00, 2199.00, 18, 'hills', 'kedi-mamasi',
  ARRAY['/products/kedi/mama/kedi_mama_016.jpg'],
  ARRAY['Yetişkin', 'Optimal', 'Bilimsel'], ARRAY['Parlak Tüy', 'Sindirim Sağlığı'],
  true, 4.9, 412),

('p65', 'Pro Plan Sterilised Hindili Kedi Maması 10kg', 'proplan-sterilised-hindi-10kg',
  'Kısırlaştırılmış kediler için hindi etli formül. Kilo kontrolü ve böbrek sağlığı.',
  2290.00, 1999.00, 22, 'proplan', 'kedi-mamasi',
  ARRAY['/products/kedi/mama/kedi_mama_037.jpg'],
  ARRAY['Kısırlaştırılmış', 'Hindi', 'Böbrek'], ARRAY['OptiRenal', 'Kilo Kontrolü', 'Hindi Eti'],
  true, 4.7, 356),

('p66', 'Pro Plan Elegant Somon Deri ve Tüy Bakım 10kg', 'proplan-elegant-somon-10kg',
  'Hassas deri ve tüyler için özel somon formülü. Omega yağları ve çinko.',
  2390.00, 2099.00, 16, 'proplan', 'kedi-mamasi',
  ARRAY['/products/kedi/mama/kedi_mama_039.jpg'],
  ARRAY['Deri Bakımı', 'Somon', 'Tüy Sağlığı'], ARRAY['Omega 3-6', 'Parlak Tüy', 'Somon'],
  true, 4.8, 278),

('p67', 'Led Lambalı Bombeli Akvaryum Set 30x16x25cm', 'led-bombeli-akvaryum-30cm',
  'Şık bombeli tasarım, LED aydınlatma dahil. Başlangıç için ideal set.',
  589.00, 499.00, 20, 'jungle', 'akvaryum',
  ARRAY['/products/akvaryum/tank/akvaryum_001.jpg'],
  ARRAY['Akvaryum', 'LED', 'Başlangıç'], ARRAY['LED Işık', 'Bombeli Cam', 'Set'],
  true, 4.5, 189),

('p68', 'Filtreli ve Işıklı Nano Akvaryum 50x15x36cm', 'nano-akvaryum-filtreli-50cm',
  'Modern nano akvaryum. Dahili filtre sistemi ve dokunmatik LED aydınlatma.',
  1290.00, 1099.00, 12, 'jungle', 'akvaryum',
  ARRAY['/products/akvaryum/tank/akvaryum_005.jpg'],
  ARRAY['Nano', 'Filtreli', 'Modern'], ARRAY['Dahili Filtre', 'Dokunmatik LED', 'Nano'],
  true, 4.7, 134),

('p69', 'Marina Beta Akvaryum Seti EZ Care 2.5Lt', 'marina-beta-ez-care-2-5lt',
  'Beta balıkları için özel tasarım. Kolay su değişimi ve bakım sistemi.',
  389.00, 329.00, 35, 'jungle', 'akvaryum',
  ARRAY['/products/akvaryum/tank/akvaryum_018.jpg'],
  ARRAY['Beta', 'Kolay Bakım', 'Mini'], ARRAY['EZ Care', 'Kolay Su Değişimi', 'Beta'],
  true, 4.6, 267),

('p70', 'Renkli Mini Fanus Akvaryum 4Lt', 'renkli-mini-fanus-4lt',
  'Dekoratif renkli kapak seçenekleri. Masaüstü için ideal mini akvaryum.',
  289.00, 249.00, 45, 'jungle', 'akvaryum',
  ARRAY['/products/akvaryum/tank/akvaryum_007.jpg'],
  ARRAY['Mini', 'Dekoratif', 'Renkli'], ARRAY['4 Litre', 'Renkli Kapak', 'Masaüstü'],
  true, 4.4, 198),

('p71', 'Dijital Kaplumbağa Akvaryumu Filtreli', 'dijital-kaplumbaga-akvaryumu',
  'Su kaplumbağaları için özel tasarım. Filtre sistemi ve günesleme platformu dahil.',
  789.00, 679.00, 18, 'jungle', 'akvaryum',
  ARRAY['/products/akvaryum/tank/akvaryum_023.jpg'],
  ARRAY['Kaplumbağa', 'Filtreli', 'Platform'], ARRAY['Kaplumbağa', 'Platform', 'Filtre'],
  true, 4.6, 145)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, price = EXCLUDED.price, discounted_price = EXCLUDED.discounted_price,
  stock = EXCLUDED.stock, images = EXCLUDED.images, tags = EXCLUDED.tags, features = EXCLUDED.features,
  is_active = EXCLUDED.is_active, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count;

-- =============================================
-- VERİFİKASYON
-- =============================================
SELECT 'brands' as table_name, COUNT(*) as count FROM brands
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products;
