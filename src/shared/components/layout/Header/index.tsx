import { Metadata } from 'next'
import { seoConfig } from '@/shared/config/seo.config'
import { siteConfig } from '@/shared/config/site.config'

/** SEO元数据配置项 */
export interface SeoProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
}

// 预构建OG图像配置
const defaultOgImage = {
  url: `${siteConfig.url}/og-image.svg`,
  width: 1200,
  height: 630,
  alt: siteConfig.name
}

/** 站点统一元数据配置 */
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  keywords: seoConfig.meta.keywords,
  icons: {
    icon: seoConfig.assets.icons.favicon
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.language,
    images: [defaultOgImage]
  },
  alternates: {
    canonical: siteConfig.url
  },
  robots: 'index, follow',
  other: {
    'script:ld+json:organization': JSON.stringify(
      seoConfig.schemas.organization
    ),
    'script:ld+json:website': JSON.stringify(seoConfig.schemas.website)
  }
}

/** 生成特定页面的元数据配置 */
export function generatePageMetadata({
  title,
  description = seoConfig.meta.description,
  keywords = seoConfig.meta.keywords,
  canonicalUrl,
  ogImage,
  noIndex = false
}: SeoProps = {}): Metadata {
  const base = siteConfig.url
  const url = canonicalUrl
    ? `${base}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`
    : base

  return {
    title,
    description: description || siteConfig.description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: description || siteConfig.description,
      url,
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.language,
      images: ogImage ? [{ ...defaultOgImage, url: ogImage }] : [defaultOgImage]
    },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow'
  }
}
