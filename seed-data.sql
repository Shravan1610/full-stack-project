-- ============================================================================
-- SEED DATA FOR STYLEHUB E-COMMERCE
-- Run this in Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/ribcvlvrxcadztnxqhce/sql/new
-- ============================================================================

-- Clear existing data (optional - uncomment if you want to start fresh)
-- TRUNCATE categories, products, product_images, product_variants CASCADE;

-- ============================================================================
-- SEED CATEGORIES
-- ============================================================================

INSERT INTO categories (name, slug, description, display_order, is_active)
VALUES
  ('Men', 'men', 'Men''s fashion and accessories', 1, true),
  ('Women', 'women', 'Women''s fashion and accessories', 2, true),
  ('Kids', 'kids', 'Children''s clothing', 3, true),
  ('Accessories', 'accessories', 'Fashion accessories', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED PRODUCTS
-- ============================================================================

INSERT INTO products (name, slug, description, category_id, base_price, compare_at_price, is_featured, is_active, sku)
SELECT
  'Classic Cotton T-Shirt',
  'classic-cotton-tshirt',
  'Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
  (SELECT id FROM categories WHERE slug = 'men'),
  29.99,
  39.99,
  true,
  true,
  'TSHIRT-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'classic-cotton-tshirt');

INSERT INTO products (name, slug, description, category_id, base_price, compare_at_price, is_featured, is_active, sku)
SELECT
  'Slim Fit Denim Jeans',
  'slim-fit-denim-jeans',
  'Stylish slim fit jeans made from premium denim. Comfortable and durable.',
  (SELECT id FROM categories WHERE slug = 'men'),
  79.99,
  99.99,
  true,
  true,
  'JEANS-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'slim-fit-denim-jeans');

INSERT INTO products (name, slug, description, category_id, base_price, is_featured, is_active, sku)
SELECT
  'Casual Button-Up Shirt',
  'casual-button-up-shirt',
  'Versatile button-up shirt perfect for both casual and semi-formal occasions.',
  (SELECT id FROM categories WHERE slug = 'men'),
  49.99,
  true,
  true,
  'SHIRT-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'casual-button-up-shirt');

INSERT INTO products (name, slug, description, category_id, base_price, compare_at_price, is_featured, is_active, sku)
SELECT
  'Summer Floral Dress',
  'summer-floral-dress',
  'Beautiful floral dress perfect for summer days and special occasions.',
  (SELECT id FROM categories WHERE slug = 'women'),
  89.99,
  119.99,
  true,
  true,
  'DRESS-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'summer-floral-dress');

INSERT INTO products (name, slug, description, category_id, base_price, is_featured, is_active, sku)
SELECT
  'High-Waist Yoga Pants',
  'high-waist-yoga-pants',
  'Comfortable and stretchy yoga pants with moisture-wicking fabric.',
  (SELECT id FROM categories WHERE slug = 'women'),
  59.99,
  true,
  true,
  'YOGA-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'high-waist-yoga-pants');

INSERT INTO products (name, slug, description, category_id, base_price, compare_at_price, is_featured, is_active, sku)
SELECT
  'Elegant Silk Blouse',
  'elegant-silk-blouse',
  'Luxurious silk blouse with a sophisticated design.',
  (SELECT id FROM categories WHERE slug = 'women'),
  129.99,
  159.99,
  false,
  true,
  'BLOUSE-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'elegant-silk-blouse');

INSERT INTO products (name, slug, description, category_id, base_price, compare_at_price, is_featured, is_active, sku)
SELECT
  'Leather Crossbody Bag',
  'leather-crossbody-bag',
  'Premium leather crossbody bag with adjustable strap.',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  149.99,
  199.99,
  true,
  true,
  'BAG-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'leather-crossbody-bag');

INSERT INTO products (name, slug, description, category_id, base_price, is_featured, is_active, sku)
SELECT
  'Classic Aviator Sunglasses',
  'classic-aviator-sunglasses',
  'Timeless aviator sunglasses with UV protection.',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  89.99,
  true,
  true,
  'SUNGLASSES-001'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'classic-aviator-sunglasses');

-- ============================================================================
-- SEED PRODUCT IMAGES
-- ============================================================================

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT
  p.id,
  'https://placehold.co/600x600/e2e8f0/1e293b?text=' || REPLACE(p.name, ' ', '+'),
  p.name,
  0,
  true
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- ============================================================================
-- SEED PRODUCT VARIANTS
-- ============================================================================

INSERT INTO product_variants (product_id, sku, size, color, stock_quantity, low_stock_threshold, price_adjustment, is_active)
SELECT
  p.id,
  p.sku || '-' || sizes.size || '-' || UPPER(SUBSTRING(colors.color, 1, 3)),
  sizes.size,
  colors.color,
  FLOOR(RANDOM() * 50 + 10)::int, -- Random stock between 10-60
  10,
  0,
  true
FROM products p
CROSS JOIN (VALUES ('S'), ('M'), ('L'), ('XL')) AS sizes(size)
CROSS JOIN (VALUES ('Black'), ('White'), ('Navy'), ('Gray')) AS colors(color)
WHERE NOT EXISTS (
  SELECT 1 FROM product_variants pv 
  WHERE pv.product_id = p.id 
    AND pv.size = sizes.size 
    AND pv.color = colors.color
);

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT 'Data seeded successfully!' as message;

SELECT
  (SELECT COUNT(*) FROM categories) as categories_count,
  (SELECT COUNT(*) FROM products) as products_count,
  (SELECT COUNT(*) FROM product_images) as images_count,
  (SELECT COUNT(*) FROM product_variants) as variants_count;

