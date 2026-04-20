// app/(public)/products/page.tsx

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

interface Category { id: string; name: string; slug: string; description: string; image?: string; }
interface Product { id: string; title: string; slug: string; shortDescription: string; image: string; categoryId: string; }

const CAT_COLORS = [
  'linear-gradient(135deg, #1c5fa8 0%, #0d3a6e 100%)',
  'linear-gradient(135deg, #c9882a 0%, #7a5018 100%)',
  'linear-gradient(135deg, #1a6b5a 0%, #0e3d34 100%)',
  'linear-gradient(135deg, #5a2d8c 0%, #32186e 100%)',
  'linear-gradient(135deg, #7a3a18 0%, #c9882a 100%)',
  'linear-gradient(135deg, #1c5fa8 0%, #1a6b5a 100%)',
];

const W = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCat = searchParams.get('category') || null;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCat);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || null;
    setActiveCategory(cat);
  }, [searchParams]);

  const activeCatObj = categories.find(c => c.slug === activeCategory);

  const filteredProducts = products.filter(p => {
    const matchCat = !activeCategory || p.categoryId === activeCatObj?.id;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function selectCategory(slug: string) {
    setActiveCategory(slug);
    setSearch('');
    router.push(`/products?category=${slug}`, { scroll: false });
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function clearCategory() {
    setActiveCategory(null);
    setSearch('');
    router.push('/products', { scroll: false });
  }

  return (
    <div>
      <style>{`
        .cat-card { position: relative; overflow: hidden; cursor: pointer; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s; border-radius: 12px; }
        .cat-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 28px 60px rgba(8,14,26,0.35); }
        .cat-card:hover .cat-overlay { opacity: 1; }
        .cat-card:hover .cat-arrow { transform: translateX(4px); opacity: 1; }
        .cat-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.15); opacity: 0; transition: opacity 0.3s; }
        .cat-arrow { opacity: 0.5; transition: transform 0.3s, opacity 0.3s; display: inline-block; }
        .cat-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
        .cat-card:hover .cat-img { transform: scale(1.06); }
        .prod-card { transition: all 0.25s; }
        .prod-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(8,14,26,0.13); border-color: rgba(201,136,42,0.35) !important; }
        .prod-card:hover .prod-cta { color: var(--gold) !important; }
        .prod-img-wrap { height: 200px; width: 100%; overflow: hidden; position: relative; flex-shrink: 0; background: linear-gradient(145deg, var(--ink-80), var(--steel)); }
        .prod-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
        .prod-img-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: rgba(255,255,255,0.2); }
        .prod-img-texture { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px); background-size: 20px 20px; pointer-events: none; z-index: 1; }
        .prod-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.8rem; color: #6b7280; line-height: 1.6; flex: 1; margin-bottom: 0.9rem; }
        .prod-body { padding: 1.1rem 1.15rem; display: flex; flex-direction: column; min-height: 130px; }
        .prod-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 1.05rem; color: var(--ink); margin-bottom: 0.4rem; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .prod-cta { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 0.73rem; letter-spacing: 1px; text-transform: uppercase; color: var(--cobalt); transition: color 0.2s; margin-top: auto; }
        @media (max-width: 900px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .prod-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .prod-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Page Header */}
      <div style={{ background: 'var(--ink)', padding: '52px 0 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(28,95,168,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={W}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.66rem', color: 'var(--slate)', marginBottom: '0.55rem', letterSpacing: '0.5px', position: 'relative' }}>
            <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.4rem', opacity: 0.35 }}>›</span>
            {activeCategory && activeCatObj ? (
              <>
                <button onClick={clearCategory} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.66rem', padding: 0 }}>Products</button>
                <span style={{ margin: '0 0.4rem', opacity: 0.35 }}>›</span>
                <span style={{ color: 'var(--gold)' }}>{activeCatObj.name}</span>
              </>
            ) : (
              <span style={{ color: 'var(--gold)' }}>Products</span>
            )}
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', color: 'white', letterSpacing: '-0.02em', marginBottom: '0.4rem', position: 'relative' }}>
            {activeCategory && activeCatObj ? activeCatObj.name : 'Product Catalogue'}
          </h1>
          <p style={{ color: 'var(--slate)', fontSize: '0.93rem', fontWeight: 300, position: 'relative' }}>
            {activeCategory && activeCatObj
              ? activeCatObj.description || 'Browse products in this category.'
              : 'Precision-engineered instrumentation for industrial applications worldwide.'}
          </p>
        </div>
      </div>

      {/* ── CATEGORIES VIEW (shown when no category selected) ── */}
      {!activeCategory && (
        <div style={{ background: 'var(--fog)', paddingTop: '3rem', paddingBottom: '4rem' }}>
          <div style={W}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '1.5rem' }}>
              Browse By Category
            </div>
            <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {categories.map((cat, i) => {
                const catProductCount = products.filter(p => p.categoryId === cat.id).length;
                const fallbackBg = CAT_COLORS[i % CAT_COLORS.length];
                return (
                  <div
                    key={cat.id}
                    className="cat-card"
                    onClick={() => selectCategory(cat.slug)}
                    style={{ height: 280, background: fallbackBg }}
                  >
                    {/* Image if exists */}
                    {cat.image && (
                      <img src={cat.image} alt={cat.name} className="cat-img" style={{ position: 'absolute', inset: 0 }} />
                    )}
                    {/* Dark gradient overlay for text legibility */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,26,0.85) 0%, rgba(8,14,26,0.25) 55%, rgba(8,14,26,0.1) 100%)' }} />
                    <div className="cat-overlay" />
                    {/* Content */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.6rem' }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem' }}>
                        {catProductCount} Product{catProductCount !== 1 ? 's' : ''}
                      </div>
                      <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: 'white', margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.4rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cat.description}
                        </p>
                      )}
                      <div style={{ marginTop: '0.85rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold)' }}>
                        View Products <span className="cat-arrow">→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {categories.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--slate)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem' }}>
                No categories yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PRODUCTS VIEW (shown when a category is selected) ── */}
      {activeCategory && (
        <div id="products-section" style={{ background: 'var(--fog)' }}>
          {/* Filter bar */}
          <div style={{ background: 'white', borderBottom: '1px solid var(--mist)', padding: '0.85rem 0', position: 'sticky', top: 60, zIndex: 50, boxShadow: '0 2px 8px rgba(8,14,26,0.06)' }}>
            <div style={{ ...W, display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={clearCategory}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.44rem 0.85rem', background: 'var(--fog)', border: '1.5px solid var(--mist)', borderRadius: 5, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.5px', cursor: 'pointer', color: 'var(--ink)', whiteSpace: 'nowrap' }}
              >
                ← All Categories
              </button>
              <div style={{ position: 'relative', minWidth: 180, flex: '1 1 180px' }}>
                <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)', fontSize: '0.78rem', pointerEvents: 'none' }}>⊕</span>
                <input
                  type="text"
                  placeholder={`Search in ${activeCatObj?.name}…`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.1rem', paddingRight: '0.9rem', paddingTop: '0.52rem', paddingBottom: '0.52rem', border: '1.5px solid var(--mist)', borderRadius: 6, fontSize: '0.85rem', fontFamily: 'Barlow, sans-serif', outline: 'none', background: 'white', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--mist)')}
                />
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                {filteredProducts.length} Result{filteredProducts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div style={{ ...W, paddingTop: '2rem', paddingBottom: '4rem' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--slate)' }}>
                <div style={{ fontSize: '2.5rem', opacity: 0.22, marginBottom: '0.75rem' }}>◈</div>
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem' }}>No products match your search.</p>
                <button onClick={() => setSearch('')} style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', background: 'var(--cobalt)', color: 'white', border: 'none', borderRadius: 6, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                {filteredProducts.map(product => {
                  const cat = categories.find(c => c.id === product.categoryId);
                  return (
                    <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <div className="prod-card" style={{ background: 'white', border: '1px solid var(--mist)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(8,14,26,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div className="prod-img-wrap">
                          <div className="prod-img-texture" />
                          {product.image ? <img src={product.image} alt={product.title} /> : <div className="prod-img-placeholder">⚙</div>}
                          {cat && (
                            <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(201,136,42,0.16)', color: 'var(--gold)', border: '1px solid rgba(201,136,42,0.32)', padding: '2px 8px', borderRadius: 2, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', zIndex: 2 }}>{cat.name}</div>
                          )}
                        </div>
                        <div className="prod-body">
                          <div className="prod-title">{product.title}</div>
                          <div className="prod-desc">{product.shortDescription}</div>
                          <div className="prod-cta">View Details →</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--slate)', letterSpacing: '2px' }}>LOADING…</div>}>
      <ProductsContent />
    </Suspense>
  );
}