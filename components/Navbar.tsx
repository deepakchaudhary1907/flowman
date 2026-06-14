'use client';
// components/Navbar.tsx — WHITE HEADER, big logo, blue accents
// Import ONLY in app/layout.tsx — never in (public)/layout.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category { id: string; name: string; slug: string; }

export default function Navbar() {
  const [open,       setOpen]       = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const [showDrop,   setShowDrop]   = useState(false);
  const [mobProds,   setMobProds]   = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);
  const path    = usePathname();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Scroll behaviour ──────────────────────────────────────
     - scrolled:      adds shadow/border once user scrolls past 10px
     - topBarHidden:  the thin top contact bar (email/phone strip)
                      collapses when scrolling DOWN and reappears
                      when scrolling UP or near the top.
     - The MAIN nav row (logo + links) stays fixed/visible always —
       only the top bar above it hides.
  ─────────────────────────────────────────────────────────── */
  const [topBarHidden, setTopBarHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);

      if (y < 80) {
        setTopBarHidden(false);            // always show near top
      } else if (y > lastY + 4) {
        setTopBarHidden(true);             // scrolling down → hide top bar
        setShowDrop(false);
        setOpen(false);
      } else if (y < lastY - 4) {
        setTopBarHidden(false);            // scrolling up → show top bar
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => { if (Array.isArray(d)) setCategories(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowDrop(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => { setShowDrop(false); setOpen(false); }, [path]);

  const CAT_ICONS: Record<string, string> = {
    'rotameters': '⚙', 'level-gauges': '◫', 'pipe-fittings': '⬡',
    'frp-grating': '▦', 'float-level-switches': '◈', default: '⊕',
  };
  const onProds = path.startsWith('/products');

  return (
    <>
      <style>{`
        /* ── NAV LINKS (white bg, dark text) ── */
        .nl {
          font-family: 'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight: 700; font-size: 0.9rem; letter-spacing: 1.2px;
          text-transform: uppercase; text-decoration: none; color: #3a4a5c;
          padding: 0.46rem 0.95rem; border-radius: 4px;
          border-bottom: 2px solid transparent;
          display: inline-block; line-height: 1;
          transition: color .18s, background .18s, border-color .18s;
        }
        .nl:hover  { color: #4bb6e8; }
        .nl.active { color: #4bb6e8; background: rgba(75,182,232,.08); border-bottom-color: #4bb6e8; }

        /* products btn */
        .pb {
          font-family: 'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight: 700; font-size: 0.9rem; letter-spacing: 1.2px;
          text-transform: uppercase; color: #3a4a5c;
          padding: 0.46rem 0.95rem; border-radius: 4px;
          border: none; border-bottom: 2px solid transparent;
          background: transparent; cursor: pointer;
          display: flex; align-items: center; gap: 5px; line-height: 1;
          transition: color .18s, background .18s, border-color .18s;
        }
        .pb:hover  { color: #4bb6e8; }
        .pb.active { color: #4bb6e8; background: rgba(75,182,232,.08); border-bottom-color: #4bb6e8; }
        .pb .chev  { font-size: 0.55rem; display: inline-block; transition: transform .22s; }
        .pb.open .chev { transform: rotate(180deg); }

        /* get quote */
        .qbtn {
          font-family: 'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight: 700; font-size: 0.85rem; letter-spacing: 1.5px;
          text-transform: uppercase; text-decoration: none;
          color: #fff; background: #4bb6e8; border: 2px solid #4bb6e8;
          padding: 0.54rem 1.3rem; border-radius: 4px;
          display: inline-block; line-height: 1; white-space: nowrap;
          transition: background .2s, border-color .2s, color .2s, transform .18s, box-shadow .18s;
        }
        .qbtn:hover { background: #2a9fd6; border-color: #2a9fd6; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(75,182,232,.35); }

        /* dropdown panel */
        /*
          Dropdown wrapper sits directly under the button with NO gap —
          a transparent "bridge" padding keeps the hover area continuous
          so moving the cursor from the button down into the menu never
          triggers mouseleave on the parent .pb-wrap.
        */
        .pb-wrap { position: relative; }
        .ddp-bridge {
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          padding-top: 8px;     /* the old "gap", now part of the hoverable area */
          z-index: 500;
        }
        .ddp {
          background: #fff; border-radius: 12px;
          border: 1px solid #dde2e8;
          box-shadow: 0 20px 56px rgba(30,34,41,.16), 0 4px 12px rgba(30,34,41,.08);
          overflow: hidden; min-width: 260px; max-height: 440px; overflow-y: auto;
          animation: ddIn .18s ease forwards;
        }
        @keyframes ddIn {
          from { opacity:0; transform: translateY(-8px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .ddh  { padding: .85rem 1.3rem; background: #1e2229; border-bottom: 1px solid rgba(75,182,232,.15); }
        .ddhl { font-family: 'DM Mono','Courier New',monospace; font-size:.56rem; letter-spacing:2.5px; text-transform:uppercase; color:#4bb6e8; margin-bottom:3px; }
        .ddht { font-family: 'Barlow Condensed','Arial Narrow',Arial,sans-serif; font-weight:700; font-size:1rem; color:#fff; }

        .ddi {
          display:flex; align-items:center; gap:.85rem;
          padding:.8rem 1.3rem; text-decoration:none; color:#1e2229;
          font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight:600; font-size:.96rem;
          border-bottom:1px solid #f4f6f8;
          transition:background .14s,color .14s;
        }
        .ddi:last-child    { border-bottom:none; }
        .ddi:hover         { background:#f0f6fb; color:#1e8fc0; }
        .ddi:hover .dda   { transform:translateX(3px); color:#4bb6e8; }
        .ddic { width:34px; height:34px; border-radius:7px; flex-shrink:0; background:rgba(75,182,232,.10); color:#1e8fc0; display:flex; align-items:center; justify-content:center; font-size:1rem; }
        .dda  { margin-left:auto; font-size:.85rem; color:#8a9baa; transition:transform .15s,color .15s; }
        .ddi.ft { background:#f4f6f8; font-weight:700; color:#1e8fc0 !important; border-top:1.5px solid #dde2e8; }
        .ddi.ft .ddic { background:rgba(75,182,232,.14); color:#4bb6e8; }

        /* nav sep */
        .nsep { width:1px; height:22px; background:#dde2e8; margin:0 8px; flex-shrink:0; }

        /* top bar */
        .tb-link  { font-family:'Barlow',Arial,sans-serif; font-size:0.7rem; color:#6b7280; text-decoration:none; transition:color .15s; }
        .tb-link:hover { color:#4bb6e8; }
        .tb-phone { font-family:'DM Mono','Courier New',monospace; font-size:0.68rem; color:#1e8fc0; text-decoration:none; font-weight:500; }
        .tb-phone:hover { color:#4bb6e8; }

        /* mobile menu */
        .mmenu { background:#fff; border-top:1px solid #dde2e8; padding:0 20px 20px; }
        .mbl {
          display:block;
          font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight:700; font-size:1.05rem; letter-spacing:1.3px; text-transform:uppercase;
          text-decoration:none; color:#3a4a5c;
          padding:.7rem 0; border-bottom:1px solid #f0f4f8;
          transition:color .15s;
        }
        .mbl:hover  { color:#4bb6e8; }
        .mbl.active { color:#4bb6e8; }
        .mpb {
          display:flex; align-items:center; justify-content:space-between; width:100%;
          font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight:700; font-size:1.05rem; letter-spacing:1.3px; text-transform:uppercase;
          background:none; border:none; border-bottom:1px solid #f0f4f8;
          padding:.7rem 0; cursor:pointer; color:#3a4a5c;
        }
        .mc {
          display:flex; align-items:center; gap:.65rem;
          padding:.58rem .75rem; text-decoration:none; color:#6b7280;
          font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight:600; font-size:.93rem; border-radius:6px;
          transition:background .14s,color .14s; margin-bottom:2px;
        }
        .mc:hover       { background:rgba(75,182,232,.07); color:#1e2229; }
        .mc.brand       { color:#4bb6e8; font-weight:700; }
        .mc.brand:hover { color:#2a9fd6; }

        /* burger */
        .burger {
          width:42px; height:42px; border-radius:6px; flex-shrink:0;
          background:rgba(75,182,232,.08); border:1.5px solid rgba(75,182,232,.25);
          color:#1e2229; font-size:1.3rem; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:background .18s;
        }
        .burger:hover { background:rgba(75,182,232,.15); }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        /* ── WHITE BACKGROUND — always, with subtle shadow on scroll ──
           Header itself never translates/hides — it's always visible.
        ── */
        background: '#ffffff',
        borderBottom: scrolled ? '1px solid #dde2e8' : '1px solid #e8edf2',
        boxShadow: scrolled ? '0 2px 16px rgba(30,34,41,0.10)' : '0 1px 4px rgba(30,34,41,0.06)',
        transition: 'box-shadow .3s, border-color .3s',
      }}>
        {/* ── TOP CONTACT BAR ──
            Collapses smoothly (max-height + opacity) when scrolling
            down, reappears when scrolling up / near top.
            The main nav row below is completely unaffected.
        ── */}
        {!isMobile && (
          <div style={{
            background: '#f8fafc',
            borderBottom: topBarHidden ? '0px solid transparent' : '1px solid #e8edf2',
            maxHeight: topBarHidden ? 0 : 34,
            opacity: topBarHidden ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height .28s ease, opacity .2s ease, border-color .28s ease',
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24 }}>
              <a href="mailto:flowmanengg@gmail.com" className="tb-link">flowmanengg@gmail.com</a>
              <a href="tel:+919725944834" className="tb-phone">+91-9725944834</a>
            </div>
          </div>
        )}

        {/* ── MAIN NAV ROW — always visible, fixed at top ── */}
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>

          {/* ════════════════════════════════════════
              LOGO — direct on white bg, no pill needed
              Logo has white bg naturally — it just sits
              on the white header with no wrapper box.
              We add a very subtle border so it has presence.
          ════════════════════════════════════════ */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }} aria-label="Flowman Engineers — Home">
            <img
              src="/flowman-logo.svg"
              alt="Flowman Engineers"
              style={{
                height: 170,          /* big and clear — matches the nav height nicely */
                width: 'auto',
                maxWidth: 260,
                objectFit: 'contain',
                display: 'block',
              }}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('.png')) {
                  img.src = '/flowman-logo.png';
                } else {
                  /* text fallback */
                  img.style.display = 'none';
                  const fb = img.nextElementSibling as HTMLElement | null;
                  if (fb) fb.style.display = 'flex';
                }
              }}
            />
            {/* Text fallback */}
            <div style={{ display: 'none', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 7, background: '#4bb6e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>FE</div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#4bb6e8', lineHeight: 1 }}>FLOWMAN</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#1e2229', lineHeight: 1.2 }}>ENGINEERS</div>
              </div>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              <Link href="/" className={`nl${path === '/' ? ' active' : ''}`}>Home</Link>

              <div ref={dropRef} className="pb-wrap"
                onMouseEnter={() => setShowDrop(true)}
                onMouseLeave={() => setShowDrop(false)}>
                <button className={`pb${onProds || showDrop ? ' active' : ''}${showDrop ? ' open' : ''}`}
                  onClick={() => setShowDrop(p => !p)}>
                  Products <span className="chev">▾</span>
                </button>
                {showDrop && (
                  <div className="ddp-bridge">
                    <div className="ddp">
                      <div className="ddh">
                        <div className="ddhl">Browse By</div>
                        <div className="ddht">Product Categories</div>
                      </div>
                      {categories.map(cat => (
                        <Link key={cat.id} href={`/products?category=${cat.slug}`}
                          className="ddi" onClick={() => setShowDrop(false)}>
                          <div className="ddic">{CAT_ICONS[cat.slug] ?? CAT_ICONS.default}</div>
                          <span>{cat.name}</span>
                          <span className="dda">›</span>
                        </Link>
                      ))}
                      <Link href="/products" className="ddi ft" onClick={() => setShowDrop(false)}>
                        <div className="ddic">☰</div>
                        <span>All Products</span>
                        <span className="dda">›</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {([
                ['/about',   'About'],
                ['/contact', 'Contact'],
              ] as const).map(([href, label]) => (
                <Link key={href} href={href} className={`nl${path.startsWith(href) ? ' active' : ''}`}>{label}</Link>
              ))}

              <div className="nsep" />
              <Link href="/contact" className="qbtn">Get Quote</Link>
            </nav>
          )}

          {/* ── MOBILE BURGER ── */}
          {isMobile && (
            <button className="burger" onClick={() => setOpen(p => !p)} aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? '✕' : '≡'}
            </button>
          )}
        </div>

        {/* ── MOBILE MENU ── */}
        {isMobile && open && (
          <div className="mmenu">
            <Link href="/" className={`mbl${path === '/' ? ' active' : ''}`} onClick={() => setOpen(false)}>Home</Link>

            <div>
              <button className="mpb" onClick={() => setMobProds(p => !p)}
                style={{ color: onProds ? '#4bb6e8' : '#3a4a5c' }}>
                Products
                <span style={{ fontSize: '.65rem', display: 'inline-block', transition: 'transform .22s', transform: mobProds ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {mobProds && (
                <div style={{ padding: '4px 0 8px 4px' }}>
                  {categories.map((cat, i) => {
                    const icons = ['⚙','◫','⬡','▦','◈','⊕'];
                    return (
                      <Link key={cat.id} href={`/products?category=${cat.slug}`} className="mc"
                        onClick={() => { setOpen(false); setMobProds(false); }}>
                        <span style={{ width: 18, textAlign: 'center', fontSize: '.9rem', flexShrink: 0 }}>{icons[i % icons.length]}</span>
                        {cat.name}
                      </Link>
                    );
                  })}
                  <Link href="/products" className="mc brand" onClick={() => { setOpen(false); setMobProds(false); }}>
                    <span style={{ width: 18, textAlign: 'center', fontSize: '.9rem', flexShrink: 0 }}>☰</span>
                    All Products
                  </Link>
                </div>
              )}
            </div>

            {([
              ['/about',   'About'],
              ['/contact', 'Contact'],
            ] as const).map(([href, label]) => (
              <Link key={href} href={href} className={`mbl${path.startsWith(href) ? ' active' : ''}`} onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <Link href="/contact" className="qbtn"
              style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}
              onClick={() => setOpen(false)}>Get a Quote</Link>
          </div>
        )}
      </header>
    </>
  );
}