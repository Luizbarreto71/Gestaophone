// Data repository — single integration point for the UI.
// Uses Supabase when configured; otherwise (or on any remote error) falls back
// to localStorage. Translates camelCase (UI) <-> snake_case (database) so the
// React components never deal with the DB column naming.

import { supabase, isSupabaseConfigured, TABLES } from './supabase';
import { initialProducts, initialTemplates, generateId } from '../data/mockData';

export const usingSupabase = isSupabaseConfigured;

// LocalStorage keys — versioned (v2) so any previously cached mock data is
// abandoned and the system starts completely zeroed.
const LS = {
  products: 'gestaophone_products_v2',
  templates: 'gestaophone_templates_v2',
  sales: 'gestaophone_sales_v2',
  weekly: 'gestaophone_weekly_sales_v2',
};

// System starts zeroed — no seeded weekly buckets.
const INITIAL_WEEKLY = [];

// ----- localStorage helpers -----
const lsGet = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupt cache */ }
  if (seed !== undefined) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return [];
};
const lsSet = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// ----- mappers: camelCase (UI) <-> snake_case (DB) -----
const num = (v) => (v === null || v === undefined ? v : Number(v));

const productToDb = (p) => ({
  name: p.name,
  brand: p.brand,
  category: p.category,
  condition: p.condition,
  cost_price: p.costPrice,
  sale_price: p.salePrice,
  imei: p.imei,
  quantity: p.quantity,
  min_quantity: p.minQuantity,
  status: p.status,
  sold_at: p.soldAt ?? null,
});
const productFromDb = (r) => ({
  id: r.id,
  name: r.name,
  brand: r.brand,
  category: r.category,
  condition: r.condition,
  costPrice: num(r.cost_price),
  salePrice: num(r.sale_price),
  imei: r.imei,
  quantity: r.quantity,
  minQuantity: r.min_quantity,
  status: r.status,
  soldAt: r.sold_at,
  createdAt: r.created_at,
});

const templateToDb = (t) => ({
  name: t.name,
  brand: t.brand,
  category: t.category,
  condition: t.condition,
  cost_price: t.costPrice,
  sale_price: t.salePrice,
  min_quantity: t.minQuantity,
  barcode: t.barcode ?? null,
});
const templateFromDb = (r) => ({
  id: r.id,
  name: r.name,
  brand: r.brand,
  category: r.category,
  condition: r.condition,
  costPrice: num(r.cost_price),
  salePrice: num(r.sale_price),
  minQuantity: r.min_quantity,
  barcode: r.barcode ?? '',
});

const weeklyFromDb = (r) => ({ week: r.week, sales: num(r.sales), profit: num(r.profit) });

// Run a remote operation, falling back to a local one on any failure.
const withFallback = async (label, remote, local) => {
  if (usingSupabase) {
    try {
      return await remote();
    } catch (e) {
      console.warn(`[repository] Supabase falhou em "${label}", usando localStorage.`, e);
    }
  }
  return local();
};

