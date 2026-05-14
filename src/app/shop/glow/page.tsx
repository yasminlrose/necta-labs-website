import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductPage from '@/views/ProductPage';

const title = 'NECTA GLOW — Marine Collagen 2.5g for Skin Health';
const description =
  'GLOW organic functional infusion: Marine Collagen 2.5g, Hyaluronic Acid 120mg, CoQ10 80mg. Skin health from the inside out. Cherry Almond flavour. Pump bottle 250ml from £29.';
const canonical = 'https://www.nectalabs.com/shop/glow';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['marine collagen supplement UK', 'collagen drink UK', 'hyaluronic acid supplement', 'skin health drink', 'collagen infusion', 'CoQ10 supplement UK', 'beauty drink UK'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: 'https://www.nectalabs.com/bottle-glow.jpeg', width: 1200, height: 630, alt: 'NECTA GLOW pump bottle' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.nectalabs.com/bottle-glow.jpeg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA GLOW Organic Functional Infusion',
  description,
  image: 'https://www.nectalabs.com/bottle-glow.jpeg',
  sku: 'NECTA-GLOW-250',
  brand: { '@type': 'Brand', name: 'NECTA Labs' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: 29,
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
    { '@type': 'ListItem', position: 3, name: 'GLOW', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What ingredients are in NECTA GLOW?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NECTA GLOW contains Marine Collagen 2.5g, Hyaluronic Acid 120mg, and CoQ10 80mg — all at clinically researched doses. It is UK-made and Cherry Almond flavoured.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does marine collagen in NECTA GLOW benefit skin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Marine Collagen at 2.5g has been shown in clinical trials to improve skin elasticity, hydration, and reduce the appearance of fine lines after 8–12 weeks of daily use. Combined with Hyaluronic Acid 120mg and CoQ10 80mg, NECTA GLOW provides comprehensive skin support from within.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is NECTA GLOW vegan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NECTA GLOW contains Marine Collagen (fish-derived) and is therefore not vegan. A plant-based collagen alternative will be available in Phase 2.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long until I see results from NECTA GLOW?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most clinical studies on marine collagen show visible improvements in skin elasticity and hydration after 8–12 weeks of consistent daily use. Results vary by individual.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I use NECTA GLOW?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use 2 pumps (approx. 30ml) per day, added to any hot or cold drink — coffee, tea, juice, or water. Each 250ml bottle provides approximately 30 daily servings.',
      },
    },
  ],
};

export default function GlowPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><ProductPage slug="glow" /></Suspense>
    </>
  );
}
