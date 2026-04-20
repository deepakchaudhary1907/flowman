import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, SESSION_COOKIE, SESSION_PREFIX } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  const user = await validateCredentials(username, password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  // Log sign-in activity (fire-and-forget)
  void (async () => {
    try {
      await supabaseAdmin.from('admin_activity_log').insert({
        admin_id: user.id,
        username: user.username,
        action: 'Signed in to admin panel',
        entity_type: 'auth',
        entity_id: '',
        entity_name: '',
      });
    } catch {}
  })();

  const res = NextResponse.json({
    success: true,
    user: { username: user.username, fullName: user.fullName, role: user.role },
  });

  res.cookies.set(SESSION_COOKIE, `${SESSION_PREFIX}${user.id}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return res;
}

export async function DELETE(req: NextRequest) {
  // Log sign-out — best effort, don't block the response
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/flowman_admin_session=sess_([^;]+)/);
    if (sessionMatch) {
      const userId = sessionMatch[1];
      const { data } = await supabaseAdmin
        .from('admin_users')
        .select('username')
        .eq('id', userId)
        .single();
      if (data) {
        await supabaseAdmin.from('admin_activity_log').insert({
          admin_id: userId,
          username: data.username,
          action: 'Signed out',
          entity_type: 'auth',
          entity_id: '',
          entity_name: '',
        });
      }
    }
  } catch {}

  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}