import { seoConfig } from '@/shared/config/seo.config'
import { siteConfig } from '@/shared/config/site.config'
import { Metadata } from 'next'

import { buildUrl, getOgImage } from './formatters'

/**
 * SEO属性接口
 */
export interface SeoProps {
  /** 页面规范URL */
  canonicalUrl?: string
  /** 页面描述 */
  description?: string
  /** 关键词列表 */
  keywords?: string[]
  /** 是否禁止索引 */
  noIndex?: boolean
  /** 社交分享图片URL */
  ogImage?: string
  /** 覆盖默认配置 */
  overrideConfig?: Partial<typeof seoConfig>
  /** 页面标题 */
  title?: string
}

/**
 * 为App Router创建元数据对象
 */
export const createMetadata = ({
  canonicalUrl,
  description = seoConfig.description,
  keywords = seoConfig.keywords,
  noIndex = false,
  ogImage,
  overrideConfig = {},
  title
}: SeoProps): Metadata => {
  const config =
    Object.keys(overrideConfig).length > 0
      ? { ...seoConfig, ...overrideConfig }
      : seoConfig

  // 处理标题
  const finalTitle = !title ? siteConfig.name : `${title} | ${siteConfig.name}`
  const finalDescription = description || config.description
  const finalCanonicalUrl = canonicalUrl
    ? buildUrl(canonicalUrl, config)
    : config.canonicalUrlPrefix || ''
  const finalOgImage = getOgImage(ogImage)

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: finalCanonicalUrl
    },
    applicationName: siteConfig.name,
    authors: [{ name: config.author, url: siteConfig.author.url }],
    icons: {
      icon:
        config.additionalLinkTags?.find(tag => tag.rel === 'icon')?.href ||
        '/images/jank-bytedance.svg',
      apple:
        config.additionalLinkTags?.find(tag => tag.rel === 'apple-touch-icon')
          ?.href || '/images/jank-bytedance.svg'
    },
    keywords: keywords,
    openGraph: {
      description: finalDescription,
      images: [
        { alt: finalTitle, height: 630, url: finalOgImage, width: 1200 }
      ],
      locale: config.language || 'zh-CN',
      siteName: config.openGraph?.siteName || siteConfig.name,
      title: finalTitle,
      type: 'website',
      url: finalCanonicalUrl
    },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow'
  }
}
