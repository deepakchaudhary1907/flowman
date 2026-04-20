import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  // Validate file type
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only images are allowed (jpg, png, webp, gif)' }, { status: 400 });
  }

  // Validate file size — max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `products/${uuidv4()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Storage upload error:', error.message);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }

  // Get the public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}