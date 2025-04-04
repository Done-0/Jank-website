import { seoConfig } from '@/shared/config/seo.config'
import { siteConfig } from '@/shared/config/site.config'

/**
 * 构建规范URL
 */
export const buildUrl = (path?: string, config = seoConfig): string => {
  if (!path) return config.canonicalUrlPrefix || ''
  return `${config.canonicalUrlPrefix || ''}${
    path.startsWith('/') ? path : `/${path}`
  }`
}

/**
 * 获取Open Graph图片URL
 */
export const getOgImage = (ogImage?: string): string =>
  ogImage ||
  seoConfig.openGraph?.images?.[0]?.url ||
  `${siteConfig.url}/og-image.png`

/**
 * 创建keywords字符串
 */
export const formatKeywords = (
  keywords: string[] = seoConfig.keywords
): string => keywords.join(', ')
