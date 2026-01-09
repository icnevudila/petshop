/**
 * Seed script to migrate existing products from constants.ts to Supabase
 * Run this once after setting up the database
 * 
 * Usage: npx ts-node supabase/seed.ts
 * Or copy/paste into Supabase SQL Editor
 */

import { PRODUCTS, BRANDS, CATEGORY_DATA } from '../constants';

// Generate INSERT statements for brands
export function generateBrandsInsert(): string {
    const values = BRANDS.map(brand =>
        `('${brand.id}', '${brand.name.replace(/'/g, "''")}', '${brand.slug}', '${brand.logo_url}')`
    ).join(',\n  ');

    return `
INSERT INTO brands (id, name, slug, logo_url) VALUES
  ${values}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  logo_url = EXCLUDED.logo_url;
`;
}

// Generate INSERT statements for categories
export function generateCategoriesInsert(): string {
    // First insert parent categories (parent_id is null)
    const parents = CATEGORY_DATA.filter(c => c.parent_id === null);
    const children = CATEGORY_DATA.filter(c => c.parent_id !== null);

    const parentValues = parents.map(cat =>
        `('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', NULL)`
    ).join(',\n  ');

    const childValues = children.map(cat =>
        `('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${cat.parent_id}')`
    ).join(',\n  ');

    return `
-- Insert parent categories first
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ${parentValues}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- Then insert child categories
INSERT INTO categories (id, name, slug, parent_id) VALUES
  ${childValues}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  parent_id = EXCLUDED.parent_id;
`;
}

// Generate INSERT statements for products
export function generateProductsInsert(): string {
    const values = PRODUCTS.map(product => {
        const images = `ARRAY[${product.images.map(img => `'${img}'`).join(', ')}]`;
        const tags = `ARRAY[${product.tags.map(tag => `'${tag.replace(/'/g, "''")}'`).join(', ')}]`;
        const features = `ARRAY[${product.features.map(f => `'${f.replace(/'/g, "''")}'`).join(', ')}]`;
        const discountedPrice = product.discounted_price ? product.discounted_price : 'NULL';

        return `(
    '${product.id}',
    '${product.name.replace(/'/g, "''")}',
    '${product.slug}',
    '${(product.description || '').replace(/'/g, "''")}',
    ${product.price},
    ${discountedPrice},
    ${product.stock},
    '${product.brand_id}',
    '${product.category_id}',
    ${images},
    ${tags},
    ${features},
    ${product.is_active},
    ${product.rating},
    ${product.review_count}
  )`;
    }).join(',\n');

    return `
INSERT INTO products (
  id, name, slug, description, price, discounted_price, stock,
  brand_id, category_id, images, tags, features, is_active, rating, review_count
) VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  discounted_price = EXCLUDED.discounted_price,
  stock = EXCLUDED.stock,
  brand_id = EXCLUDED.brand_id,
  category_id = EXCLUDED.category_id,
  images = EXCLUDED.images,
  tags = EXCLUDED.tags,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count;
`;
}

// Print all SQL statements
export function generateAllSeedSQL(): string {
    return `
-- =============================================
-- PetShop Seed Data
-- Run this after schema.sql
-- =============================================

${generateBrandsInsert()}

${generateCategoriesInsert()}

${generateProductsInsert()}

-- Verify data
SELECT 'Brands:' as table_name, COUNT(*) as count FROM brands
UNION ALL
SELECT 'Categories:', COUNT(*) FROM categories
UNION ALL
SELECT 'Products:', COUNT(*) FROM products;
`;
}

// If running directly
if (typeof require !== 'undefined' && require.main === module) {
    console.log(generateAllSeedSQL());
}
