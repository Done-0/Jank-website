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
    'Jank 是一款基于 Go 语言开发的高性能、轻量级博客系统，内存占用仅 13MB。提供完整的 Go 语言教程与在线课程，助力开发者提升技能，旨在构建程序员社区。',
  url: 'https://jank.org.cn',
  language: 'zh-CN',
  copyright: `© ${new Date().getFullYear()} Jank 博客系统. All rights reserved.`,

  // UI/主题
  defaultTheme: 'system',
  fonts: {
    main: interFont
  },
  ui: {
    animation: {
      enabled: true,
      reducedMotion: 'auto',
      preset: 'performance'
    }
  },

  // 功能开关
  features: {
    darkMode: true,
    comments: true,
    newsletter: true,
    search: {
      enabled: true,
      type: 'algolia',
      indexName: 'jank-blog',
      apiKey: process.env.SEARCH_API_KEY || ''
    }
  },

  // 链接与作者
  links: {
    docs: 'https://jank.org.cn/docs',
    github: 'https://github.com/Done-0'
  },
  author: {
    name: 'Done-0',
    email: 'fenderisfine@outlook.com',
    url: 'https://github.com/Done-0'
  },

  // API配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:9010/api',
    timeout: 10000,
    retries: 3,
    caching: true,
    enableLogging: process.env.NEXT_PUBLIC_ENV !== 'production'
  },

  // 备案信息
  beian: {
    icp: '蜀ICP备2024090198号-3',
    company: '成都XXX科技有限公司',
    copyright: `© ${new Date().getFullYear()} 成都XXX科技有限公司`,
    license: '91510108XXXXXXXXXXXX',
    gongan: {
      number: '川公网安备51010802XXXXXX号',
      province: '四川省'
    }
  }
}
