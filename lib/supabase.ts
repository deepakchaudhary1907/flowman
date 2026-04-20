import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — for read operations on the frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — uses service role key, bypasses RLS, server-side only
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export const STORAGE_BUCKET = 'product-images';