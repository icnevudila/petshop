-- =============================================
-- PetShop Seed Data - Run after schema.sql
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
ON CONFLICT (id) DO NOTHING;

-- KATEGORİLER (Categories) - Ana Kategoriler
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ('kedi', 'Kedi', 'kedi', NULL),
  ('kopek', 'Köpek', 'kopek', NULL),
  ('kus', 'Kuş', 'kus', NULL),
  ('balik', 'Balık', 'balik', NULL),
  ('kemirgen', 'Kemirgen', 'kemirgen', NULL)
ON CONFLICT (id) DO NOTHING;

-- Alt Kategoriler - Kedi
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
ON CONFLICT (id) DO NOTHING;

-- Alt Kategoriler - Köpek
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
ON CONFLICT (id) DO NOTHING;

-- Alt Kategoriler - Kuş, Balık, Kemirgen
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ('kus-yemi', 'Kuş Yemleri', 'kus-yemi', 'kus'),
  ('kus-kafes', 'Kuş Kafesleri', 'kus-kafes', 'kus'),
  ('kus-aksesuar', 'Kuş Aksesuarları', 'kus-aksesuar', 'kus'),
  ('balik-yemi', 'Balık Yemleri', 'balik-yemi', 'balik'),
  ('akvaryum', 'Akvaryum Ürünleri', 'akvaryum', 'balik'),
  ('kemirgen-yemi', 'Kemirgen Yemleri', 'kemirgen-yemi', 'kemirgen'),
  ('kemirgen-kafes', 'Kemirgen Kafesleri', 'kemirgen-kafes', 'kemirgen')
ON CONFLICT (id) DO NOTHING;

