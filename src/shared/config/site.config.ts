/**
 * 站点配置
 * 定义网站的基本设置
 */
import { Inter } from 'next/font/google'

// 预配置字体
export const interFont = Inter({
  display: 'swap',
  preload: true,
  subsets: ['latin']
})

export const siteConfig: SiteConfig = {
  // 核心站点标识
  name: 'Jank',
  description:
    '一款极简、低耦合且高扩展的博客系统，基于 Go 语言开发，后端内存占用仅 13 MB。',
  url: 'https://jank.org.cn',

  // API配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.jank.org.cn',
    caching: true,
    retries: 3,
    timeout: 5000
  },

  // 作者信息
  author: {
    email: 'fenderisfine@outlook.com',
    name: 'Don-0',
    url: 'https://github.com/Don-0'
  },

  // 企业备案信息
  beian: {
    company: '成都XXX科技有限公司',
    copyright: `© ${new Date().getFullYear()} 成都XXX科技有限公司`,
    gongan: {
      number: '川公网安备51010802XXXXXX号',
      province: '四川省'
    },
    icp: '蜀ICP备2024090198号-3',
    license: '91510108XXXXXXXXXXXX'
  },

  // 版权信息
  copyright: `© ${new Date().getFullYear()} Jank 博客系统. All rights reserved.`,

  // 默认主题
  defaultTheme: 'system',

  // 功能特性开关
  features: {
    comments: true,
    darkMode: true,
    newsletter: true,
    search: {
      apiKey: process.env.SEARCH_API_KEY || '',
      enabled: true,
      indexName: 'jank-blog',
      type: 'algolia'
    }
  },

  // 字体配置
  fonts: {
    main: interFont
  },

  // 主语言
  language: 'zh-CN',

  // 外部链接
  links: {
    docs: 'https://jank.org.cn/docs',
    github: 'https://github.com/Don-0',
    twitter: 'https://twitter.com/jank_blog'
  },

  // UI/UX配置
  ui: {
    animation: {
      enabled: true,
      reducedMotion: 'auto',
      preset: 'performance'
    },
    layout: {
      maxWidth: '1200px',
      navPosition: 'top'
    },
    logo: {
      dark: '',
      light: ''
    },
    typography: {
      fontFamily: {
        mono: 'JetBrains Mono, monospace',
        sans: 'Inter, system-ui, sans-serif'
      },
      fontSize: {
        base: '16px'
      }
    }
  }
}
