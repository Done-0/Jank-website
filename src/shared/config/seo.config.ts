import { siteConfig } from '@/shared/config/site.config'
import { Metadata } from 'next'

/**
 * SEO配置
 */
export const seoConfig: SEOConfig = {
  additionalMetaTags: [
    { content: '#ffffff', name: 'theme-color' },
    { content: 'yes', name: 'apple-mobile-web-app-capable' },
    { content: 'default', name: 'apple-mobile-web-app-status-bar-style' },
    { content: 'telephone=no', name: 'format-detection' },
    { content: siteConfig.name, name: 'application-name' }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: siteConfig?.ui?.logo?.light || '/images/jank-bytedance.svg',
      type: 'image/svg+xml'
    },
    {
      rel: 'apple-touch-icon',
      href: siteConfig?.ui?.logo?.light || '/images/jank-bytedance.svg'
    }
  ],
  author: siteConfig.author.name,
  canonicalUrlPrefix: siteConfig.url,
  defaultTitle: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    'Jank博客系统',
    'Next.js',
    'React',
    'TypeScript',
    '内容管理系统',
    '高性能'
  ],
  language: siteConfig.language,

  // 开放图谱协议
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: siteConfig.name,
        height: 630,
        url: `${siteConfig.url}/og-image.png`,
        width: 1200
      },
      {
        alt: `${siteConfig.name} Logo`,
        height: 800,
        url: `${siteConfig.url}/og-image-square.png`,
        width: 800
      }
    ],
    locale: siteConfig.language,
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: 'website',
    url: siteConfig.url
  },

  // 性能优化配置
  performance: {
    dnsPreconnect: [siteConfig.url],
    preconnectOrigins: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    preloadFonts: true
  },

  // 结构化数据
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      logo: siteConfig?.ui?.logo?.light || '/images/jank-bytedance.svg',
      name: siteConfig.name,
      sameAs: [siteConfig.author.url],
      url: siteConfig.url
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      description: siteConfig.description,
      name: siteConfig.name,
      potentialAction: {
        '@type': 'SearchAction',
        'query-input': 'required name=search_term_string',
        target: `${siteConfig.url}/search?q={search_term_string}`
      },
      url: siteConfig.url
    }
  },

  title: siteConfig.name,
  titleTemplate: `%s | ${siteConfig.name}`
}

/**
 * App Router元数据配置
 * 用于Next.js 13+ App Router的metadata API
 */
export const appMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  keywords: seoConfig.keywords,
  icons: {
    icon: siteConfig?.ui?.logo?.light || '/images/jank-bytedance.svg',
    apple: siteConfig?.ui?.logo?.light || '/images/jank-bytedance.svg'
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.language,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  }
}
