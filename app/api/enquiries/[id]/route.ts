import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';

async function log(user: { id: string; username: string } | null, action: string, entityName: string) {
  if (!user) return;
  await supabaseAdmin.from('admin_activity_log').insert({
    admin_id: user.id, username: user.username,
    action, entity_type: 'enquiry', entity_name: entityName,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();

  // Get enquiry name before update
  const { data: enq } = await supabaseAdmin.from('enquiries').select('name, subject').eq('id', id).single();

  const { data, error } = await supabaseAdmin
    .from('enquiries').update({ status }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });

  const user = await getCurrentUser();
  const label = enq ? `${enq.name} — ${enq.subject || 'General'}` : id;
  log(user, `Marked enquiry as ${status}: ${label}`, label);

  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const { data: enq } = await supabaseAdmin.from('enquiries').select('name').eq('id', id).single();
  const { error } = await supabaseAdmin.from('enquiries').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });

  const user = await getCurrentUser();
  log(user, `Deleted enquiry from: ${enq?.name || id}`, enq?.name || id);

  return NextResponse.json({ success: true });
}