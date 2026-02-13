import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Koach Ha-Tefillah Prayer Conference 2026',
  description: '5 Days Prayer Feaster - February 18-22, 2026 at Habitat Auditorium, Fosu. Join us for powerful nights of prayer and worship. #ThereIsPowerInMyPrayers',
  keywords: 'prayer conference, Koach Ha-Tefillah, Church of Pentecost, Fosu, youth ministry, prayer feaster, Christian conference',
  openGraph: {
    title: 'Koach Ha-Tefillah Prayer Conference 2026',
    description: '5 Days of powerful prayer and worship - Feb 18-22, 2026',
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