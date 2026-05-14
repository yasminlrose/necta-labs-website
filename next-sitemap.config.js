/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.nectalabs.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/account' },
      { userAgent: '*', disallow: '/admin' },
      { userAgent: '*', disallow: '/api' },
      { userAgent: '*', disallow: '/stockist-portal' },
      { userAgent: '*', disallow: '/waitlist' },
      { userAgent: '*', disallow: '/order-success' },
      { userAgent: '*', disallow: '/stockists/apply' },
    ],
  },
  exclude: [
    '/account',
    '/account/*',
    '/admin',
    '/admin/*',
    '/api/*',
    '/stockist-portal',
    '/stockist-portal/*',
    '/waitlist',
    '/order-success',
    '/stockists/apply',
  ],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Boost high-traffic /learn articles
    const highPriority = [
      '/learn/mushroom-coffee-benefits',
      '/learn/ashwagandha-benefits',
      '/learn/how-to-lower-cortisol-naturally',
      '/learn/cordyceps-mushroom-benefits',
      '/learn/does-collagen-actually-work',
      '/learn/best-nootropics-uk',
    ];
    const medPriority = [
      '/learn/does-lions-mane-actually-work',
      '/learn/best-adaptogens-for-stress-anxiety',
      '/learn/rhodiola-rosea-benefits',
      '/learn/brain-fog-supplements',
      '/learn/ashwagandha-in-coffee',
      '/learn/what-is-l-theanine',
      '/learn/reishi-mushroom-benefits',
      '/learn/marine-collagen-vs-plant-collagen',
      '/learn/chamomile-for-anxiety',
      '/learn/lemon-balm-benefits',
      '/learn/adaptogenic-coffee',
      '/learn/lions-mane-and-ashwagandha-together',
      '/learn/functional-drinks-uk-guide',
    ];

    if (highPriority.includes(path)) {
      return { loc: path, changefreq: 'monthly', priority: 0.9, lastmod: new Date().toISOString() };
    }
    if (medPriority.includes(path)) {
      return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    if (path === '/learn') {
      return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => [
    { loc: '/shop/focus', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
    { loc: '/shop/immunity', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
    { loc: '/shop/calm', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
    { loc: '/shop/glow', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
    { loc: '/shop/focus-sachets', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
    { loc: '/shop/immunity-sachets', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
    { loc: '/shop/calm-sachets', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
    { loc: '/shop/glow-sachets', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  ],
};
