import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Divine Worship Splash 2026 | Invitation to Light',
  description: 'Join us for a transformative day of worship with Yefter Nkansah. Saturday, January 31st, 2026 at Casely-Hayford Hall, UCC Campus.',
  keywords: 'worship, divine worship splash, invitation to light, yefter nkansah, UCC campus, cape coast',
  openGraph: {
    title: 'Divine Worship Splash 2026',
    description: 'A transformative day of worship, fellowship, and spiritual growth',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}