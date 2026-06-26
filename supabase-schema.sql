-- GestaoPhone Supabase Database Schema
-- Run this SQL in your Supabase project's SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(50) NOT NULL DEFAULT 'Novo',
  cost_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  imei VARCHAR(100) UNIQUE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'disponivel',
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table (modelos base)
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(50) NOT NULL DEFAULT 'Novo',
  cost_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  imei VARCHAR(100) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  profit DECIMAL(10,2) NOT NULL,
  margin_percent DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly sales table (for dashboard charts)
CREATE TABLE IF NOT EXISTS weekly_sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  week VARCHAR(50) UNIQUE NOT NULL,
  sales DECIMAL(12,2) NOT NULL DEFAULT 0,
  profit DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_imei ON products(imei);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_sales_updated_at
  BEFORE UPDATE ON weekly_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sistema inicia ZERADO: sem seeds de produtos, modelos ou vendas.
-- As tabelas são criadas vazias e populadas pelo uso real do sistema.

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_sales ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (for development)
-- In production, you should restrict these based on user authentication
CREATE POLICY "Allow all operations on products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on templates" ON templates
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on sales" ON sales
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on weekly_sales" ON weekly_sales
  FOR ALL USING (true) WITH CHECK (true);

-- Create a function to get dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalStockValue', COALESCE((SELECT SUM(cost_price * quantity) FROM products WHERE status != 'vendido'), 0),
    'totalUnits', COALESCE((SELECT SUM(quantity) FROM products WHERE status != 'vendido'), 0),
    'totalSales', COALESCE((SELECT SUM(sales) FROM weekly_sales), 0),
    'totalProfit', COALESCE((SELECT SUM(profit) FROM weekly_sales), 0),
    'avgMargin', CASE 
      WHEN COALESCE((SELECT SUM(sales) FROM weekly_sales), 0) > 0 
      THEN ROUND((COALESCE((SELECT SUM(profit) FROM weekly_sales), 0) / (SELECT SUM(sales) FROM weekly_sales)) * 100, 1)
      ELSE 0 
    END,
    'lowStockItems', COALESCE((SELECT COUNT(*) FROM products WHERE quantity <= min_quantity AND status != 'vendido'), 0),
    'totalProducts', COALESCE((SELECT COUNT(*) FROM products), 0),
    'availableProducts', COALESCE((SELECT COUNT(*) FROM products WHERE status = 'disponivel'), 0),
    'reservedProducts', COALESCE((SELECT COUNT(*) FROM products WHERE status = 'reservado'), 0),
    'soldProducts', COALESCE((SELECT COUNT(*) FROM products WHERE status = 'vendido'), 0)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a function to register a sale
CREATE OR REPLACE FUNCTION register_sale(product_uuid UUID)
RETURNS JSON AS $$
DECLARE
  product_record RECORD;
  sale_record RECORD;
  profit DECIMAL(10,2);
  margin_percent DECIMAL(5,2);
BEGIN
  -- Get product details
  SELECT * INTO product_record FROM products WHERE id = product_uuid AND status = 'disponivel';
  
  IF product_record IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Produto não encontrado ou indisponível');
  END IF;
  
  -- Calculate profit and margin
  profit := product_record.sale_price - product_record.cost_price;
  margin_percent := ROUND((profit / product_record.sale_price) * 100, 2);
  
  -- Create sale record
  INSERT INTO sales (product_id, product_name, imei, cost_price, sale_price, profit, margin_percent)
  VALUES (product_record.id, product_record.name, product_record.imei, product_record.cost_price, 
          product_record.sale_price, profit, margin_percent)
  RETURNING * INTO sale_record;
  
  -- Update product status
  UPDATE products SET status = 'vendido', sold_at = NOW() WHERE id = product_uuid;
  
  RETURN json_build_object('success', true, 'sale', row_to_json(sale_record));
END;
$$ LANGUAGE plpgsql;