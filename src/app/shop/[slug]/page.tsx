import type { Metadata } from 'next';
import { Suspense } from 'react';
import { products } from '@/data/products';
import type { ProductSlug } from '@/data/products';
import ProductPage from '@/views/ProductPage';
import SachetProductPage from '@/views/SachetProductPage';

const productMeta: Record<string, { title: string; description: string }> = {
  focus: {
    title: "FOCUS — Lion's Mane 2g & Rhodiola for Mental Performance",
    description: "NECTA FOCUS organic functional infusion with Lion's Mane 2g, Rhodiola 200mg, L-Theanine 80mg. Support focus and mental performance. Pump bottle or sachets.",
  },
  immunity: {
    title: "IMMUNITY — Reishi & Elderberry for Everyday Wellness",
    description: "NECTA IMMUNITY organic functional infusion with Reishi 1.5g, Elderberry 500mg, Ashwagandha 300mg. Support everyday wellness and natural resilience.",
  },
  calm: {
    title: "CALM — Chamomile & Lemon Balm for Everyday Calm",
    description: "NECTA CALM organic functional infusion with Chamomile 150mg, Lemon Balm 150mg, Jujube Seed 200mg. Support everyday calm and relaxation.",
  },
  glow: {
    title: "GLOW — Marine Collagen for Skin Health",
    description: "NECTA GLOW organic functional infusion with Marine Collagen 2.5g, Hyaluronic Acid 120mg, CoQ10 80mg. Skin health from the inside out.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const baseSlug = slug.replace('-sachets', '');
  const isSachet = slug.endsWith('-sachets');
  const meta = productMeta[baseSlug];
  if (!meta) return { title: 'Product Not Found' };
  const product = products[baseSlug as ProductSlug];
  const title = isSachet ? `${meta.title} — Sachets` : meta.title;
  const canonical = `https://nectalabs.com/shop/${slug}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `NECTA ${product?.name} ${isSachet ? 'Sachets' : 'Pump Bottle'}`,
    description: meta.description,
    brand: { '@type': 'Brand', name: 'NECTA Labs' },
    offers: product ? {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: isSachet ? product.sachets[30] : product.price250,
      availability: 'https://schema.org/PreOrder',
      url: canonical,
    } : undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://nectalabs.com/shop' },
      { '@type': 'ListItem', position: 3, name: product?.name || slug, item: canonical },
    ],
  };

  return {
    title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | NECTA Labs`,
      description: meta.description,
      url: canonical,
      images: [{ url: '/og-image.jpg' }],
    },
    other: {
      'script:ld+json:product': JSON.stringify(productSchema),
      'script:ld+json:breadcrumb': JSON.stringify(breadcrumbSchema),
    },
  };
}


export default async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug.endsWith('-sachets')) return <Suspense><SachetProductPage /></Suspense>;
  return <Suspense><ProductPage /></Suspense>;
}
