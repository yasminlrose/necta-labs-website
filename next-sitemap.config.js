/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nectalabs.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  exclude: ['/account', '/stockist-portal', '/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async (config) => [
    { loc: '/shop/focus', changefreq: 'weekly', priority: 0.9 },
    { loc: '/shop/immunity', changefreq: 'weekly', priority: 0.9 },
    { loc: '/shop/calm', changefreq: 'weekly', priority: 0.9 },
    { loc: '/shop/glow', changefreq: 'weekly', priority: 0.9 },
    { loc: '/shop/focus-sachets', changefreq: 'weekly', priority: 0.8 },
    { loc: '/shop/immunity-sachets', changefreq: 'weekly', priority: 0.8 },
    { loc: '/shop/calm-sachets', changefreq: 'weekly', priority: 0.8 },
    { loc: '/shop/glow-sachets', changefreq: 'weekly', priority: 0.8 },
  ],
};
