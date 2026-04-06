import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nectalabs.com'),
  title: {
    default: 'NECTA Labs — Organic Functional Infusions for Coffee & Tea',
    template: '%s | NECTA Labs',
  },
  description: 'Premium organic functional infusions with Lion\'s Mane, Reishi, Ashwagandha & more. Add to any drink. Research-backed doses. UK made.',
  authors: [{ name: 'NECTA Labs' }],
  openGraph: {
    type: 'website',
    siteName: 'NECTA Labs',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nectalabs',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'NECTA Labs',
  url: 'https://nectalabs.com',
  description: 'Premium organic functional infusions with clinically-dosed adaptogens. UK-made, organic certified.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
    addressRegion: 'England',
  },
  sameAs: [
    'https://instagram.com/necta_syrups',
    'https://tiktok.com/@nectalabs',
  ],
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NECTA Labs',
  url: 'https://nectalabs.com',
  logo: 'https://nectalabs.com/favicon.png',
  description: 'Premium organic functional infusions with clinically-dosed adaptogens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
