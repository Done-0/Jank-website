import { seoConfig } from '@shared/config/seo.config'
import { siteConfig } from '@shared/config/site.config'
import { Post } from '@/modules/post/types/Post'
import { optimizeDescriptionLength } from './utils'

/**
 * 获取网站通用结构化数据
 */
export function getSiteStructuredData() {
  return {
    organization: seoConfig.schemas.organization,
    website: seoConfig.schemas.website
  }
}

/**
 * 生成文章的结构化数据
 */
export function generatePostStructuredData(post: Post) {
  if (!post) return null
  const postUrl = `${siteConfig.url}/posts/${post.id}/${encodeURIComponent(post.title)}`
  const description = optimizeDescriptionLength(
    post.content_html || post.content_markdown || ''
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image: post.image || `${siteConfig.url}/ogResource/og-image.svg`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${seoConfig.assets.icons.favicon}`
      }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    url: postUrl,
    keywords: post.category_ids?.map(id => `category-${id}`).join(', ') || ''
  }
}
