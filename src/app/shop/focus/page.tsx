import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductPage from '@/views/ProductPage';

const title = "NECTA FOCUS — Lion's Mane 500mg for Mental Clarity";
const description =
  "FOCUS organic functional infusion: Lion's Mane 500mg, L-Theanine 80mg, Rhodiola 200mg. Mental clarity without the crash. Vanilla Bean flavour. Pump bottle 250ml from £29.";
const canonical = 'https://www.nectalabs.com/shop/focus';

export const metadata: Metadata = {
  title,
  description,
  keywords: ["lion's mane supplement UK", 'nootropic drink', 'focus infusion', 'lions mane coffee', 'l-theanine drink', 'mental clarity supplement', 'adaptogen focus'],
  alternates: { canonical },
  openGraph: {
    title: `${title} | NECTA Labs`,
    description,
    url: canonical,
    images: [{ url: 'https://www.nectalabs.com/bottle-focus.jpeg', width: 1200, height: 630, alt: 'NECTA FOCUS pump bottle' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.nectalabs.com/bottle-focus.jpeg'] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NECTA FOCUS Organic Functional Infusion',
  description,
  image: 'https://www.nectalabs.com/bottle-focus.jpeg',
  sku: 'NECTA-FOCUS-250',
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
    { '@type': 'ListItem', position: 3, name: 'FOCUS', item: canonical },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "How quickly will I feel the effects of NECTA FOCUS?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most customers notice a difference within 7–14 days of consistent daily use. L-Theanine can produce a sense of calm focus within 30–60 minutes of a single dose. Lion's Mane and Rhodiola work cumulatively to support mental clarity over time.",
      },
    },
    {
      '@type': 'Question',
      name: "What ingredients are in NECTA FOCUS?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "NECTA FOCUS contains Lion's Mane 500mg, L-Theanine 80mg, and Rhodiola Rosea 200mg — all at clinically researched doses. It is organic, UK-made, and Vanilla Bean flavoured.",
      },
    },
    {
      '@type': 'Question',
      name: "Can I add NECTA FOCUS to coffee or hot drinks?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. NECTA FOCUS is fully stable in hot and cold beverages. Add 2 pumps to coffee, tea, matcha, or any drink at any temperature.",
      },
    },
    {
      '@type': 'Question',
      name: "Is NECTA FOCUS vegan?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, NECTA FOCUS is fully vegan. All ingredients are plant-derived.",
      },
    },
    {
      '@type': 'Question',
      name: "How do I use NECTA FOCUS?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Use 2 pumps (approx. 30ml) per day, added to any hot or cold drink. Each 250ml bottle provides approximately 30 daily servings.",
      },
    },
  ],
};

export default function FocusPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense><ProductPage slug="focus" /></Suspense>
    </>
  );
}
