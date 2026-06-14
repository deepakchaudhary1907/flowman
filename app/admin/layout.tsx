// app/admin/layout.tsx
import type { Metadata } from 'next';
import { isAuthenticated } from '@/lib/auth';
import AdminShell from '@/components/AdminShell';

export const metadata: Metadata = { title: 'Admin — Flowman Engineers' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuthenticated();
  if (auth) return <AdminShell>{children}</AdminShell>;
  return <>{children}</>;
}