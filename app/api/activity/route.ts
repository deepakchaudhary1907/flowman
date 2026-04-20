import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if the table exists first to avoid crashing if migration hasn't run
  const { data, error } = await supabaseAdmin
    .from('admin_activity_log')
    .select('id, username, action, entity_type, entity_name, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    // Table might not exist yet — return empty array with hint
    console.error('Activity log error:', error.message);
    if (error.code === '42P01') {
      // relation does not exist
      return NextResponse.json({ error: 'TABLE_NOT_FOUND', entries: [] });
    }
    return NextResponse.json({ error: error.message, entries: [] }, { status: 500 });
  }

  return NextResponse.json({ entries: data || [] });
}

export async function POST(req: Request) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { username, action, entityType, entityId, entityName } = body;

  if (!action || !username) {
    return NextResponse.json({ error: 'action and username required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('admin_activity_log').insert({
    username,
    action,
    entity_type: entityType || '',
    entity_id: entityId || '',
    entity_name: entityName || '',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}