import { SEOConfig } from '@shared/types/SEO'
import { siteConfig } from '@shared/config/site.config'

// Favicon SVG的Base64编码，使用固定字符串而不是运行时生成，确保服务器端和客户端一致
const FAVICON_SVG_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icHJpbWFyeSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzM2RjFDRCIgLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzEzQzJDMiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxNjc3RkYiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InNlY29uZGFyeSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjRENEYiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjc1OUFCIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LCA3LjUpIj48cGF0aCBkPSJNMCwwIEw1NSwwIEM2MiwwIDY4LDYgNjgsMTMgTDY4LDU1IEM2OCw3MiA1NSw4NSAzOCw4NSBMMCw4NSBMMCw2OCBMMzMsNjggQzQwLDY4IDQ1LDYzIDQ1LDU2IEw0NSwyMiBMMCwyMiBaIiBmaWxsPSJ1cmwoI3ByaW1hcnkpIiAvPjxyZWN0IHg9IjE1IiB5PSIzMiIgd2lkdGg9IjM1IiBoZWlnaHQ9IjciIHJ4PSIzLjUiIGZpbGw9InVybCgjc2Vjb25kYXJ5KSIgLz48cmVjdCB4PSIxNSIgeT0iNDYiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3IiByeD0iMy41IiBmaWxsPSJ1cmwoI3NlY29uZGFyeSkiIC8+PC9nPjwvc3ZnPg=='

/**
 * SEO优化配置
 */
export const seoConfig: SEOConfig = {
  // 基础元数据
  meta: {
    title: siteConfig.name,
    titleTemplate: `%s | ${siteConfig.name}`,
    description: siteConfig.description,
    keywords: [
      'Jank博客系统',
      'Next.js',
      'React',
      'TypeScript',
      '内容管理系统',
      '高性能'
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
          url: `${siteConfig.url}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: siteConfig.name
        }
      ]
    }
  },

  // 结构化数据
  schemas: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      logo: FAVICON_SVG_DATA_URL,
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
      favicon: FAVICON_SVG_DATA_URL
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
        rel: 'icon',
        href: FAVICON_SVG_DATA_URL,
        type: 'image/svg+xml'
      },
      {
        rel: 'apple-touch-icon',
        href: FAVICON_SVG_DATA_URL
      }
    ]
  }
}
