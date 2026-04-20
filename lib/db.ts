// lib/db.ts

// ── Supabase-backed data layer ──────────────────────────────
import { supabaseAdmin, supabase } from './supabase';

// ── Types ───────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

// ── Helper: map Supabase row → Category ─────────────────────
function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || '',
    image: (row.image as string) || '',
    createdAt: row.created_at as string,
  };
}

// ── Helper: map Supabase row → Product ──────────────────────
function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: (row.description as string) || '',
    shortDescription: (row.short_description as string) || '',
    image: (row.image_url as string) || '',
    categoryId: (row.category_id as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ── CATEGORIES ───────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('getCategories:', error.message); return []; }
  return (data || []).map(rowToCategory);
}

export async function createCategory(
  name: string,
  description: string,
  image: string = ''
): Promise<Category | null> {
  const slug = generateSlug(name);
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({ name, slug, description, image })
    .select()
    .single();
  if (error) { console.error('createCategory:', error.message); return null; }
  return rowToCategory(data);
}

export async function updateCategory(
  id: string,
  name: string,
  description: string,
  image: string = ''
): Promise<Category | null> {
  const slug = generateSlug(name);
  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({ name, slug, description, image })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateCategory:', error.message); return null; }
  return rowToCategory(data);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) { console.error('deleteCategory:', error.message); return false; }
  return true;
}

// ── PRODUCTS ─────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getProducts:', error.message); return []; }
  return (data || []).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single();
  if (error) { console.error('getProductById:', error.message); return null; }
  return data ? rowToProduct(data) : null;
}

export async function createProduct(input: {
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  categoryId: string;
}): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      title: input.title,
      slug: generateSlug(input.title),
      short_description: input.shortDescription,
      description: input.description,
      image_url: input.image,
      category_id: input.categoryId || null,
    })
    .select()
    .single();
  if (error) { console.error('createProduct:', error.message); return null; }
  return rowToProduct(data);
}

export async function updateProduct(
  id: string,
  input: {
    title?: string;
    shortDescription?: string;
    description?: string;
    image?: string;
    categoryId?: string;
  }
): Promise<Product | null> {
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) { updates.title = input.title; updates.slug = generateSlug(input.title); }
  if (input.shortDescription !== undefined) updates.short_description = input.shortDescription;
  if (input.description !== undefined) updates.description = input.description;
  if (input.image !== undefined) updates.image_url = input.image;
  if (input.categoryId !== undefined) updates.category_id = input.categoryId || null;

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateProduct:', error.message); return null; }
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) { console.error('deleteProduct:', error.message); return false; }
  return true;
}

// ── UTILITY ──────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}