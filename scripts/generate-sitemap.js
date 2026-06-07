import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const siteUrl = (process.env.VITE_SITE_URL || 'https://www.forjabrindes.com.br').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)
const staticPaths = ['/', '/produtos']
const sampleProductSlugs = [
  'caneca-gamer-player-1',
  'caneca-anime-mascaras',
  'quadro-casal-personalizado',
  'camiseta-anime-custom',
  'caneca-cafe-de-aventura',
  'quadro-de-aluminio-custom',
  'caneca-namorados',
]

const urls = [
  ...staticPaths.map((path) => ({ loc: `${siteUrl}${path}`, priority: path === '/' ? '1.0' : '0.9', changefreq: path === '/' ? 'weekly' : 'daily' })),
  ...sampleProductSlugs.map((slug) => ({ loc: `${siteUrl}/produto/${slug}`, priority: '0.8', changefreq: 'weekly' })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Sitemap: ${siteUrl}/sitemap.xml
`

mkdirSync(resolve('public'), { recursive: true })
writeFileSync(resolve('public/sitemap.xml'), sitemap)
writeFileSync(resolve('public/robots.txt'), robots)
console.log(`SEO files generated for ${siteUrl}`)
