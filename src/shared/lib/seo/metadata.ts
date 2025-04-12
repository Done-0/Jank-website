import { Metadata } from 'next'
import { seoConfig } from '@shared/config/seo.config'
import { siteConfig } from '@shared/config/site.config'
import { Post } from '@/modules/post/types/Post'
import { optimizeDescriptionLength, extractDescription } from './utils'

/**
 * SEO元数据生成相关参数
 */
export type SeoParams = {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
  type?: 'website' | 'article' | 'profile'
}

/**
 * 生成通用元数据
 */
export function generateMetadata(params: SeoParams = {}): Metadata {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    noIndex = false,
    type = 'website'
  } = params
  const url = canonicalUrl
    ? `${siteConfig.url}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`
    : siteConfig.url
  const optimizedDescription = optimizeDescriptionLength(
    description || seoConfig.meta.description
  )
  const displayTitle = title || seoConfig.meta.title

  return {
    title: { default: displayTitle, template: seoConfig.meta.titleTemplate },
    description: optimizedDescription,
    keywords: keywords || seoConfig.meta.keywords,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type,
      siteName: siteConfig.name,
      title: displayTitle,
      description: optimizedDescription,
      url,
      locale: siteConfig.language,
      images: [
        {
          url: ogImage || `${siteConfig.url}/ogResource/og-image.svg`,
          width: 1200,
          height: 630,
          alt: displayTitle
        }
      ]
    },
    alternates: { canonical: url },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }]
  }
}

/**
 * 生成文章页元数据
 */
export function generatePostMetadata(post: Post, canonical?: string): Metadata {
  if (!post) return generateMetadata()

  const postUrl =
    canonical || `/posts/${post.id}/${encodeURIComponent(post.title)}`
  const description = extractDescription(
    post.content_html,
    post.content_markdown
  )
  const categoryKeywords = post.category_ids?.map(id => `category-${id}`) ?? []

  return generateMetadata({
    title: post.title,
    description,
    keywords: [...seoConfig.meta.keywords, ...categoryKeywords],
    canonicalUrl: postUrl,
    ogImage: post.image || undefined,
    type: 'article'
  })
}

/**
 * 生成文章列表页元数据
 */
export function generatePostListMetadata(
  params: { category?: string; tag?: string } = {}
): Metadata {
  const { category, tag } = params

  let title, description, canonicalUrl

  if (category) {
    title = `${category} - 文章分类`
    description = `查看${category}分类下的所有文章和内容`
    canonicalUrl = `/posts/category/${category}`
  } else if (tag) {
    title = `${tag} - 文章标签`
    description = `查看标记为${tag}的所有文章和内容`
    canonicalUrl = `/posts/tag/${tag}`
  } else {
    title = seoConfig.meta.title
    description = seoConfig.meta.description
    canonicalUrl = '/posts'
  }

  return generateMetadata({
    title,
    description: optimizeDescriptionLength(description),
    canonicalUrl,
    type: 'website'
  })
}

/**
 * 生成OpenGraph元数据
 */
export function generateOpenGraph({
  title,
  description
}: {
  title?: string
  description?: string
}) {
  return {
    title: title || seoConfig.meta.title,
    description: description || seoConfig.meta.description,
    type: seoConfig.social.og.type,
    siteName: seoConfig.social.og.siteName,
    locale: seoConfig.meta.locale,
    images: seoConfig.social.og.images
  }
}

/**
 * 生成分类或标签页面元数据
 */
export function generateCategoryMetadata({
  category,
  tag
}: {
  category?: string
  tag?: string
}): Metadata {
  // 确定标题和基础描述
  const context = category || tag || ''
  const contextType = category ? '分类' : tag ? '标签' : ''
  const title = context
    ? `${context} - 文章${contextType}`
    : seoConfig.meta.title

  // 构建关键词
  const categoryKeywords = []
  if (context) {
    const prefix = category ? '分类' : '标签'
    categoryKeywords.push(
      `${context}${prefix}`,
      `${context}文章`,
      `${context}${category ? '博客' : '内容'}`
    )
  }

  // 构建描述
  let detailedDescription = ''
  if (context) {
    const prefix = category ? `${context}分类下` : `标记为${context}`
    detailedDescription = `查看${prefix}的所有文章和内容，获取最新${context}相关的技术文章和教程。`
  }

  const basicDescription = context
    ? `查看${category ? `${context}分类下` : `标记为${context}`}的所有文章和内容`
    : seoConfig.meta.description

  // 生成元数据
  return {
    ...generateMetadata({
      title,
      description: detailedDescription || basicDescription,
      keywords: [...seoConfig.meta.keywords, ...categoryKeywords]
    }),
    openGraph: generateOpenGraph({
      title,
      description: detailedDescription || basicDescription
    })
  }
}
