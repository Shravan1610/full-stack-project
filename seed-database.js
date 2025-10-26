// Database seeding script
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) {
        env[key.trim()] = values.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🌱 Starting Database Seeding...\n');

async function seedCategories() {
  console.log('📁 Seeding Categories...');
  
  const categories = [
    { name: 'Men', slug: 'men', description: "Men's fashion and accessories", display_order: 1 },
    { name: 'Women', slug: 'women', description: "Women's fashion and accessories", display_order: 2 },
    { name: 'Kids', slug: 'kids', description: "Children's clothing", display_order: 3 },
    { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories', display_order: 4 },
  ];
  
  // First check if categories already exist
  const { data: existing } = await supabase
    .from('categories')
    .select('slug');
  
  if (existing && existing.length > 0) {
    console.log(`   ℹ️  Categories already exist, skipping...\n`);
    const { data: allCategories } = await supabase
      .from('categories')
      .select('*');
    return allCategories;
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert(categories)
    .select();
  
  if (error) {
    console.error('   ❌ Error seeding categories:', error.message);
    return null;
  }
  
  console.log(`   ✅ Created ${data.length} categories\n`);
  return data;
}

async function seedProducts(categories) {
  console.log('👕 Seeding Products...');
  
  const menCategory = categories.find(c => c.slug === 'men');
  const womenCategory = categories.find(c => c.slug === 'women');
  const accessoriesCategory = categories.find(c => c.slug === 'accessories');
  
  const products = [
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-tshirt',
      description: 'Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
      category_id: menCategory?.id,
      base_price: 29.99,
      compare_at_price: 39.99,
      is_featured: true,
      is_active: true,
      sku: 'TSHIRT-001',
    },
    {
      name: 'Slim Fit Denim Jeans',
      slug: 'slim-fit-denim-jeans',
      description: 'Stylish slim fit jeans made from premium denim. Comfortable and durable.',
      category_id: menCategory?.id,
      base_price: 79.99,
      compare_at_price: 99.99,
      is_featured: true,
      is_active: true,
      sku: 'JEANS-001',
    },
    {
      name: 'Casual Button-Up Shirt',
      slug: 'casual-button-up-shirt',
      description: 'Versatile button-up shirt perfect for both casual and semi-formal occasions.',
      category_id: menCategory?.id,
      base_price: 49.99,
      is_featured: false,
      is_active: true,
      sku: 'SHIRT-001',
    },
    {
      name: 'Summer Floral Dress',
      slug: 'summer-floral-dress',
      description: 'Beautiful floral dress perfect for summer days and special occasions.',
      category_id: womenCategory?.id,
      base_price: 89.99,
      compare_at_price: 119.99,
      is_featured: true,
      is_active: true,
      sku: 'DRESS-001',
    },
    {
      name: 'High-Waist Yoga Pants',
      slug: 'high-waist-yoga-pants',
      description: 'Comfortable and stretchy yoga pants with moisture-wicking fabric.',
      category_id: womenCategory?.id,
      base_price: 59.99,
      is_featured: true,
      is_active: true,
      sku: 'YOGA-001',
    },
    {
      name: 'Elegant Silk Blouse',
      slug: 'elegant-silk-blouse',
      description: 'Luxurious silk blouse with a sophisticated design.',
      category_id: womenCategory?.id,
      base_price: 129.99,
      compare_at_price: 159.99,
      is_featured: false,
      is_active: true,
      sku: 'BLOUSE-001',
    },
    {
      name: 'Leather Crossbody Bag',
      slug: 'leather-crossbody-bag',
      description: 'Premium leather crossbody bag with adjustable strap.',
      category_id: accessoriesCategory?.id,
      base_price: 149.99,
      compare_at_price: 199.99,
      is_featured: true,
      is_active: true,
      sku: 'BAG-001',
    },
    {
      name: 'Classic Aviator Sunglasses',
      slug: 'classic-aviator-sunglasses',
      description: 'Timeless aviator sunglasses with UV protection.',
      category_id: accessoriesCategory?.id,
      base_price: 89.99,
      is_featured: true,
      is_active: true,
      sku: 'SUNGLASSES-001',
    },
  ];
  
  // First check if products already exist
  const { data: existing } = await supabase
    .from('products')
    .select('slug');
  
  if (existing && existing.length > 0) {
    console.log(`   ℹ️  Products already exist, skipping...\n`);
    const { data: allProducts } = await supabase
      .from('products')
      .select('*');
    return allProducts;
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select();
  
  if (error) {
    console.error('   ❌ Error seeding products:', error.message);
    return null;
  }
  
  console.log(`   ✅ Created ${data.length} products\n`);
  return data;
}

async function seedProductImages(products) {
  console.log('🖼️  Seeding Product Images...');
  
  const images = [];
  
  // Add placeholder images for each product
  products.forEach((product, index) => {
    images.push({
      product_id: product.id,
      image_url: `https://placehold.co/600x600/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`,
      alt_text: product.name,
      display_order: 0,
      is_primary: true,
    });
  });
  
  const { data, error } = await supabase
    .from('product_images')
    .insert(images)
    .select();
  
  if (error) {
    console.error('   ❌ Error seeding product images:', error.message);
    return null;
  }
  
  console.log(`   ✅ Created ${data.length} product images\n`);
  return data;
}

async function seedProductVariants(products) {
  console.log('📦 Seeding Product Variants...');
  
  const variants = [];
  
  // Add variants for each product
  products.forEach((product) => {
    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = ['Black', 'White', 'Navy'];
    
    sizes.forEach((size, sizeIndex) => {
      colors.forEach((color, colorIndex) => {
        variants.push({
          product_id: product.id,
          sku: `${product.sku}-${size}-${color.substring(0, 3).toUpperCase()}`,
          size,
          color,
          stock_quantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
          low_stock_threshold: 10,
          price_adjustment: 0,
          is_active: true,
        });
      });
    });
  });
  
  const { data, error } = await supabase
    .from('product_variants')
    .insert(variants)
    .select();
  
  if (error) {
    console.error('   ❌ Error seeding product variants:', error.message);
    return null;
  }
  
  console.log(`   ✅ Created ${data.length} product variants\n`);
  return data;
}

async function createAdminUser() {
  console.log('👤 Creating Admin User...');
  console.log('   ⚠️  You will need to create an admin user manually through Supabase Auth\n');
  console.log('   Steps:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/ribcvlvrxcadztnxqhce/auth/users');
  console.log('   2. Click "Add User" -> "Create new user"');
  console.log('   3. Enter email: admin@example.com (or your email)');
  console.log('   4. Enter password: admin123 (or your password)');
  console.log('   5. Click "Create user"');
  console.log('   6. After user is created, go to the profiles table');
  console.log('   7. Find the user and update their role to "admin"\n');
  console.log('   Alternatively, run this SQL in Supabase SQL Editor:');
  console.log('   ----------------------------------------');
  console.log(`   -- First, create a user in Auth, then run:`);
  console.log(`   UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';`);
  console.log('   ----------------------------------------\n');
}

async function main() {
  try {
    const categories = await seedCategories();
    if (!categories) return;
    
    const products = await seedProducts(categories);
    if (!products) return;
    
    await seedProductImages(products);
    await seedProductVariants(products);
    
    await createAdminUser();
    
    console.log('=' .repeat(60));
    console.log('✅ Database seeding completed successfully!\n');
    console.log('📝 Next Steps:');
    console.log('1. Create an admin user (see instructions above)');
    console.log('2. Start the client app: npm run dev:client');
    console.log('3. Visit: http://localhost:3000');
    console.log('4. Start the admin app: npm run dev:admin');
    console.log('5. Visit: http://localhost:3001');
    console.log('=' .repeat(60));
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();

