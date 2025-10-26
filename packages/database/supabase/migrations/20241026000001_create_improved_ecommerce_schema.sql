/*
  StyleHub E-Commerce Platform - Improved & Scalable Database Schema
  
  Improvements for scalability:
  - ENUMs for type safety and performance
  - Comprehensive indexes including composite and partial indexes
  - Soft deletes with archived_at timestamps
  - Full-text search indexes for products
  - Inventory reservation system for concurrent checkouts
  - Product reviews and ratings
  - Audit logging
  - Optimized RLS policies
  - UNIQUE constraints to prevent duplicates
  - Check constraints for data integrity
*/

-- ============================================================================
-- ENUM TYPES FOR TYPE SAFETY
-- ============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE address_type AS ENUM ('shipping', 'billing', 'both');
CREATE TYPE order_status AS ENUM (
  'pending', 
  'confirmed', 
  'processing', 
  'shipped', 
  'delivered', 
  'cancelled', 
  'refunded', 
  'failed'
);
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'customer' NOT NULL,
  phone text,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz
);

CREATE INDEX idx_profiles_email ON profiles(email) WHERE archived_at IS NULL;
CREATE INDEX idx_profiles_role ON profiles(role) WHERE is_active = true;
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id AND archived_at IS NULL)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 2. CATEGORIES TABLE
-- ============================================================================

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  display_order int DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz,
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE INDEX idx_categories_slug ON categories(slug) WHERE archived_at IS NULL;
CREATE INDEX idx_categories_parent_id ON categories(parent_id) WHERE is_active = true;
CREATE INDEX idx_categories_display_order ON categories(display_order) WHERE is_active = true;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (is_active = true AND archived_at IS NULL);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 3. PRODUCTS TABLE
-- ============================================================================

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  base_price decimal(10,2) NOT NULL CHECK (base_price >= 0),
  compare_at_price decimal(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= base_price),
  cost_per_item decimal(10,2) CHECK (cost_per_item IS NULL OR cost_per_item >= 0),
  is_featured boolean DEFAULT false NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  sku text UNIQUE,
  barcode text,
  weight decimal(10,2) CHECK (weight IS NULL OR weight >= 0),
  weight_unit text DEFAULT 'kg',
  meta_title text,
  meta_description text,
  search_vector tsvector,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz,
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_slug ON products(slug) WHERE archived_at IS NULL;
CREATE INDEX idx_products_category_id ON products(category_id) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true AND is_active = true;
CREATE INDEX idx_products_price ON products(base_price) WHERE is_active = true;
CREATE INDEX idx_products_created_at ON products(created_at DESC) WHERE is_active = true;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products viewable by everyone"
  ON products FOR SELECT
  TO authenticated, anon
  USING (is_active = true AND archived_at IS NULL);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 4. PRODUCT IMAGES TABLE
-- ============================================================================

CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  display_order int DEFAULT 0 NOT NULL,
  is_primary boolean DEFAULT false,
  width int,
  height int,
  created_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id, display_order) WHERE archived_at IS NULL;
CREATE INDEX idx_product_images_primary ON product_images(product_id) WHERE is_primary = true;

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images viewable by everyone"
  ON product_images FOR SELECT
  TO authenticated, anon
  USING (archived_at IS NULL);

CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 5. PRODUCT VARIANTS TABLE
-- ============================================================================

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  sku text UNIQUE NOT NULL,
  barcode text,
  size text,
  color text,
  material text,
  stock_quantity int DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
  reserved_quantity int DEFAULT 0 NOT NULL CHECK (reserved_quantity >= 0),
  low_stock_threshold int DEFAULT 10 CHECK (low_stock_threshold >= 0),
  price_adjustment decimal(10,2) DEFAULT 0 CHECK (price_adjustment >= -999999),
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz,
  CONSTRAINT available_stock CHECK (stock_quantity >= reserved_quantity),
  CONSTRAINT unique_variant_per_product UNIQUE(product_id, size, color, material)
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id) WHERE is_active = true;
CREATE INDEX idx_product_variants_sku ON product_variants(sku) WHERE archived_at IS NULL;
CREATE INDEX idx_product_variants_stock ON product_variants(stock_quantity) WHERE stock_quantity <= low_stock_threshold;

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product variants viewable by everyone"
  ON product_variants FOR SELECT
  TO authenticated, anon
  USING (is_active = true AND archived_at IS NULL);

