import { Metadata } from 'next'
import { seoConfig } from '@/shared/config/seo.config'
import { siteConfig } from '@/shared/config/site.config'

// SEO通用配置参数
export interface SeoProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
}

// 构建基础元数据
const createBaseMetadata = (config: {
  title?: string
  desc?: string
  url?: string
  ogImage?: string
  noIndex?: boolean
}) => {
  const { title, desc, url, ogImage, noIndex } = config
  const finalDesc = desc || seoConfig.meta.description || siteConfig.description
  const finalUrl = url || siteConfig.url

  // 默认OG图像
  const defaultOgImage = {
    url: ogImage || `${siteConfig.url}/og-image.svg`,
    width: 1200,
    height: 630,
    alt: siteConfig.name
  }

  return {
    // 核心字段 - 最常用
    title: title
      ? {
          default: title,
          template: `%s | ${siteConfig.name}`
        }
      : {
          default: siteConfig.name,
          template: `%s | ${siteConfig.name}`
        },
    description: finalDesc,
    metadataBase: new URL(siteConfig.url),
    icons: { icon: seoConfig.assets.icons.favicon },

    // OpenGraph数据
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title: title || siteConfig.name,
      description: finalDesc,
      url: finalUrl,
      locale: siteConfig.language,
      images: [defaultOgImage]
    },

    // 其他常用字段
    alternates: { canonical: finalUrl },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',

    // 辅助字段
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    keywords: seoConfig.meta.keywords,

    // 结构化数据
    other: {
      'script:ld+json:organization': JSON.stringify(
        seoConfig.schemas.organization
      ),
      'script:ld+json:website': JSON.stringify(seoConfig.schemas.website)
    }
  }
}

// 全站默认元数据
export const metadata: Metadata = createBaseMetadata({})

// 生成页面专用元数据
export function generatePageMetadata({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  noIndex
}: SeoProps = {}): Metadata {
  const url = !canonicalUrl
    ? siteConfig.url
    : `${siteConfig.url}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`

  // 复用基础元数据生成函数
  const meta = createBaseMetadata({
    title,
    desc: description,
    url,
    ogImage,
    noIndex
  })

  // 添加页面特有配置
  return {
    ...meta,
    keywords: keywords || seoConfig.meta.keywords
  }
}
