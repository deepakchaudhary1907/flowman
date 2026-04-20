import { supabaseAdmin } from './supabase';

export async function logActivity(params: {
  adminId?: string;
  username: string;
  action: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
}) {
  await supabaseAdmin.from('admin_activity_log').insert({
    admin_id: params.adminId || null,
    username: params.username,
    action: params.action,
    entity_type: params.entityType || '',
    entity_id: params.entityId || '',
    entity_name: params.entityName || '',
  });
}