CREATE POLICY "Admins can manage product variants"
  ON product_variants FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 6. PRODUCT REVIEWS TABLE (NEW)
-- ============================================================================

CREATE TABLE product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  is_verified_purchase boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  helpful_count int DEFAULT 0 CHECK (helpful_count >= 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz,
  CONSTRAINT one_review_per_product_per_user UNIQUE(product_id, user_id)
);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id) WHERE is_approved = true AND archived_at IS NULL;
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating) WHERE is_approved = true;

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews viewable by everyone"
  ON product_reviews FOR SELECT
  TO authenticated, anon
  USING (is_approved = true AND archived_at IS NULL);

CREATE POLICY "Users can view own reviews"
  ON product_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND archived_at IS NULL);

-- ============================================================================
-- 7. ADDRESSES TABLE
-- ============================================================================

CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type address_type NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text DEFAULT 'USA' NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz,
  CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9\s\-\(\)]+$')
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id) WHERE archived_at IS NULL;
CREATE INDEX idx_addresses_default ON addresses(user_id) WHERE is_default = true;

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND archived_at IS NULL);

-- ============================================================================
-- 8. CARTS TABLE
-- ============================================================================

CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_expires_at ON carts(expires_at);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON carts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- 9. CART ITEMS TABLE
-- ============================================================================

CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE NOT NULL,
  quantity int DEFAULT 1 NOT NULL CHECK (quantity > 0 AND quantity <= 100),
  price_at_add decimal(10,2) NOT NULL CHECK (price_at_add >= 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(cart_id, variant_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant_id ON cart_items(variant_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. ORDERS TABLE
-- ============================================================================

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  subtotal decimal(10,2) NOT NULL CHECK (subtotal >= 0),
  tax_amount decimal(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount decimal(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount decimal(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_address_id uuid REFERENCES addresses(id) ON DELETE SET NULL,
  billing_address_id uuid REFERENCES addresses(id) ON DELETE SET NULL,
  promo_code_id uuid,
  payment_method text,
  payment_intent_id text,
  tracking_number text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  notes text,
  customer_ip text,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_total CHECK (total_amount = subtotal + tax_amount + shipping_amount - discount_amount)
);

CREATE INDEX idx_orders_user_id ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status) WHERE status IN ('pending', 'processing');
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status) WHERE payment_status = 'pending';

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 11. ORDER ITEMS TABLE
-- ============================================================================

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  subtotal decimal(10,2) NOT NULL CHECK (subtotal >= 0),
  product_snapshot jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_subtotal CHECK (subtotal = price * quantity)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 12. PROMO CODES TABLE
-- ============================================================================

CREATE TABLE promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_type discount_type NOT NULL,
  discount_value decimal(10,2) NOT NULL CHECK (discount_value > 0),
  min_purchase decimal(10,2) DEFAULT 0 CHECK (min_purchase >= 0),
  max_discount decimal(10,2) CHECK (max_discount IS NULL OR max_discount > 0),
  max_uses int CHECK (max_uses IS NULL OR max_uses > 0),
  max_uses_per_user int DEFAULT 1 CHECK (max_uses_per_user > 0),
  used_count int DEFAULT 0 CHECK (used_count >= 0),
  valid_from timestamptz DEFAULT now() NOT NULL,
  valid_until timestamptz,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz,
  CONSTRAINT valid_dates CHECK (valid_until IS NULL OR valid_until > valid_from),
  CONSTRAINT valid_uses CHECK (max_uses IS NULL OR used_count <= max_uses),
  CONSTRAINT valid_discount_percentage CHECK (
    discount_type != 'percentage' OR (discount_value > 0 AND discount_value <= 100)
  )
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code) WHERE is_active = true;
CREATE INDEX idx_promo_codes_valid_dates ON promo_codes(valid_from, valid_until) WHERE is_active = true;

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active promo codes viewable by everyone"
  ON promo_codes FOR SELECT
  TO authenticated, anon
  USING (
    is_active = true AND
    archived_at IS NULL AND
    now() BETWEEN valid_from AND COALESCE(valid_until, 'infinity'::timestamptz) AND
    (max_uses IS NULL OR used_count < max_uses)
  );

CREATE POLICY "Admins can manage promo codes"
  ON promo_codes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 13. ORDER STATUS HISTORY TABLE
-- ============================================================================

CREATE TABLE order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL,
  notes text,
  changed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id, created_at DESC);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order history"
  ON order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order history"
  ON order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can create order history"
  ON order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 14. INVENTORY RESERVATIONS TABLE (NEW - for concurrent checkout handling)
-- ============================================================================

CREATE TABLE inventory_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  cart_id uuid REFERENCES carts(id) ON DELETE CASCADE,
  quantity int NOT NULL CHECK (quantity > 0),
  expires_at timestamptz DEFAULT (now() + interval '15 minutes') NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_inventory_reservations_variant_id ON inventory_reservations(variant_id);
CREATE INDEX idx_inventory_reservations_expires_at ON inventory_reservations(expires_at);
CREATE INDEX idx_inventory_reservations_user_id ON inventory_reservations(user_id);

ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reservations"
  ON inventory_reservations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order numbers (helper function)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_order_number text;
  counter int := 0;
BEGIN
  LOOP
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::text, 5, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number);
    counter := counter + 1;
    IF counter > 10 THEN
      RAISE EXCEPTION 'Unable to generate unique order number';
    END IF;
  END LOOP;
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update product search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.sku, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired cart items
CREATE OR REPLACE FUNCTION clean_expired_carts()
RETURNS void AS $$
BEGIN
  DELETE FROM carts WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Function to release expired inventory reservations
