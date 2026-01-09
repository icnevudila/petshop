// Run this script to generate complete SQL seed data from constants.ts
// Usage: npx ts-node supabase/generate_full_seed.ts > supabase/full_seed_data.sql

import { PRODUCTS, BRANDS, CATEGORY_DATA } from '../constants';

// Helper to escape SQL strings
function sqlEscape(str: string | null | undefined): string {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

function arrayToSql(arr: string[] | null | undefined): string {
    if (!arr || arr.length === 0) return 'NULL';
    return `ARRAY[${arr.map(s => sqlEscape(s)).join(', ')}]`;
}

console.log(`-- =============================================
-- PetShop Full Seed Data - Generated from constants.ts
-- Run this in Supabase SQL Editor
-- Generated: ${new Date().toISOString()}
-- =============================================

-- Delete existing data (optional - uncomment if needed)
-- DELETE FROM products;
-- DELETE FROM categories WHERE parent_id IS NOT NULL;
-- DELETE FROM categories;
-- DELETE FROM brands;

`);

// BRANDS
console.log('-- MARKALAR (Brands)');
console.log('INSERT INTO brands (id, name, slug, logo_url) VALUES');
const brandRows = BRANDS.map((b, i) =>
    `  (${sqlEscape(b.id)}, ${sqlEscape(b.name)}, ${sqlEscape(b.slug)}, ${sqlEscape(b.logo_url)})${i < BRANDS.length - 1 ? ',' : ''}`
);
console.log(brandRows.join('\n'));
console.log(`ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, logo_url = EXCLUDED.logo_url;\n`);

// CATEGORIES - Parent first
const parentCategories = CATEGORY_DATA.filter(c => !c.parent_id);
const childCategories = CATEGORY_DATA.filter(c => c.parent_id);

console.log('-- KATEGORİLER (Categories) - Ana Kategoriler');
console.log('INSERT INTO categories (id, name, slug, parent_id) VALUES');
const parentRows = parentCategories.map((c, i) =>
    `  (${sqlEscape(c.id)}, ${sqlEscape(c.name)}, ${sqlEscape(c.slug)}, NULL)${i < parentCategories.length - 1 ? ',' : ''}`
);
console.log(parentRows.join('\n'));
console.log(`ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n`);

console.log('-- Alt Kategoriler');
console.log('INSERT INTO categories (id, name, slug, parent_id) VALUES');
const childRows = childCategories.map((c, i) =>
    `  (${sqlEscape(c.id)}, ${sqlEscape(c.name)}, ${sqlEscape(c.slug)}, ${sqlEscape(c.parent_id)})${i < childCategories.length - 1 ? ',' : ''}`
);
console.log(childRows.join('\n'));
console.log(`ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n`);

// PRODUCTS
console.log('-- ÜRÜNLER (Products)');
console.log(`INSERT INTO products (id, name, slug, description, price, discounted_price, stock, brand_id, category_id, images, tags, features, is_active, rating, review_count) VALUES`);

const productRows = PRODUCTS.map((p, i) => {
    const discount = p.discounted_price ? p.discounted_price.toFixed(2) : 'NULL';
    return `  (${sqlEscape(p.id)}, ${sqlEscape(p.name)}, ${sqlEscape(p.slug)}, 
   ${sqlEscape(p.description)},
   ${p.price.toFixed(2)}, ${discount}, ${p.stock}, ${sqlEscape(p.brand_id)}, ${sqlEscape(p.category_id)},
   ${arrayToSql(p.images)},
   ${arrayToSql(p.tags)},
   ${arrayToSql(p.features)},
   ${p.is_active}, ${p.rating || 0}, ${p.review_count || 0})${i < PRODUCTS.length - 1 ? ',' : ''}`;
});
console.log(productRows.join('\n'));
console.log(`ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  discounted_price = EXCLUDED.discounted_price,
  stock = EXCLUDED.stock,
  images = EXCLUDED.images,
  tags = EXCLUDED.tags,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count;\n`);

console.log(`
-- Verify data
SELECT 'brands' as table_name, COUNT(*) as count FROM brands
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products;
`);

console.log(`-- Total products: ${PRODUCTS.length}`);
console.log(`-- Total brands: ${BRANDS.length}`);
console.log(`-- Total categories: ${CATEGORY_DATA.length}`);
