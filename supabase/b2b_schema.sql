-- =============================================
-- B2B Bayi Portal - Veritabanı Şeması
-- =============================================

-- Enable UUID extension (already exists, safe to re-run)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Profiles tablosuna role alanı ekleme
-- =============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer'
  CHECK (role IN ('customer', 'dealer', 'admin'));

-- =============================================
-- BAYİLER (Dealers)
-- =============================================
CREATE TABLE IF NOT EXISTS dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  tax_number TEXT NOT NULL,
  tax_office TEXT,
  company_address TEXT,
  company_phone TEXT,
  city TEXT,
  district TEXT,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealers_user ON dealers(user_id);
CREATE INDEX IF NOT EXISTS idx_dealers_status ON dealers(status);

-- =============================================
-- BAYİ SİPARİŞLERİ (Dealer Orders)
-- =============================================
CREATE TABLE IF NOT EXISTS dealer_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Beklemede' CHECK (status IN ('Beklemede', 'Onaylandı', 'Hazırlanıyor', 'Kargolandı', 'Teslim Edildi', 'İptal Edildi')),
  total_price DECIMAL(10,2) NOT NULL,
  discount_applied DECIMAL(5,2) DEFAULT 0,
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealer_orders_dealer ON dealer_orders(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_orders_status ON dealer_orders(status);

-- =============================================
-- BAYİ SİPARİŞ KALEMLERİ (Dealer Order Items)
-- =============================================
CREATE TABLE IF NOT EXISTS dealer_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES dealer_orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  discounted_unit_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealer_order_items_order ON dealer_order_items(order_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_order_items ENABLE ROW LEVEL SECURITY;

-- Dealers: users can view their own dealer profile
CREATE POLICY "Dealers can view own profile" ON dealers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Dealers can update own profile" ON dealers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can apply as dealer" ON dealers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin full access to dealers
CREATE POLICY "Admin full access dealers" ON dealers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Dealer Orders: dealers can view their own orders
CREATE POLICY "Dealers can view own orders" ON dealer_orders
  FOR SELECT USING (
    dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
  );

CREATE POLICY "Dealers can create orders" ON dealer_orders
  FOR INSERT WITH CHECK (
    dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid() AND status = 'approved')
  );

-- Admin full access to dealer orders
CREATE POLICY "Admin full access dealer_orders" ON dealer_orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Dealer Order Items: visible if parent order is visible
CREATE POLICY "Dealers can view own order items" ON dealer_order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM dealer_orders WHERE dealer_id IN (
        SELECT id FROM dealers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Dealers can insert order items" ON dealer_order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM dealer_orders WHERE dealer_id IN (
        SELECT id FROM dealers WHERE user_id = auth.uid() AND status = 'approved'
      )
    )
  );

-- Admin full access to dealer order items
CREATE POLICY "Admin full access dealer_order_items" ON dealer_order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- TRIGGERS
-- =============================================

-- Update dealer updated_at
CREATE OR REPLACE FUNCTION update_dealer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dealers_updated_at
  BEFORE UPDATE ON dealers
  FOR EACH ROW EXECUTE FUNCTION update_dealer_updated_at();

CREATE TRIGGER update_dealer_orders_updated_at
  BEFORE UPDATE ON dealer_orders
  FOR EACH ROW EXECUTE FUNCTION update_dealer_updated_at();

-- When dealer is approved, update profile role
CREATE OR REPLACE FUNCTION handle_dealer_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    UPDATE profiles SET role = 'dealer' WHERE id = NEW.user_id;
  END IF;
  IF NEW.status IN ('rejected', 'suspended') AND OLD.status = 'approved' THEN
    UPDATE profiles SET role = 'customer' WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_dealer_status_change
  AFTER UPDATE ON dealers
  FOR EACH ROW EXECUTE FUNCTION handle_dealer_approval();
