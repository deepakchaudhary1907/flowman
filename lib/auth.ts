import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE = 'flowman_admin_session';
const SESSION_PREFIX = 'sess_';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

// ── Verify credentials against Supabase admin_users table ───
export async function validateCredentials(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, email, full_name, role, password_hash, is_active')
    .eq('username', username.toLowerCase().trim())
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) return null;

  // Update last_login timestamp
  await supabaseAdmin
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.id);

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
  };
}

// ── Check if current request is authenticated ────────────────
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value || !session.value.startsWith(SESSION_PREFIX)) return false;
  // Session value = "sess_{userId}" — verify user still exists and is active
  const userId = session.value.slice(SESSION_PREFIX.length);
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .eq('is_active', true)
    .single();
  return !!data;
}

// ── Get current admin user from session ──────────────────────
export async function getCurrentUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value || !session.value.startsWith(SESSION_PREFIX)) return null;
  const userId = session.value.slice(SESSION_PREFIX.length);
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, email, full_name, role')
    .eq('id', userId)
    .eq('is_active', true)
    .single();
  if (!data) return null;
  return { id: data.id, username: data.username, email: data.email, fullName: data.full_name, role: data.role };
}

// ── Hash a password (for creating/updating users) ────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export { SESSION_COOKIE, SESSION_PREFIX };