// app/admin/products/new/page.tsx
// SERVER COMPONENT — no 'use client', so NO event handlers
// (onMouseEnter/onMouseLeave) are allowed directly on JSX elements.
// Hover effects are done via a scoped <style> + className instead.

import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export default async function NewProductPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');

  return (
    <div>
      <style>{`
        .back-link {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: #8a9baa;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.15s;
        }
        .back-link:hover { color: #4bb6e8; }
      `}</style>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/admin/products" className="back-link">← Back to Products</Link>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a9baa', marginBottom: 4 }}>Catalogue</div>
        <h1 style={{ fontFamily: "'Barlow Condensed','Arial Narrow',Arial,sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.1rem)', color: '#1e2229', margin: 0 }}>Add New Product</h1>
        <p style={{ fontFamily: "'Barlow',Arial,sans-serif", color: '#8a9baa', fontSize: '0.9rem', marginTop: '0.3rem' }}>
          Fill in the details below to create a new product listing.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 'clamp(1.25rem,3vw,2.5rem)', boxShadow: '0 2px 16px rgba(30,34,41,0.07)', border: '1px solid #dde2e8' }}>
        <ProductForm mode="create" />
      </div>
    </div>
  );
}