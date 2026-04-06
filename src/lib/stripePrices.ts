/**
 * Stripe Price IDs — sourced directly from Stripe dashboard.
 *
 * Bottle naming:
 *   bottle_250_oneoff   → 250ml one-time purchase
 *   bottle_250_sub      → 250ml monthly subscription
 *   bottle_250_sub_2m   → 250ml every-2-months subscription
 *   bottle_500_oneoff   → 500ml one-time purchase
 *   bottle_500_sub      → 500ml monthly subscription
 *   bottle_500_sub_2m   → 500ml every-2-months subscription
 *
 * Sachet naming:
 *   sachet_7            → 7-day trial, one-time only
 *   sachet_14_oneoff    → 14-day box, one-time
 *   sachet_14_sub       → 14-day box, subscription
 *   sachet_30_oneoff    → 30-day box, one-time
 *   sachet_30_sub       → 30-day box, subscription
 *   sachet_90_oneoff    → 90-day box, one-time
 *   sachet_90_sub       → 90-day box, subscription
 */

export type ProductSlug = 'focus' | 'immunity' | 'calm' | 'glow';

export interface ProductPrices {
  bottle_250_oneoff: string;
  bottle_250_sub: string;
  bottle_250_sub_2m: string;
  bottle_500_oneoff: string;
  bottle_500_sub: string;
  bottle_500_sub_2m: string;
  sachet_7: string;
  sachet_14_oneoff: string;
  sachet_14_sub: string;
  sachet_30_oneoff: string;
  sachet_30_sub: string;
  sachet_90_oneoff: string;
  sachet_90_sub: string;
}

export const STRIPE_PRICES: Record<ProductSlug, ProductPrices> = {
  focus: {
    bottle_250_oneoff: 'price_1TJB08Ehf8tV0Sb0WY4jdEiF',
    bottle_250_sub:    'price_1TJB9ZEhf8tV0Sb0Axoihb7H',
    bottle_250_sub_2m: 'price_1TJFHaEhf8tV0Sb0ChM6KoH8',
    bottle_500_oneoff: 'price_1TJFHaEhf8tV0Sb0hEM25ijr',
    bottle_500_sub:    'price_1TJFHaEhf8tV0Sb02ibYDCIm',
    bottle_500_sub_2m: 'price_1TJFHaEhf8tV0Sb0eHY054sJ',
    sachet_7:          'price_1TJJhjEhf8tV0Sb0Ps6gnMMG',
    sachet_14_oneoff:  'price_1TJJqGEhf8tV0Sb0YNWeMZvz',
    sachet_14_sub:     'price_1TJJqGEhf8tV0Sb0ZyEAFRl7',
    sachet_30_oneoff:  'price_1TJJqGEhf8tV0Sb0QRfVNA73',
    sachet_30_sub:     'price_1TJJqGEhf8tV0Sb0Bk3ec63m',
    sachet_90_oneoff:  'price_1TJJqGEhf8tV0Sb0CWsP3Dev',
    sachet_90_sub:     'price_1TJJqGEhf8tV0Sb0pImnZ9rs',
  },
  calm: {
    bottle_250_oneoff: 'price_1TJHU3Ehf8tV0Sb0bVUwFkBv',
    bottle_250_sub:    'price_1TJHfmEhf8tV0Sb0MdfqJlpj',
    bottle_250_sub_2m: 'price_1TJJ4XEhf8tV0Sb0w4uPx2rb',
    bottle_500_oneoff: 'price_1TJJ4XEhf8tV0Sb08m9tfkxh',
    bottle_500_sub:    'price_1TJJ4XEhf8tV0Sb0qM2EYdOP',
    bottle_500_sub_2m: 'price_1TJJ4YEhf8tV0Sb0D9hcFhbp',
    sachet_7:          'price_1TJJr4Ehf8tV0Sb0bFedr1Yn',
    sachet_14_oneoff:  'price_1TJJt1Ehf8tV0Sb0E9Y3ouIL',
    sachet_14_sub:     'price_1TJJvyEhf8tV0Sb0hFmpDKcH',
    sachet_30_oneoff:  'price_1TJJvyEhf8tV0Sb0cYPtw3nU',
    sachet_30_sub:     'price_1TJJvyEhf8tV0Sb0IKbsdaXi',
    sachet_90_oneoff:  'price_1TJJvyEhf8tV0Sb0RbBDZ4BZ',
    sachet_90_sub:     'price_1TJJvyEhf8tV0Sb0HXO0M25O',
  },
  immunity: {
    bottle_250_oneoff: 'price_1TJJ5dEhf8tV0Sb0nKtrzjWu',
    bottle_250_sub:    'price_1TJJ82Ehf8tV0Sb0WW3hAJWA',
    bottle_250_sub_2m: 'price_1TJJ82Ehf8tV0Sb064K27FfB',
    bottle_500_oneoff: 'price_1TJJ82Ehf8tV0Sb09I4Xv9nZ',
    bottle_500_sub:    'price_1TJJ82Ehf8tV0Sb0cJGjGEnJ',
    bottle_500_sub_2m: 'price_1TJJ82Ehf8tV0Sb0dPNBLQFU',
    sachet_7:          'price_1TJJwxEhf8tV0Sb0f2se6U5W',
    sachet_14_oneoff:  'price_1TJJzhEhf8tV0Sb0wxLvOrig',
    sachet_14_sub:     'price_1TJJzhEhf8tV0Sb0fk1Vfpom',
    sachet_30_oneoff:  'price_1TJJzhEhf8tV0Sb01usDh2b5',
    sachet_30_sub:     'price_1TJJzhEhf8tV0Sb0rZ90Mkfs',
    sachet_90_oneoff:  'price_1TJJzhEhf8tV0Sb0ThBhSJaY',
    sachet_90_sub:     'price_1TJJzhEhf8tV0Sb0VW6n30Bb',
  },
  glow: {
    bottle_250_oneoff: 'price_1TJJEbEhf8tV0Sb0uRsv5l1X',
    bottle_250_sub:    'price_1TJJGPEhf8tV0Sb0fgDchXnK',
    bottle_250_sub_2m: 'price_1TJJGPEhf8tV0Sb0JOrv9SUQ',
    bottle_500_oneoff: 'price_1TJJGPEhf8tV0Sb0FQWfqBcX',
    bottle_500_sub:    'price_1TJJGPEhf8tV0Sb0qAMFZ2Xh',
    bottle_500_sub_2m: 'price_1TJJGPEhf8tV0Sb03k1hGj2b',
    sachet_7:          'price_1TJK0UEhf8tV0Sb0874dXm1O',
    sachet_14_oneoff:  'price_1TJK2bEhf8tV0Sb0sq6QG41w',
    sachet_14_sub:     'price_1TJK2bEhf8tV0Sb0iJmv3lqo',
    sachet_30_oneoff:  'price_1TJK2bEhf8tV0Sb0re407P1k',
    sachet_30_sub:     'price_1TJK2bEhf8tV0Sb0aY9pQ0qp',
    sachet_90_oneoff:  'price_1TJK2bEhf8tV0Sb05YmRG9D4',
    sachet_90_sub:     'price_1TJK2bEhf8tV0Sb0HrK54FUQ',
  },
};

