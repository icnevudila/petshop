
-- =============================================
-- SITE AYARLARI (Site Settings)
-- =============================================

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton Pattern: Only one row allowed
  site_name TEXT DEFAULT 'PatiDükkan',
  logo_url TEXT DEFAULT '/logopng.png',
  phone TEXT DEFAULT '0850 123 45 67',
  email TEXT DEFAULT 'info@patidukkan.com',
  address TEXT DEFAULT 'İstanbul, Türkiye',
  top_bar_message TEXT DEFAULT 'Mobil Uygulamaya Özel %15 Ek İndirim',
  social_facebook TEXT DEFAULT 'https://facebook.com/patidukkan',
  social_instagram TEXT DEFAULT 'https://instagram.com/patidukkan',
  social_twitter TEXT DEFAULT 'https://twitter.com/patidukkan',
  social_youtube TEXT DEFAULT 'https://youtube.com/patidukkan',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize with default row if not exists
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read settings
CREATE POLICY "Site settings are viewable by everyone" 
ON site_settings FOR SELECT USING (true);

-- Only authenticated users (admins) can update settings
-- Ideally restricted to specific role, but for now auth user is enough
CREATE POLICY "Authenticated users can update site settings" 
ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');

-- Additional trigger to update updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
