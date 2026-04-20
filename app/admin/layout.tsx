import type { Metadata } from 'next';
import { isAuthenticated } from '@/lib/auth';
import AdminShell from '@/components/AdminShell';

export const metadata: Metadata = { title: 'Admin – Flowman Engineers' };

// NOTE: No <html> or <body> here — root layout owns those.
// We just wrap authenticated children with AdminShell.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuthenticated();
  if (auth) return <AdminShell>{children}</AdminShell>;
  // Not authenticated — render login page as-is (it handles its own full-screen layout)
  return <>{children}</>;
}