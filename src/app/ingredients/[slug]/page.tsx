import type { Metadata } from 'next';
import IngredientPage from '@/views/IngredientPage';
import { getIngredient } from '@/data/ingredients';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = getIngredient(slug);
  if (!ingredient) return { title: 'Ingredient Not Found' };
  const canonical = `https://nectalabs.com/ingredients/${slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nectalabs.com' },
      { '@type': 'ListItem', position: 2, name: 'Ingredients', item: 'https://nectalabs.com/science' },
      { '@type': 'ListItem', position: 3, name: ingredient.name, item: canonical },
    ],
  };

  return {
    title: `${ingredient.name} — Research & Benefits`,
    description: `Learn about ${ingredient.name} — dosing, research studies, and benefits in NECTA Labs organic functional infusions.`,
    alternates: { canonical },
    openGraph: {
      title: `${ingredient.name} — Research & Benefits | NECTA Labs`,
      url: canonical,
      images: [{ url: '/og-image.jpg' }],
    },
    other: {
      'script:ld+json:breadcrumb': JSON.stringify(breadcrumbSchema),
    },
  };
}

export default function IngredientRoute() {
  return <IngredientPage />;
}
