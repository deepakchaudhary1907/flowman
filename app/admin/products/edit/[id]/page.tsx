// app\admin\products\edit\[id]\page.tsx
import { getProductById } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ fontFamily: 'DM Mono', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--slate)', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to Products</Link>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'DM Mono', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)' }}>Editing</span>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '2.2rem', color: 'var(--ink)', marginTop: '0.3rem' }}>Edit Product</h1>
        <p style={{ color: 'var(--slate)', fontSize: '0.9rem', marginTop: '0.3rem', fontFamily: 'Barlow' }}>
          Updating: <strong style={{ color: 'var(--ink)' }}>{product.title}</strong>
        </p>
      </div>
      <div style={{ background: 'white', borderRadius: 10, padding: '2.5rem', boxShadow: '0 2px 16px rgba(8,14,26,0.07)', border: '1px solid var(--mist)' }}>
        <ProductForm
          mode="edit"
          initial={{
            id: product.id,
            title: product.title,
            shortDescription: product.shortDescription,
            description: product.description,
            categoryId: product.categoryId,
            image: product.image,
          }}
        />
      </div>
    </div>
  );
}