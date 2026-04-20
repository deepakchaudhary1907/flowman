import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUser, hashPassword } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// PUT — update a user (superadmin, or own profile)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const currentUser = await getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isOwnProfile = currentUser?.id === id;

  if (!isSuperAdmin && !isOwnProfile) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.fullName !== undefined) updates.full_name = body.fullName;
  if (body.email !== undefined) updates.email = body.email;
  // Only superadmin can change role or active status
  if (isSuperAdmin && body.role !== undefined) updates.role = body.role;
  if (isSuperAdmin && body.isActive !== undefined) updates.is_active = body.isActive;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .update(updates)
    .eq('id', id)
    .select('id, username, email, full_name, role, is_active')
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — deactivate a user (superadmin only, can't delete own account)
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (currentUser.id === id) return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });

  // Soft delete — deactivate instead of hard delete
  const { error } = await supabaseAdmin
    .from('admin_users')
    .update({ is_active: false })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Failed to deactivate user' }, { status: 500 });
  return NextResponse.json({ success: true });
}