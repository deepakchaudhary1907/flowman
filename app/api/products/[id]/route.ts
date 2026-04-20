import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct, getProducts } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

async function log(user: { id: string; username: string } | null, action: string, entityName: string) {
  if (!user) return;
  await supabaseAdmin.from('admin_activity_log').insert({
    admin_id: user.id, username: user.username,
    action, entity_type: 'product', entity_name: entityName,
  });
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const product = await updateProduct(id, {
    title: body.title,
    shortDescription: body.shortDescription,
    description: body.description,
    image: body.image,
    categoryId: body.categoryId,
  });
  if (!product) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });

  const user = await getCurrentUser();
  log(user, `Updated product: ${product.title}`, product.title);

  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Get name before deleting
  const product = await getProductById(id);
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });

  const user = await getCurrentUser();
  log(user, `Deleted product: ${product?.title || id}`, product?.title || id);

  return NextResponse.json({ success: true });
}