/**
 * Returns the Stripe price ID for the given product + purchase combination.
 *
 * mode values:
 *   'one-off'      → one-time payment
 *   'subscribe'    → monthly recurring
 *   'subscribe-2m' → every-2-months recurring (bottles only)
 */
export function getPriceId(
  slug: ProductSlug,
  format: 'bottle' | 'sachet',
  size: '250ml' | '500ml' | 7 | 14 | 30 | 90,
  mode: 'subscribe' | 'subscribe-2m' | 'one-off',
): string {
  const p = STRIPE_PRICES[slug];
  if (format === 'sachet') {
    if (size === 7)  return p.sachet_7;
    if (size === 14) return mode === 'one-off' ? p.sachet_14_oneoff : p.sachet_14_sub;
    if (size === 30) return mode === 'one-off' ? p.sachet_30_oneoff : p.sachet_30_sub;
    if (size === 90) return mode === 'one-off' ? p.sachet_90_oneoff : p.sachet_90_sub;
  }
  if (size === '250ml') {
    if (mode === 'subscribe-2m') return p.bottle_250_sub_2m;
    return mode === 'subscribe' ? p.bottle_250_sub : p.bottle_250_oneoff;
  }
  if (mode === 'subscribe-2m') return p.bottle_500_sub_2m;
  return mode === 'subscribe' ? p.bottle_500_sub : p.bottle_500_oneoff;
}

/** Returns 'subscription' for recurring prices, 'payment' for one-time. */
export function getStripeMode(
  format: 'bottle' | 'sachet',
  size: '250ml' | '500ml' | 7 | 14 | 30 | 90,
  mode: 'subscribe' | 'subscribe-2m' | 'one-off',
): 'payment' | 'subscription' {
  if (format === 'sachet' && size === 7) return 'payment';
  if (mode === 'one-off') return 'payment';
  return 'subscription';
}
