// app\admin\products\page.tsx
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export default async function NewProductPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ fontFamily: 'DM Mono', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--slate)', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to Products</Link>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'DM Mono', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)' }}>Catalogue</span>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '2.2rem', color: 'var(--ink)', marginTop: '0.3rem' }}>Add New Product</h1>
        <p style={{ color: 'var(--slate)', fontSize: '0.9rem', marginTop: '0.3rem', fontFamily: 'Barlow' }}>Fill in the details below to create a new product listing.</p>
      </div>
      <div style={{ background: 'white', borderRadius: 10, padding: '2.5rem', boxShadow: '0 2px 16px rgba(8,14,26,0.07)', border: '1px solid var(--mist)' }}>
        <ProductForm mode="create" />
      </div>
    </div>
  );
}