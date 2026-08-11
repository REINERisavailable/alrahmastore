import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all major crawlers
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/admin/'] },
      // Explicitly allow AI crawlers
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ],
    sitemap: 'https://alrahma.store/sitemap.xml',
    host: 'https://alrahma.store',
  }
}
