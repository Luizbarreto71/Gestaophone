import { createClient } from '@supabase/supabase-js';

// Read + sanitize credentials (the .env values can carry trailing spaces).
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// True only when real credentials are present (not the placeholders).
export const isSupabaseConfigured =
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('YOUR_') &&
  supabaseAnonKey.length > 20;

// Client is null when not configured — the repository then falls back to localStorage.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table names
export const TABLES = {
  PRODUCTS: 'products',
  TEMPLATES: 'templates',
  SALES: 'sales',
  WEEKLY_SALES: 'weekly_sales',
};

export default supabase;
