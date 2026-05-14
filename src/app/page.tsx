import type { Metadata } from 'next';
import Index from '@/views/Index';

export const metadata: Metadata = {
  title: 'NECTA Labs — Liquid Adaptogens at Clinical Doses | UK Organic Functional Infusions',
  description: 'Organic liquid adaptogen infusions in pump bottles and sachets. Lion\'s Mane, Ashwagandha, Reishi at clinically-researched doses — not the token amounts most brands use. Add to any drink. UK made.',
  keywords: ['liquid adaptogens UK', 'organic functional infusions UK', 'adaptogen pump bottle', 'adaptogen sachets UK', 'clinical dose adaptogen UK', 'organic nootropic drink UK', 'mushroom syrup UK', 'adaptogen syrup UK', 'functional infusion UK'],
  alternates: { canonical: 'https://www.nectalabs.com' },
  openGraph: {
    title: 'NECTA Labs — Liquid Adaptogens at Clinical Doses | UK Organic Functional Infusions',
    description: 'Organic liquid adaptogen infusions in pump bottles and sachets. Lion\'s Mane, Ashwagandha, Reishi at clinically-researched doses — not the token amounts most brands use. Add to any drink. UK made.',
    url: 'https://www.nectalabs.com',
    images: [{ url: '/og-image.jpg' }],
  },
};

export default function HomePage() {
  return <Index />;
}
