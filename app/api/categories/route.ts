// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

async function log(user: { id: string; username: string } | null, action: string, entityName: string) {
  if (!user) return;
  await supabaseAdmin.from('admin_activity_log').insert({
    admin_id: user.id, username: user.username,
    action, entity_type: 'category', entity_name: entityName,
  });
}

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const category = await createCategory(body.name, body.description || '', body.image || '');
  if (!category) return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });

  const user = await getCurrentUser();
  log(user, `Added category: ${category.name}`, category.name);

  return NextResponse.json(category, { status: 201 });
}