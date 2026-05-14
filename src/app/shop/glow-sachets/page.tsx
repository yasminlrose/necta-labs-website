import type { Metadata } from 'next';
import { Suspense } from 'react';
import SachetProductPage from '@/views/SachetProductPage';

const title = 'NECTA GLOW Sachets — Marine Collagen 2.5g | 7, 14, 30 or 90-Day Box';
const description =
  'GLOW organic functional infusion sachets: Marine Collagen 2.5g, Hyaluronic Acid 120mg, CoQ10 80mg. Single-serve, tear-and-pour. Cherry Almond. From £12 for a 7-day trial.';
const canonical = 'https://www.nectalabs.com/shop/glow-sachets';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['collagen sachets UK', 'marine collagen sachets UK', 'skin supplement sachets', 'hyaluronic acid sachet UK', 'collagen single serve UK', 'beauty supplement sachets UK'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NECTA GLOW sachets' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA GLOW Organic Functional Infusion Sachets',
  description,
  image: 'https://www.nectalabs.com/og-image.jpg',
  sku: 'NECTA-GLOW-SACHETS',
  brand: { '@type': 'Brand', name: 'NECTA Labs' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: 45,
    availability: 'https://schema.org/PreOrder',
    url: canonical,
    priceValidUntil: '2026-12-31',
    seller: { '@type': 'Organization', name: 'NECTA Labs' },
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.nectalabs.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://www.nectalabs.com/shop' },
    { '@type': 'ListItem', position: 3, name: 'GLOW Sachets', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is in NECTA GLOW sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each NECTA GLOW sachet contains Marine Collagen 2.5g, Hyaluronic Acid 120mg, and CoQ10 80mg. Cherry Almond flavour. This is the same complete skin health formula as the GLOW pump bottle, in a convenient single-serve tear-and-pour sachet.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much marine collagen do I need daily?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clinical research on oral collagen supplementation uses 2.5–10g per day. NECTA GLOW sachets contain 2.5g of marine collagen — at the minimum clinical threshold shown to improve skin elasticity and hydration in studies. Many cheaper collagen products contain under 1g — too low to replicate the research results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add GLOW sachets to hot drinks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — NECTA GLOW sachets are fully stable in hot and cold drinks. Add to coffee, tea, warm water, or cold smoothies. The Cherry Almond flavour works particularly well in warm water or oat milk as a morning or evening skin routine drink.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long until I see skin results from GLOW sachets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Collagen supplementation studies typically show measurable improvements in skin elasticity and hydration after 4–12 weeks of consistent daily use. Hyaluronic acid improvements in skin moisture can be noticed earlier. Give GLOW sachets 8–12 weeks of daily use for a fair assessment of results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are GLOW sachets suitable for vegans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NECTA GLOW contains marine collagen derived from fish, so it is not vegan — though it is pescatarian-friendly. The Hyaluronic Acid and CoQ10 components are vegan. If you follow a vegan diet, NECTA FOCUS, CALM, and IMMUNITY are all fully vegan.',
      },
    },
  ],
};

export default function GlowSachetsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><SachetProductPage slug="glow-sachets" /></Suspense>
    </>
  );
}
