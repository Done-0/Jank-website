import { siteConfig } from '@shared/config/site.config'
import { fetchPostsForSeo } from '@shared/lib/seo'

/**
 * 静态URL列表配置，按优先级排序
 */
const STATIC_URLS = [
  { url: '/', priority: '1.0' },
  { url: '/posts', priority: '0.8' },
  { url: '/about', priority: '0.7' },
  { url: '/sponsor', priority: '0.7' },
  { url: '/rss.xml', priority: '0.6' }
]

/**
 * 生成单个URL条目
 */
const generateUrlEntry = (url: string, priority: string) =>
  `<url><loc>${siteConfig.url}${url}</loc><changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq><priority>${priority}</priority></url>`

/**
 * 站点地图路由处理
 */
export async function GET() {
  try {
    const posts = await fetchPostsForSeo()

    // 使用函数生成URL条目
    const urlEntries = [
      ...STATIC_URLS.map(p => generateUrlEntry(p.url, p.priority)),
      ...posts.map(post =>
        generateUrlEntry(
          `/posts/${post.id}/${encodeURIComponent(post.title)}`,
          '0.6'
        )
      )
    ].join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}</urlset>`

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' }
    })
  } catch (error) {
    console.error('站点地图生成错误:', error)

    // 出错时至少返回静态URL
    const staticEntries = STATIC_URLS.map(p =>
      generateUrlEntry(p.url, p.priority)
    ).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticEntries}</urlset>`

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' }
    })
  }
}
