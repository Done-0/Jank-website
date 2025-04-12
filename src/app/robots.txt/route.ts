import { siteConfig } from '@shared/config/site.config'

/**
 * robots.txt路由处理
 */
export async function GET() {
  return new Response(
    `
User-agent: *
Allow: /
Disallow: /console/

Sitemap: ${siteConfig.url}/sitemap.xml
`.trim(),
    {
      headers: { 'Content-Type': 'text/plain' }
    }
  )
}