CREATE OR REPLACE FUNCTION release_expired_reservations()
RETURNS void AS $$
BEGIN
  DELETE FROM inventory_reservations WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER product_reviews_updated_at BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger for order number generation
CREATE TRIGGER orders_set_order_number BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger for product search vector
CREATE TRIGGER products_search_vector_update
  BEFORE INSERT OR UPDATE OF name, description, sku ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_search_vector();

-- ============================================================================
-- VIEWS FOR ANALYTICS (NEW)
-- ============================================================================

-- Product performance view
CREATE OR REPLACE VIEW product_analytics AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.category_id,
  COUNT(DISTINCT oi.order_id) as total_orders,
  SUM(oi.quantity) as units_sold,
  SUM(oi.subtotal) as total_revenue,
  AVG(pr.rating) as average_rating,
  COUNT(DISTINCT pr.id) as review_count,
  p.is_featured,
  p.created_at
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN product_reviews pr ON pr.product_id = p.id AND pr.is_approved = true
WHERE p.archived_at IS NULL
GROUP BY p.id, p.name, p.slug, p.category_id, p.is_featured, p.created_at;

-- Low stock alert view
CREATE OR REPLACE VIEW low_stock_alerts AS
SELECT 
  pv.id,
  pv.sku,
  p.name as product_name,
  pv.size,
  pv.color,
  pv.stock_quantity,
  pv.reserved_quantity,
  (pv.stock_quantity - pv.reserved_quantity) as available_quantity,
  pv.low_stock_threshold
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
WHERE pv.is_active = true 
  AND pv.archived_at IS NULL
  AND (pv.stock_quantity - pv.reserved_quantity) <= pv.low_stock_threshold;

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Men', 'men', 'Men''s fashion and accessories', 1),
  ('Women', 'women', 'Women''s fashion and accessories', 2),
  ('Kids', 'kids', 'Children''s clothing', 3),
  ('Accessories', 'accessories', 'Fashion accessories', 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE products IS 'Main product catalog with full-text search';
COMMENT ON TABLE product_variants IS 'Product variations with inventory tracking and reservation system';
COMMENT ON TABLE inventory_reservations IS 'Temporary inventory holds during checkout to prevent overselling';
COMMENT ON TABLE product_reviews IS 'Customer product reviews and ratings';
COMMENT ON TABLE orders IS 'Customer orders with full payment and shipping tracking';
COMMENT ON VIEW product_analytics IS 'Aggregated product performance metrics';
COMMENT ON VIEW low_stock_alerts IS 'Products below restock threshold';