export const repo = {
  usingSupabase,

  // ---------------- Products ----------------
  getProducts: () =>
    withFallback(
      'getProducts',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.PRODUCTS)
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(productFromDb);
      },
      () => lsGet(LS.products, initialProducts)
    ),

  createProduct: (product) =>
    withFallback(
      'createProduct',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.PRODUCTS)
          .insert(productToDb(product))
          .select()
          .single();
        if (error) throw error;
        return productFromDb(data);
      },
      () => {
        const item = { ...product, id: generateId(), createdAt: new Date().toISOString() };
        lsSet(LS.products, [item, ...lsGet(LS.products, initialProducts)]);
        return item;
      }
    ),

  updateProduct: (id, product) =>
    withFallback(
      'updateProduct',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.PRODUCTS)
          .update(productToDb(product))
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return productFromDb(data);
      },
      () => {
        const next = lsGet(LS.products, initialProducts).map((x) =>
          x.id === id ? { ...x, ...product, id } : x
        );
        lsSet(LS.products, next);
        return next.find((x) => x.id === id);
      }
    ),

  deleteProduct: (id) =>
    withFallback(
      'deleteProduct',
      async () => {
        const { error } = await supabase.from(TABLES.PRODUCTS).delete().eq('id', id);
        if (error) throw error;
        return true;
      },
      () => {
        lsSet(LS.products, lsGet(LS.products, initialProducts).filter((x) => x.id !== id));
        return true;
      }
    ),

  // Sell: mark product as sold, record the sale, and bump the latest week.
  // Returns { product, weeklySales } so the UI can update both at once.
  sellProduct: async (product) => {
    const profit = product.salePrice - product.costPrice;
    const margin =
      product.salePrice > 0 ? Number(((profit / product.salePrice) * 100).toFixed(2)) : 0;
    const soldAt = new Date().toISOString();

    const updatedProduct = await withFallback(
      'sellProduct:update',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.PRODUCTS)
          .update({ status: 'vendido', sold_at: soldAt })
          .eq('id', product.id)
          .select()
          .single();
        if (error) throw error;
        await supabase.from(TABLES.SALES).insert({
          product_id: product.id,
          product_name: product.name,
          imei: product.imei,
          cost_price: product.costPrice,
          sale_price: product.salePrice,
          profit,
          margin_percent: margin,
        });
        return productFromDb(data);
      },
      () => {
        const next = lsGet(LS.products, initialProducts).map((x) =>
          x.id === product.id ? { ...x, status: 'vendido', soldAt } : x
        );
        lsSet(LS.products, next);
        lsSet(LS.sales, [
          {
            id: generateId(),
            productId: product.id,
            productName: product.name,
            imei: product.imei,
            costPrice: product.costPrice,
            salePrice: product.salePrice,
            profit,
            marginPercent: margin,
            createdAt: soldAt,
          },
          ...lsGet(LS.sales, []),
        ]);
        return next.find((x) => x.id === product.id);
      }
    );

    const weeklySales = await repo.bumpLatestWeek(product.salePrice, profit);
    return { product: updatedProduct, weeklySales };
  },

  // ---------------- Templates ----------------
  getTemplates: () =>
    withFallback(
      'getTemplates',
      async () => {
        const { data, error } = await supabase.from(TABLES.TEMPLATES).select('*').order('name');
        if (error) throw error;
        return (data || []).map(templateFromDb);
      },
      () => lsGet(LS.templates, initialTemplates)
    ),

  createTemplate: (template) =>
    withFallback(
      'createTemplate',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.TEMPLATES)
          .insert(templateToDb(template))
          .select()
          .single();
        if (error) throw error;
        return templateFromDb(data);
      },
      () => {
        const item = { ...template, id: generateId() };
        lsSet(LS.templates, [...lsGet(LS.templates, initialTemplates), item]);
        return item;
      }
    ),

  updateTemplate: (id, template) =>
    withFallback(
      'updateTemplate',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.TEMPLATES)
          .update(templateToDb(template))
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return templateFromDb(data);
      },
      () => {
        const next = lsGet(LS.templates, initialTemplates).map((x) =>
          x.id === id ? { ...x, ...template, id } : x
        );
        lsSet(LS.templates, next);
        return next.find((x) => x.id === id);
      }
    ),

  deleteTemplate: (id) =>
    withFallback(
      'deleteTemplate',
      async () => {
        const { error } = await supabase.from(TABLES.TEMPLATES).delete().eq('id', id);
        if (error) throw error;
        return true;
      },
      () => {
        lsSet(LS.templates, lsGet(LS.templates, initialTemplates).filter((x) => x.id !== id));
        return true;
      }
    ),

  // ---------------- Weekly sales ----------------
  getWeeklySales: () =>
    withFallback(
      'getWeeklySales',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.WEEKLY_SALES)
          .select('*')
          .order('week');
        if (error) throw error;
        return (data || []).map(weeklyFromDb);
      },
      () => lsGet(LS.weekly, INITIAL_WEEKLY)
    ),

  // Add the sale amount/profit to the most recent week and return the full series.
  bumpLatestWeek: (saleAmount, profit) =>
    withFallback(
      'bumpLatestWeek',
      async () => {
        const { data, error } = await supabase
          .from(TABLES.WEEKLY_SALES)
          .select('*')
          .order('week');
        if (error) throw error;
        const list = data || [];
        if (!list.length) return [];
        const last = list[list.length - 1];
        const { error: upErr } = await supabase
          .from(TABLES.WEEKLY_SALES)
          .update({ sales: num(last.sales) + saleAmount, profit: num(last.profit) + profit })
          .eq('week', last.week);
        if (upErr) throw upErr;
        return list.map((r, i) =>
          i === list.length - 1
            ? { week: r.week, sales: num(r.sales) + saleAmount, profit: num(r.profit) + profit }
            : weeklyFromDb(r)
        );
      },
      () => {
        const list = lsGet(LS.weekly, INITIAL_WEEKLY);
        if (!list.length) return list;
        const next = list.map((w, i) =>
          i === list.length - 1
            ? { ...w, sales: w.sales + saleAmount, profit: w.profit + profit }
            : w
        );
        lsSet(LS.weekly, next);
        return next;
      }
    ),

  // ---------------- Reset ----------------
  // Restores the initial state. On Supabase: wipes products + sales and reseeds
  // weekly sales (templates are left intact). On localStorage: reseeds mock data.
  resetData: async () => {
    if (usingSupabase) {
      try {
        await supabase.from(TABLES.SALES).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from(TABLES.PRODUCTS).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from(TABLES.WEEKLY_SALES).delete().neq('week', '');
        if (INITIAL_WEEKLY.length) {
          await supabase.from(TABLES.WEEKLY_SALES).insert(INITIAL_WEEKLY);
        }
        const [products, templates, weeklySales] = await Promise.all([
          repo.getProducts(),
          repo.getTemplates(),
          repo.getWeeklySales(),
        ]);
        return { products, templates, weeklySales };
      } catch (e) {
        console.warn('[repository] Reset no Supabase falhou, usando localStorage.', e);
      }
    }
    [LS.products, LS.templates, LS.sales, LS.weekly].forEach((k) => localStorage.removeItem(k));
    return {
      products: lsGet(LS.products, initialProducts),
      templates: lsGet(LS.templates, initialTemplates),
      weeklySales: lsGet(LS.weekly, INITIAL_WEEKLY),
    };
  },
};

export default repo;