-- ÜRÜNLER (Products) - İlk 10 ürün örneği
INSERT INTO products (id, name, slug, description, price, discounted_price, stock, brand_id, category_id, images, tags, features, is_active, rating, review_count) VALUES
  ('p1', 'Royal Canin Mother & Babycat Yavru Kedi Maması 2kg', 'royal-canin-mother-babycat-2kg', 
   'Anne ve yavru kediler için özel formül. Bağışıklık sistemini destekler, kolay sindirilebilir yapısıyla hassas midelere uygundur.',
   945.00, 850.00, 25, 'royal-canin', 'kedi-mamasi',
   ARRAY['/trendyol kedi maması/1_org_zoom (1).jpg', '/trendyol kedi maması/1_org_zoom (2).jpg'],
   ARRAY['Yavru', 'Premium', 'Bağışıklık'],
   ARRAY['Yüksek Protein', 'Kolay Sindirim', 'DHA Destekli'],
   true, 4.9, 512),

  ('p2', 'Royal Canin Indoor Ev Kedisi Maması 4kg', 'royal-canin-indoor-4kg',
   'Ev içinde yaşayan kediler için özel formül. Kilo kontrolü sağlar, tüy yumağı oluşumunu azaltır.',
   1250.00, 1099.00, 30, 'royal-canin', 'kedi-mamasi',
   ARRAY['/trendyol kedi maması/1_org_zoom (3).jpg', '/trendyol kedi maması/1_org_zoom (4).jpg'],
   ARRAY['Indoor', 'Kilo Kontrolü'],
   ARRAY['Düşük Kalori', 'Tüy Yumağı Kontrolü', 'L-Karnitin'],
   true, 4.8, 328),

  ('p3', 'Hill''s Science Plan Kısırlaştırılmış Kedi Maması 3kg', 'hills-sterile-cat-3kg',
   'Kısırlaştırılmış kediler için bilimsel formül. Kilo kontrolü ve idrar yolu sağlığını destekler.',
   1150.00, 990.00, 45, 'hills', 'kedi-mamasi',
   ARRAY['/trendyol kedi maması/1_org_zoom (5).jpg', '/trendyol kedi maması/1_org_zoom (6).jpg'],
   ARRAY['Kısırlaştırılmış', 'Kilo Kontrolü'],
   ARRAY['L-Karnitin', 'Dengeli Mineral', 'Omega 3-6'],
   true, 4.9, 840),

  ('p4', 'N&D Prime Tavuklu Narlı Tahılsız Kedi Maması 1.5kg', 'nd-prime-tavuk-nar-1-5kg',
   'Doğal nar özleri ve serbest gezen tavuk etiyle hazırlanan tahılsız premium mama.',
   780.00, 699.00, 24, 'nd', 'kedi-mamasi',
   ARRAY['/trendyol kedi maması/1_org_zoom (7).jpg', '/trendyol kedi maması/1_org_zoom (8).jpg'],
   ARRAY['Tahılsız', 'Premium'],
   ARRAY['Tahılsız', 'Nar Özlü', 'Taze Et'],
   true, 4.8, 320),

  ('p5', 'Acana Wild Prairie Tahılsız Kedi Maması 1.8kg', 'acana-wild-prairie-1-8kg',
   'Biyolojik olarak uygun, çoklu protein kaynaklı tahılsız mama. Tavuk, hindi ve yumurta içerir.',
   1450.00, 1299.00, 18, 'acana', 'kedi-mamasi',
   ARRAY['/trendyol kedi maması/1_org_zoom (9).jpg', '/trendyol kedi maması/1_org_zoom (10).jpg'],
   ARRAY['Tahılsız', 'Premium', 'Çoklu Protein'],
   ARRAY['%70 Et', 'Kanada Üretim', 'WholePrey'],
   true, 5.0, 156),

  ('p11', 'Ever Clean Extra Strength Kokusuz Kedi Kumu 10L', 'ever-clean-extra-strength-10l',
   'Aktif karbon teknolojisi ile maksimum koku kontrolü. Topaklanan, toz kaldırmayan formül.',
   640.00, 549.00, 100, 'ever-clean', 'kedi-kumu',
   ARRAY['/trendyol kedi maması/1_org_zoom (26).jpg', '/trendyol kedi maması/1_org_zoom (27).jpg'],
   ARRAY['Kokusuz', 'Ekstra Güçlü'],
   ARRAY['Aktif Karbon', 'Sıfır Toz', '14 Gün Koku Kontrolü'],
   true, 5.0, 2100),

  ('p13', 'Royal Canin Medium Adult Yetişkin Köpek Maması 4kg', 'royal-canin-medium-adult-4kg',
   'Orta ırk yetişkin köpekler için optimal beslenme. Sindirim sağlığı ve ideal kilo.',
   890.00, 799.00, 28, 'royal-canin', 'kopek-mamasi',
   ARRAY['/Köpek Maması/royal elite yetişkin köpek maması.webp', '/trendyol köpek maması/1_org_zoom (1).jpg'],
   ARRAY['Orta Irk', 'Yetişkin'],
   ARRAY['Sindirim Sağlığı', 'Omega Yağları', 'Şekil Koruma'],
   true, 4.8, 623),

  ('p14', 'Pro Plan Medium Puppy Kuzulu Yavru Köpek Maması 3kg', 'proplan-medium-puppy-kuzu-3kg',
   'Yavru köpekler için OptiStart formülü. Beyin gelişimi ve güçlü bağışıklık.',
   890.00, NULL, 30, 'proplan', 'kopek-mamasi',
   ARRAY['/Köpek Maması/purelife puppy kuzulu yavru köpek maması.jpg', '/trendyol köpek maması/1_org_zoom (2).jpg'],
   ARRAY['Yavru', 'Kuzulu'],
   ARRAY['OptiStart', 'DHA', 'Kolostrum'],
   true, 4.7, 150),

  ('p15', 'Acana Grass-Fed Lamb Tahılsız Köpek Maması 2kg', 'acana-grassfed-lamb-2kg',
   'Sadece otla beslenen kuzu eti. Tek protein kaynaklı, hassas mideler için.',
   1350.00, 1200.00, 12, 'acana', 'kopek-mamasi',
   ARRAY['/trendyol köpek maması/1_org_zoom (3).jpg', '/trendyol köpek maması/1_org_zoom (4).jpg'],
   ARRAY['Tahılsız', 'Premium', 'Kuzulu'],
   ARRAY['Tek Protein', 'Hassas Sindirim', 'Kanada Üretim'],
   true, 5.0, 88),

  ('p16', 'Hill''s Science Plan Adult Tavuklu Köpek Maması 2.5kg', 'hills-adult-tavuk-2-5kg',
   'Yetişkin köpekler için bilimsel beslenme. Kas yapısı ve enerji dengesi.',
   780.00, 699.00, 22, 'hills', 'kopek-mamasi',
   ARRAY['/Köpek Maması/Hill''s Prescription Diet.webp', '/trendyol köpek maması/1_org_zoom (5).jpg'],
   ARRAY['Yetişkin', 'Tavuklu'],
   ARRAY['Yüksek Protein', 'Omega 6', 'Vitamin E'],
   true, 4.7, 334)
ON CONFLICT (id) DO NOTHING;

-- Verify data
SELECT 'brands' as tablo, COUNT(*) as adet FROM brands
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products;
