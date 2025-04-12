/**
 * SEO响应头通用配置
 */
export const seoResponseHeaders = {
  'Content-Type': 'application/xml',
  'X-Robots-Tag': 'index, follow'
}

/**
 * 缓存控制头配置
 */
export const cacheControlHeaders = {
  success: {
    'Cache-Control': 'public, max-age=3600, s-maxage=86400'
  },
  error: {
    'Cache-Control': 'no-cache'
  }
}
