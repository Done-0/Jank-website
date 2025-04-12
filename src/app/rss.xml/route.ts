import { siteConfig } from '@shared/config/site.config'
import { seoConfig } from '@shared/config/seo.config'
import { fetchPostsForSeo } from '@shared/lib/seo'
import { Post } from '@/modules/post/types/Post'

// 包装CDATA内容
const cdata = (content: string) => `<![CDATA[${content}]]>`

// 提取文章描述
const getDescription = (post: Post) => {
  const text = post.content_html || post.content_markdown || ''
  const stripped = text.replace(/<[^>]+>/g, '').trim()
  return stripped.length > 240 ? stripped.slice(0, 240) + '...' : stripped
}

export async function GET() {
  try {
    const posts = await fetchPostsForSeo()

    // 生成文章条目
    const items = posts
      .map(post => {
        const postUrl = `${siteConfig.url}/posts/${post.id}/${encodeURIComponent(post.title)}`
        return `
    <item>
      <title>${cdata(post.title)}</title>
      <description>${cdata(getDescription(post))}</description>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
    </item>`
      })
      .join('')

    // 生成完整RSS
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cdata(seoConfig.meta.title)}</title>
    <description>${cdata(seoConfig.meta.description)}</description>
    <link>${siteConfig.url}</link>
    <language>${siteConfig.language}</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' }
    })
  } catch (error) {
    console.error('RSS生成错误:', error)

    // 错误时返回基础频道信息
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cdata(seoConfig.meta.title)}</title>
    <description>${cdata(seoConfig.meta.description)}</description>
    <link>${siteConfig.url}</link>
    <language>${siteConfig.language}</language>
  </channel>
</rss>`

    return new Response(fallbackXml, {
      headers: { 'Content-Type': 'application/xml' }
    })
  }
}
