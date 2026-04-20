import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

async function log(user: { id: string; username: string } | null, action: string, entityName: string) {
  if (!user) return;
  await supabaseAdmin.from('admin_activity_log').insert({
    admin_id: user.id, username: user.username,
    action, entity_type: 'product', entity_name: entityName,
  });
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const product = await createProduct({
    title: body.title,
    shortDescription: body.shortDescription || '',
    description: body.description || '',
    image: body.image || '',
    categoryId: body.categoryId || '',
  });
  if (!product) return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });

  const user = await getCurrentUser();
  log(user, `Added product: ${product.title}`, product.title);

  return NextResponse.json(product, { status: 201 });
}