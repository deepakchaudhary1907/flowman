import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Only jpg/png/webp allowed' }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'Max 2MB' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  // Always use same filename per user — overwrites old avatar automatically
  const filename = `avatars/${user.id}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filename, Buffer.from(bytes), {
      contentType: file.type,
      upsert: true, // overwrite existing
      cacheControl: '3600',
    });

  if (upErr) {
    console.error('Avatar upload error:', upErr.message);
    return NextResponse.json({ error: 'Upload failed: ' + upErr.message }, { status: 500 });
  }

  // Get clean public URL — no cache-busting timestamp
  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename);

  const cleanUrl = urlData.publicUrl;

  // Save to database
  const { error: dbErr } = await supabaseAdmin
    .from('admin_users')
    .update({ avatar_url: cleanUrl })
    .eq('id', user.id);

  if (dbErr) {
    console.error('Avatar DB update error:', dbErr.message);
    return NextResponse.json({ error: 'Failed to save avatar URL' }, { status: 500 });
  }

  return NextResponse.json({ url: cleanUrl });
}

// GET — return current user's avatar URL
export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ url: null });

  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  return NextResponse.json({ url: data?.avatar_url || null });
}