#!/usr/bin/env node
/**
 * AlRahma Store — Database Migration Script
 * Runs the migration SQL directly against Supabase via REST
 * Usage: node scripts/migrate.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && v.length) env[k.trim()] = v.join('=').trim()
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Run migration statements one by one
const migrations = [
  // Create products table
  `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    competitor_price NUMERIC(10,2),
    jemla_price NUMERIC(10,2),
    image_url TEXT,
    video_url TEXT,
    has_variants BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Create product_variants table
  `CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    jemla_price NUMERIC(10,2),
    competitor_price NUMERIC(10,2),
    stock INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Create orders table
  `CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_fee NUMERIC(10,2),
    total_savings NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Create order_items table
  `CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    jemla_unit_price NUMERIC(10,2),
    competitor_unit_price NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Create photo_orders table
  `CREATE TABLE IF NOT EXISTS photo_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review','contacted','confirmed','completed','cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Enable RLS
  `ALTER TABLE products ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE orders ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE order_items ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE photo_orders ENABLE ROW LEVEL SECURITY`,

  // RLS Policies
  `DROP POLICY IF EXISTS "public_read_products" ON products`,
  `CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = TRUE)`,
  `DROP POLICY IF EXISTS "public_read_variants" ON product_variants`,
  `CREATE POLICY "public_read_variants" ON product_variants FOR SELECT USING (is_active = TRUE)`,
  `DROP POLICY IF EXISTS "public_insert_orders" ON orders`,
  `CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (TRUE)`,
  `DROP POLICY IF EXISTS "public_insert_order_items" ON order_items`,
  `CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (TRUE)`,
  `DROP POLICY IF EXISTS "public_insert_photo_orders" ON photo_orders`,
  `CREATE POLICY "public_insert_photo_orders" ON photo_orders FOR INSERT WITH CHECK (TRUE)`,
  `DROP POLICY IF EXISTS "service_all_products" ON products`,
  `CREATE POLICY "service_all_products" ON products USING (auth.role() = 'service_role')`,
  `DROP POLICY IF EXISTS "service_all_variants" ON product_variants`,
  `CREATE POLICY "service_all_variants" ON product_variants USING (auth.role() = 'service_role')`,
  `DROP POLICY IF EXISTS "service_all_orders" ON orders`,
  `CREATE POLICY "service_all_orders" ON orders USING (auth.role() = 'service_role')`,
  `DROP POLICY IF EXISTS "service_all_items" ON order_items`,
  `CREATE POLICY "service_all_items" ON order_items USING (auth.role() = 'service_role')`,
  `DROP POLICY IF EXISTS "service_all_photo_orders" ON photo_orders`,
  `CREATE POLICY "service_all_photo_orders" ON photo_orders USING (auth.role() = 'service_role')`,
]

async function migrate() {
  console.log('🗄️  AlRahma Store — Database Migration')
  console.log('========================================\n')

  for (const sql of migrations) {
    const label = sql.slice(0, 60).replace(/\s+/g, ' ')
    try {
      // Use Supabase RPC for raw SQL (requires pg_net or rpc wrapper)
      // We'll try via direct POST to /rest/v1/rpc
      const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: { 'apikey': env.SUPABASE_SERVICE_ROLE_KEY }
      })
      
      // Alternatively use the supabase-js client
      const { error } = await supabase.rpc('run_migration', { sql_text: sql }).then(r => r).catch(() => ({ error: { message: 'RPC not available' } }))
      
      if (error) {
        console.log(`⚠️  ${label.substring(0, 50)}...`)
        console.log(`   Note: ${error.message}`)
      } else {
        console.log(`✅ ${label}`)
      }
    } catch (e) {
      console.log(`❌ ${label}: ${e.message}`)
    }
  }
  
  console.log('\n========================================')
  console.log('⚠️  If RPC is not available, run the migration manually:')
  console.log('   1. Go to https://supabase.com/dashboard/project/glmygdhlyxfzikelkegk/sql/new')
  console.log('   2. Paste the content of supabase_migration.sql')
  console.log('   3. Click Run')
  console.log('   4. Then run: npm run seed')
  console.log('========================================')
}

migrate().catch(console.error)
