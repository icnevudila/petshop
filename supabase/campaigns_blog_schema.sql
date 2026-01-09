
-- =============================================
-- KAMPANYALAR (Campaigns)
-- =============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  target_url TEXT,
  location TEXT CHECK (location IN ('slider', 'banner1', 'banner2', 'category', 'blog', 'promo')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  target_category_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BLOG YAZILARI (Blog Posts)
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  author TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Campaigns are viewable by everyone" ON campaigns FOR SELECT USING (is_active = true);
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (is_published = true);

-- Admin write access (For simplicity, allowing authenticated users to modify for now, can be restricted to admin role later)
CREATE POLICY "Authenticated users can modify campaigns" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can modify blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
