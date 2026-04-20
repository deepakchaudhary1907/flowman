import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/db';

export const dynamic = 'force-dynamic';

const W = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

export default async function HomePage() {
  const allProds = await getProducts();
  const products = allProds.slice(0, 6);
  const categories = await getCategories();

  return (
    <div>
      <style>{`
        .cat-card { transition: all 0.25s; }
        .cat-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(8,14,26,0.14); border-color: rgba(201,136,42,0.4) !important; }
        .prod-card { transition: all 0.25s; }
        .prod-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(8,14,26,0.13); border-color: rgba(201,136,42,0.35) !important; }
        .prod-card:hover .prod-cta { color: var(--gold) !important; }
        .prod-img-wrap { height: 190px; width: 100%; overflow: hidden; position: relative; flex-shrink: 0; background: linear-gradient(145deg, var(--ink-80), var(--steel)); }
        .prod-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
        .prod-img-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: rgba(255,255,255,0.2); }
        .prod-img-texture { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px); background-size: 20px 20px; pointer-events: none; }
        .prod-title { font-family: 'Barlow Condensed',sans-serif; font-weight: 700; font-size: 1.05rem; color: var(--ink); margin-bottom: 0.4rem; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .prod-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.8rem; color: #6b7280; line-height: 1.6; flex: 1; margin-bottom: 0.9rem; }
        .prod-body { padding: 1.1rem 1.15rem; display: flex; flex-direction: column; min-height: 130px; }
        .prod-cta { font-family: 'Barlow Condensed',sans-serif; font-weight: 700; font-size: 0.73rem; letter-spacing: 1px; text-transform: uppercase; color: var(--cobalt); transition: color 0.2s; margin-top: auto; }
        .why-card { transition: border-color 0.2s, background 0.2s; }
        .why-card:hover { border-color: rgba(201,136,42,0.4) !important; background: var(--ink-60) !important; }
        .ind-pill { transition: all 0.18s; cursor: default; }
        .ind-pill:hover { background: rgba(201,136,42,0.1) !important; border-color: rgba(201,136,42,0.4) !important; color: var(--gold) !important; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .prod-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-h1 { font-size: clamp(2.4rem, 9vw, 3.8rem) !important; }
          .hero-section { padding: 52px 0 44px !important; }
          .sec-pad { padding: 52px 0 !important; }
        }
        @media (max-width: 600px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .prod-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .hero-stats { gap: 1.5rem !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section" style={{ background: 'var(--ink)', color: 'white', padding: '76px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(28,95,168,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,136,42,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={W}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', position: 'relative' }}>
            {/* Left */}
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>ISO 9001:2015 — Gujarat, India</div>
              <h1 className="hero-h1" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2.6rem, 4.5vw, 4.4rem)', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
                PRECISION<br />
                <span style={{ color: 'var(--gold)' }}>PROCESS</span><br />
                INSTRUMENTS
              </h1>
              <p style={{ fontSize: '0.97rem', color: 'var(--slate)', lineHeight: 1.75, marginBottom: '1.8rem', maxWidth: 420, fontWeight: 300 }}>
                Manufacturer and exporter of Rotameters, Level Gauges, Pipe Fittings and FRP Grating. Trusted across 15+ countries in Chemical, Oil &amp; Gas and Pharma industries.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/products" className="btn btn-primary">Explore Products →</Link>
                <Link href="/contact" className="btn btn-outline">Request Quote</Link>
              </div>
              <div className="hero-stats" style={{ display: 'flex', gap: '2.2rem', marginTop: '2.2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[['7+', 'Years'], ['15+', 'Countries'], ['500+', 'Clients']].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: 'var(--gold)', lineHeight: 1 }}>{num}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: 'var(--slate)', letterSpacing: '2px', marginTop: '3px', textTransform: 'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className="hero-right" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '1.3rem' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '3px', color: 'var(--gold)', marginBottom: '0.55rem' }}>CERTIFICATION</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.55rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>ISO 9001:2015</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginTop: '0.3rem' }}>Internationally recognized quality management</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                {[
                  { label: 'Accuracy', value: '±2% FSD', sub: 'Flow measurement' },
                  { label: 'Pressure', value: '100 Bar', sub: 'Max rating' },
                  { label: 'Temperature', value: '400°C', sub: 'Max operating' },
                  { label: 'Materials', value: 'SS / PP / PTFE', sub: 'Construction' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '0.95rem' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.54rem', letterSpacing: '2px', color: 'var(--slate)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>{item.value}</div>
                    <div style={{ fontSize: '0.7rem', color: '#3a4a5c', marginTop: '2px' }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="sec-pad" style={{ padding: '60px 0', background: 'var(--fog)' }}>
        <div style={W}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>What We Make</div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: 'var(--ink)', margin: 0 }}>Product Categories</h2>
            </div>
            <Link href="/products" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--cobalt)', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {categories.map((cat, i) => {
              const colors = ['var(--cobalt)', 'var(--gold)', '#1a6b5a', '#7a4a18', 'var(--cobalt)', 'var(--gold)'];
              const icons = ['⚙', '◫', '⬡', '▦', '◈', '⊕'];
              const c = colors[i % colors.length];
              return (
                <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="cat-card" style={{ background: 'white', borderRadius: 10, padding: '1.4rem 1.2rem', border: '1px solid var(--mist)', position: 'relative', overflow: 'hidden', height: '100%' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c }} />
                    <div style={{ width: 36, height: 36, background: `rgba(0,0,0,0.05)`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem', fontSize: '1rem', color: c, border: `1px solid rgba(0,0,0,0.06)` }}>{icons[i % icons.length]}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.3rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.77rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '0.8rem' }}>{cat.description}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: c }}>Explore →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="sec-pad" style={{ padding: '60px 0', background: 'white' }}>
        <div style={W}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>Catalogue</div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: 'var(--ink)', margin: 0 }}>Featured Products</h2>
            </div>
            <Link href="/products" className="btn btn-steel" style={{ padding: '0.45rem 1.1rem', fontSize: '0.78rem' }}>View All</Link>
          </div>
          <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {products.map(product => {
              const cat = categories.find(c => c.id === product.categoryId);
              return (
                <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="prod-card" style={{ background: 'white', border: '1px solid var(--mist)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(8,14,26,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="prod-img-wrap">
                      <div className="prod-img-texture" />
                      {product.image ? <img src={product.image} alt={product.title} /> : <div className="prod-img-placeholder">⚙</div>}
                      {cat && <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(201,136,42,0.16)', color: 'var(--gold)', border: '1px solid rgba(201,136,42,0.32)', padding: '2px 8px', borderRadius: 2, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', zIndex: 1 }}>{cat.name}</div>}
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
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="sec-pad" style={{ padding: '60px 0', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.022, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>Our Edge</div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: 'white', margin: 0 }}>Why Flowman Engineers?</h2>
            <div style={{ width: 38, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--gold-lt))', borderRadius: 2, margin: '0.7rem auto 0' }} />
          </div>
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { num: '01', title: 'ISO Certified Quality', desc: 'ISO 9001:2015 certified ensuring consistent quality across every product line.' },
              { num: '02', title: 'Global Export Reach', desc: 'Active in 15+ countries — UAE, Singapore, Malaysia, France, Poland, Bangladesh.' },
              { num: '03', title: '7 Years Expertise', desc: 'Deep domain knowledge in Chemical, Oil & Gas, Fertilizer and Pharma sectors.' },
              { num: '04', title: 'Precision Engineering', desc: '±2% FSD accuracy. Built for 100 bar pressure and 400°C operating temperature.' },
              { num: '05', title: 'Custom Built Solutions', desc: 'Flanged, screwed, TC joint. SS, PP, PTFE — tailored to your exact specification.' },
              { num: '06', title: 'Dedicated Sales Team', desc: 'Direct access to Deepak Chaudhary for export & domestic enquiries.' },
            ].map(item => (
              <div key={item.num} className="why-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '1.4rem' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '0.7rem' }}>{item.num}</div>
                <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'white', marginBottom: '0.45rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate)', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section style={{ padding: '48px 0', background: 'var(--fog)' }}>
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>Market Segments</div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: 'var(--ink)', margin: 0 }}>Industries We Serve</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {['Chemical', 'Petrochemical', 'Fertilizers', 'Water Treatment', 'Refineries', 'Oil and Gas', 'Air Treatment', 'Pharmaceuticals', 'Power Plants', 'Food Processing', 'Paper & Pulp', 'Mining'].map(m => (
              <div key={m} className="ind-pill" style={{ background: 'white', border: '1px solid var(--mist)', color: 'var(--ink)', padding: '0.38rem 0.9rem', borderRadius: 4, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.87rem' }}>{m}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '68px 0', background: 'linear-gradient(135deg, var(--ink) 0%, var(--steel) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(201,136,42,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ ...W, textAlign: 'center', position: 'relative' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>Partner With Us</div>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: 'white', marginBottom: '0.8rem', letterSpacing: '-0.01em' }}>Ready to Start a Project?</h2>
          <p style={{ color: 'var(--slate)', fontSize: '0.97rem', marginBottom: '1.8rem', lineHeight: 1.72, fontWeight: 300 }}>Reach out for export or domestic enquiries. Our team responds within 24 hours.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary">Contact Us Now →</Link>
            <Link href="/products" className="btn btn-outline">Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}