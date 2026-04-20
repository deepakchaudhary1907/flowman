// app\(public)\products\[id]\page.tsx
import { getProducts, getCategories, getProductById } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
const W = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getCategories();
  const product = await getProductById(id);
  if (!product) notFound();

  const category = categories.find(c => c.id === product.categoryId);
  const allProducts = await getProducts();
  const related = allProducts.filter(p => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 3);

  return (
    <div>
      <style>{`
        .related-card { transition: all 0.25s; }
        .related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(8,14,26,0.12); border-color: rgba(201,136,42,0.3) !important; }
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .desc-flex { flex-direction: column !important; }
          .desc-sidebar { position: static !important; flex: none !important; width: 100% !important; }
        }
        @media (max-width: 600px) {
          .spec-grid { grid-template-columns: 1fr 1fr !important; }
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background: 'var(--ink)', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={W}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.66rem', color: 'var(--slate)', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Home</Link>
            <span style={{ opacity: 0.3 }}>›</span>
            <Link href="/products" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Products</Link>
            {category && <><span style={{ opacity: 0.3 }}>›</span><Link href={`/products?category=${category.slug}`} style={{ color: 'var(--slate)', textDecoration: 'none' }}>{category.name}</Link></>}
            <span style={{ opacity: 0.3 }}>›</span>
            <span style={{ color: 'var(--gold)' }}>{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main product section */}
      <div style={{ ...W, paddingTop: '2.8rem', paddingBottom: '1.5rem' }}>
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
          {/* Image */}
          <div>
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 5px 28px rgba(8,14,26,0.12)', border: '1px solid var(--mist)', background: 'linear-gradient(145deg, var(--ink-80), var(--steel))', position: 'relative', minHeight: 300 }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '22px 22px', zIndex: 0 }} />
              {product.image ? (
                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', position: 'relative', zIndex: 1, maxHeight: 400, background: 'rgba(255,255,255,0.03)' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '3.5rem', opacity: 0.18, color: 'white' }}>⚙</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '2.5px', color: 'rgba(255,255,255,0.18)', marginTop: '0.6rem' }}>FLOWMAN ENGINEERS</div>
                </div>
              )}
            </div>
          </div>
          {/* Info */}
          <div>
            {category && <div style={{ display: 'inline-block', background: 'rgba(201,136,42,0.12)', color: 'var(--gold)', border: '1px solid rgba(201,136,42,0.3)', padding: '3px 10px', borderRadius: 2, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '0.85rem' }}>{category.name}</div>}
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)', color: 'var(--ink)', marginBottom: '0.7rem', lineHeight: 1.05 }}>{product.title}</h1>
            <p style={{ fontSize: '0.93rem', color: '#6b7280', lineHeight: 1.75, marginBottom: '1.4rem', fontWeight: 300 }}>{product.shortDescription}</p>
            <div style={{ background: 'var(--fog)', border: '1px solid var(--mist)', borderRadius: 8, padding: '1.1rem', marginBottom: '1.4rem' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '3px', color: 'var(--slate)', marginBottom: '0.85rem', textTransform: 'uppercase' }}>Specifications</div>
              <div className="spec-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {[['Category', category?.name || '—'], ['Manufacturer', 'Flowman Engineers'], ['Certification', 'ISO 9001:2015'], ['Origin', 'Gujarat, India']].map(([label, val]) => (
                  <div key={label} style={{ paddingBottom: '0.7rem', borderBottom: '1px solid var(--mist)' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.53rem', letterSpacing: '2px', color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '0.22rem' }}>{label}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: 'var(--ink)', fontSize: '0.92rem' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary">Request Quote →</Link>
              <Link href="/contact" className="btn btn-steel" style={{ padding: '0.68rem 1.3rem' }}>Contact Us</Link>
              <a
                href={`https://wa.me/919725944834?text=${encodeURIComponent('Hi, I am interested in your product: ' + product.title + '. Please share more details and pricing.')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.68rem 1.3rem', background: '#25D366', color: 'white', borderRadius: 3, textDecoration: 'none', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '1px', textTransform: 'uppercase', transition: 'background 0.2s' }}
                // onMouseOver={e => (e.currentTarget.style.background = '#1ebe5d')}
                // onMouseOut={e => (e.currentTarget.style.background = '#25D366')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.091.535 4.06 1.474 5.778L0 24l6.395-1.457A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.163-1.418l-.368-.216-3.796.865.867-3.718-.237-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Description + Sidebar */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--mist)', paddingTop: '2.5rem' }}>
          <div className="desc-flex" style={{ display: 'flex', gap: '2.8rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 2, minWidth: 0 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.45rem' }}>Technical Details</div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.55rem', color: 'var(--ink)', marginBottom: '0.55rem' }}>Product Information</h2>
              <div style={{ width: 34, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--gold-lt))', borderRadius: 2, marginBottom: '1.2rem' }} />
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
            <div className="desc-sidebar" style={{ flex: '0 0 250px', position: 'sticky', top: 85 }}>
              <div style={{ background: 'var(--ink)', borderRadius: 10, padding: '1.4rem' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '3px', color: 'var(--gold)', marginBottom: '0.6rem' }}>GET A QUOTE</div>
                <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'white', marginBottom: '0.45rem' }}>Interested in this?</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate)', lineHeight: 1.65, marginBottom: '1.1rem' }}>Contact our sales team for pricing, availability and custom specs.</p>
                <Link href="/contact" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.82rem', width: '100%' }}>Request a Quote →</Link>
                <div style={{ marginTop: '1.1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'white', marginBottom: '0.18rem' }}>Deepak Chaudhary</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate)' }}>Sales – Export & Domestic</div>
                  <a href="tel:+919725944834" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.76rem', color: 'var(--gold)', textDecoration: 'none', display: 'block', marginTop: '0.35rem' }}>+91-9725944834</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--mist)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.45rem' }}>More Like This</div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.55rem', color: 'var(--ink)', marginBottom: '1.4rem' }}>Related Products</h2>
            <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="related-card" style={{ background: 'white', border: '1px solid var(--mist)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(8,14,26,0.05)' }}>
                    <div style={{ height: 145, background: 'linear-gradient(145deg, var(--ink-80), var(--steel))', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
                      {p.image ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} /> : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', opacity: 0.22, color: 'white' }}>⚙</div>}
                    </div>
                    <div style={{ padding: '0.95rem 1rem' }}>
                      <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.32rem' }}>{p.title}</h3>
                      <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.55 }}>{p.shortDescription}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}