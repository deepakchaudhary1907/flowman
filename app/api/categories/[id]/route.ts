// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateCategory, deleteCategory, getCategories } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

async function log(user: { id: string; username: string } | null, action: string, entityName: string) {
  if (!user) return;
  await supabaseAdmin.from('admin_activity_log').insert({
    admin_id: user.id, username: user.username,
    action, entity_type: 'category', entity_name: entityName,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const category = await updateCategory(id, body.name, body.description || '', body.image || '');
  if (!category) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });

  const user = await getCurrentUser();
  log(user, `Updated category: ${category.name}`, category.name);

  return NextResponse.json(category);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cats = await getCategories();
  const cat = cats.find(c => c.id === id);
  const ok = await deleteCategory(id);
  if (!ok) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });

  const user = await getCurrentUser();
  log(user, `Deleted category: ${cat?.name || id}`, cat?.name || id);

  return NextResponse.json({ success: true });
}