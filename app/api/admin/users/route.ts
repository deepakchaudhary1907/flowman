import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUser, hashPassword } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET — list all admin users (superadmin only)
export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getCurrentUser();
  if (user?.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, email, full_name, role, is_active, last_login, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create a new admin user (superadmin only)
export async function POST(req: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getCurrentUser();
  if (user?.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { username, email, password, fullName, role } = await req.json();
  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Username, email and password are required' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({ username: username.toLowerCase().trim(), email, password_hash: passwordHash, full_name: fullName || '', role: role || 'admin' })
    .select('id, username, email, full_name, role, is_active, created_at')
    .single();

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}