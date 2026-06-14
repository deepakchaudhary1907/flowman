// app/layout.tsx  ← ROOT LAYOUT
// ⚠️  NO Navbar here anymore — moved to app/(public)/layout.tsx
//     This file only sets up <html>, <body>, fonts, and global metadata.
//     Both admin routes (app/admin/*) and public routes (app/(public)/*)
//     inherit from this root layout, but ONLY public pages get the
//     site Navbar, via their own group layout below.

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flowman Engineers — Process Control Instrumentation',
  description:
    'ISO 9001:2015 certified manufacturer & exporter of Rotameters, Level Gauges, Pipe Fittings and FRP Grating. Trusted in 15+ countries.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Google Fonts — preconnect first, then stylesheet */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800&family=Barlow:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}