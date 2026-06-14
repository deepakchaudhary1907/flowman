// app/(public)/layout.tsx  ← PUBLIC GROUP LAYOUT
// ✅ Navbar + Footer live HERE — they render on:
//      /            (home)
//      /about
//      /contact
//      /products
//      /products/[id]
//    ...and any other route inside the (public) folder group.
//
// ❌ Neither renders on /admin/* routes (those use AdminShell instead).

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}