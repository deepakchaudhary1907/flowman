import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUser, hashPassword } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// Change password for the currently logged-in admin
export async function POST(req: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Fetch current hash to verify
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('password_hash')
    .eq('id', user.id)
    .single();

  if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, data.password_hash);
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

  const newHash = await hashPassword(newPassword);
  const { error } = await supabaseAdmin
    .from('admin_users')
    .update({ password_hash: newHash })
    .eq('id', user.id);

  if (error) return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });

  return NextResponse.json({ success: true, message: 'Password updated successfully' });
}