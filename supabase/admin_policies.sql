-- =========================================
-- ADMIN PERMISSIONS FIX
-- Run this script in the Supabase SQL Editor
-- to enable Admin Product/Brand/Category Management
-- =========================================

-- 1. Enable Product Management
CREATE POLICY "Admins can insert products" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update products" 
ON products FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete products" 
ON products FOR DELETE 
TO authenticated 
USING (true);

-- 2. Enable Brand Management
CREATE POLICY "Admins can insert brands" 
ON brands FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update brands" 
ON brands FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete brands" 
ON brands FOR DELETE 
TO authenticated 
USING (true);

-- 3. Enable Category Management
CREATE POLICY "Admins can insert categories" 
ON categories FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update categories" 
ON categories FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete categories" 
ON categories FOR DELETE 
TO authenticated 
USING (true);

-- 4. Enable Storage (Images)
-- Allow authenticated users to upload to 'products' and 'brands' buckets
-- Note: Buckets must be created first if they don't exist.

-- Policy for 'products' bucket
CREATE POLICY "Admins can upload product images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Admins can update product images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'products');

CREATE POLICY "Admins can delete product images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'products');

-- Policy for 'brands' bucket
CREATE POLICY "Admins can upload brand images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'brands');
