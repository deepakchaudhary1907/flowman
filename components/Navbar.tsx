'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category { id: string; name: string; slug: string; description: string; }

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    const scroll = () => setScrolled(window.scrollY > 20);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('scroll', scroll);
    return () => { window.removeEventListener('resize', check); window.removeEventListener('scroll', scroll); };
  }, []);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCategories(data);
    }).catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setShowDropdown(false); setOpen(false); }, [path]);

  const CATEGORY_ICONS: Record<string, string> = {
    'rotameters': '⚙', 'level-gauges': '◫', 'pipe-fittings': '⬡',
    'frp-grating': '▦', 'float-level-switches': '◈', 'default': '⊕',
  };

  const productsActive = path.startsWith('/products');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(8,14,26,0.97)' : 'var(--ink)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
      transition: 'all 0.3s',
    }}>
      <style>{`
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 1px);
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(8,14,26,0.25), 0 4px 12px rgba(8,14,26,0.1);
          border: 1px solid var(--mist);
          overflow: hidden;
          min-width: 220px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 200;
          animation: dropIn 0.18s ease forwards;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .drop-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.2rem;
          text-decoration: none;
          color: var(--ink);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.15s;
          border-bottom: 1px solid var(--fog);
        }
        .drop-item:last-child { border-bottom: none; }
        .drop-item:hover { background: var(--fog); color: var(--cobalt); }
        .drop-item:hover .drop-arrow { transform: translateX(3px); }
        .drop-arrow { font-size: 0.7rem; color: var(--slate); margin-left: auto; transition: transform 0.15s; }
        .drop-icon { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
        .mob-cat-item {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.55rem 0.75rem; text-decoration: none;
          color: var(--slate); font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600; font-size: 0.9rem; border-radius: 6px;
          transition: all 0.15s; margin-bottom: 2px;
        }
        .mob-cat-item:hover { background: rgba(255,255,255,0.06); color: white; }
        .prod-nav-btn { position: relative; }
      `}</style>

      {/* Top contact bar — desktop only */}
      {!isMobile && (
        <div style={{ background: 'rgba(201,136,42,0.07)', borderBottom: '1px solid rgba(201,136,42,0.12)', padding: '4px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', gap: '1.5rem' }}>
            <a href="mailto:flowmanengg@gmail.com" style={{ fontSize: '0.7rem', color: 'var(--slate)', textDecoration: 'none', fontFamily: 'Barlow, sans-serif' }}>flowmanengg@gmail.com</a>
            <a href="tel:+919725944834" style={{ fontSize: '0.68rem', color: 'var(--gold)', textDecoration: 'none', fontFamily: 'DM Mono, monospace' }}>+91-9725944834</a>
          </div>
        </div>
      )}

      {/* Main nav row */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img src="/flowman-logo.svg" alt="Flowman Engineers"
            style={{ height: 48, width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }} />
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Home */}
            <Link href="/" style={{ padding: '0.42rem 0.9rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', color: path === '/' ? 'var(--gold)' : 'var(--mist)', borderRadius: 4, transition: 'color 0.18s', background: path === '/' ? 'rgba(201,136,42,0.1)' : 'transparent', borderBottom: `2px solid ${path === '/' ? 'var(--gold)' : 'transparent'}` }}
              onMouseEnter={e => { if (path !== '/') (e.currentTarget as HTMLElement).style.color = 'white'; }}
              onMouseLeave={e => { if (path !== '/') (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}>
              Home
            </Link>

            {/* Products with dropdown */}
            <div ref={dropdownRef} className="prod-nav-btn" style={{ position: 'relative' }} onMouseEnter={() => setShowDropdown(true)}
  onMouseLeave={() => setShowDropdown(false)} >
              <button
                onClick={() => setShowDropdown(p => !p)}
                style={{
                  padding: '0.42rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '1px',
                  textTransform: 'uppercase', background: productsActive ? 'rgba(201,136,42,0.1)' : 'transparent',
                  border: 'none', borderBottom: `2px solid ${productsActive ? 'var(--gold)' : 'transparent'}`,
                  color: productsActive || showDropdown ? 'var(--gold)' : 'var(--mist)',
                  borderRadius: 4, cursor: 'pointer', transition: 'color 0.18s',
                }}
                onMouseEnter={e => { if (!productsActive && !showDropdown) (e.currentTarget as HTMLElement).style.color = 'white'; }}
                onMouseLeave={e => { if (!productsActive && !showDropdown) (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}
              >
                Products
                <span style={{ fontSize: '0.55rem', transition: 'transform 0.2s', display: 'inline-block', transform: showDropdown ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="nav-dropdown">
                  {/* Header */}
                  <div style={{ padding: '0.75rem 1.2rem', background: 'var(--ink)', borderBottom: '1px solid var(--mist)' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '2px' }}>Browse By</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>Product Categories</div>
                  </div>
                  {/* Categories list */}
                  {categories.map((cat, i) => {
                    const colors = ['rgba(28,95,168,0.1)', 'rgba(201,136,42,0.1)', 'rgba(26,107,90,0.1)', 'rgba(122,58,24,0.1)', 'rgba(28,95,168,0.1)', 'rgba(201,136,42,0.1)'];
                    const textColors = ['var(--cobalt)', 'var(--gold)', '#1a6b5a', '#7a3a18', 'var(--cobalt)', 'var(--gold)'];
                    const icon = CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS.default;
                    return (
                      <Link key={cat.id} href={`/products?category=${cat.slug}`} className="drop-item" onClick={() => setShowDropdown(false)}>
                        <div className="drop-icon" style={{ background: colors[i % colors.length], color: textColors[i % textColors.length] }}>{icon}</div>
                        <span>{cat.name}</span>
                        <span className="drop-arrow">›</span>
                      </Link>
                    );
                  })}
                  {/* View All footer */}
                  <Link href="/products" className="drop-item" onClick={() => setShowDropdown(false)}
                    style={{ background: 'var(--fog)', fontWeight: 700, color: 'var(--cobalt)', borderTop: '2px solid var(--mist)', borderBottom: 'none' }}>
                    <div className="drop-icon" style={{ background: 'rgba(28,95,168,0.1)', color: 'var(--cobalt)' }}>☰</div>
                    <span>All Products</span>
                    <span className="drop-arrow">›</span>
                  </Link>
                </div>
              )}
            </div>

            {/* About */}
            {[[ '/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => {
              const active = path.startsWith(href);
              return (
                <Link key={href} href={href} style={{ padding: '0.42rem 0.9rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', color: active ? 'var(--gold)' : 'var(--mist)', borderRadius: 4, transition: 'color 0.18s', background: active ? 'rgba(201,136,42,0.1)' : 'transparent', borderBottom: `2px solid ${active ? 'var(--gold)' : 'transparent'}` }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'white'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}>
                  {label}
                </Link>
              );
            })}

            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', margin: '0 6px' }} />
            <Link href="/contact" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.78rem' }}>Get Quote</Link>
          </nav>
        )}

        {/* Mobile burger */}
        {isMobile && (
          <button onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', width: 36, height: 36, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>
            {open ? '✕' : '≡'}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && open && (
        <div style={{ background: 'var(--ink-80)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.5rem 1.25rem 1.25rem' }}>
          <Link href="/" onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.65rem 0', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--mist)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Home</Link>

          {/* Mobile Products accordion */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setMobileProductsOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.65rem 0', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--mist)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Products
              <span style={{ fontSize: '0.65rem', transition: 'transform 0.2s', display: 'inline-block', transform: mobileProductsOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>
            {mobileProductsOpen && (
              <div style={{ paddingBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                {categories.map((cat, i) => {
                  const icons = ['⚙', '◫', '⬡', '▦', '◈', '⊕'];
                  return (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`} className="mob-cat-item" onClick={() => { setOpen(false); setMobileProductsOpen(false); }}>
                      <span style={{ fontSize: '0.85rem', width: 18, textAlign: 'center' }}>{icons[i % icons.length]}</span>
                      {cat.name}
                    </Link>
                  );
                })}
                <Link href="/products" className="mob-cat-item" onClick={() => { setOpen(false); setMobileProductsOpen(false); }}
                  style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  <span style={{ fontSize: '0.85rem', width: 18, textAlign: 'center' }}>☰</span>
                  All Products
                </Link>
              </div>
            )}
          </div>

          {[[ '/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.65rem 0', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--mist)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{label}</Link>
          ))}
          <Link href="/contact" className="btn btn-primary" style={{ marginTop: '0.85rem', display: 'block', textAlign: 'center' }} onClick={() => setOpen(false)}>Get a Quote</Link>
        </div>
      )}
    </header>
  );
}