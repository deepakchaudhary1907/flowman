import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// POST — public submit contact form
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, subject, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('enquiries')
    .insert({ name, email, phone: phone || '', company: company || '', subject: subject || '', message })
    .select()
    .single();
  if (error) return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}

// GET — admin list all enquiries
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  let query = supabaseAdmin
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  return NextResponse.json(data || []);
}