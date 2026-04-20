import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flowman Engineers - Process Control Instrumentation',
  description: 'Leading manufacturer and exporter of Process Control Instrumentation, Pipe Fittings and FRP Grating. ISO 9001:2015 Certified.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}