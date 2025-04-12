import { SEOConfig } from '@shared/types/SEO'
import { siteConfig } from '@shared/config/site.config'

/**
 * SEO 优化配置
 */
export const seoConfig: SEOConfig = {
  // 基础元数据
  meta: {
    title: 'Jank - 高性能Go语言博客系统 | 扁平化设计风格轻量级体验',
    titleTemplate: `%s | ${siteConfig.name} - Go 语言博客系统`,
    description:
      '基于 Go 语言开发的博客系统，致力于构建高性能、轻量级、高拓展和优雅体验的博客系统。',
    keywords: [
      'Jank',
      'Jank 博客',
      'Jank 博客系统',
      'Go 语言博客',
      '轻量级博客平台',
      '高性能博客系统',
      'Go 语言'
    ],
    canonical: siteConfig.url,
    author: siteConfig.author.name,
    locale: siteConfig.language
  },

  // 社交分享设置
  social: {
    og: {
      siteName: siteConfig.name,
      type: 'website',
      images: [
        {
          url: `${siteConfig.url}/images/home-black.png`,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - 预览图`
        }
      ]
    }
  },

  // 结构化数据
  schemas: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      logo: `${siteConfig.url}/favicon.ico`,
      name: siteConfig.name,
      description: '基于 Go 语言开发的高性能博客系统',
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

  // 性能优化设置
  performance: {
    preconnect: [
      siteConfig.url,
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    preload: {
      fonts: true
    }
  },

  // 站点资源
  assets: {
    icons: {
      favicon: '/favicon.ico'
    }
  },

  // 增强功能
  extra: {
    metaTags: [
      { name: 'theme-color', content: '#ffffff' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'application-name', content: siteConfig.name }
    ],
    linkTags: [
      {
        rel: 'alternate',
        href: `${siteConfig.url}/rss.xml`,
        type: 'application/rss+xml'
      }
    ]
  }
}
