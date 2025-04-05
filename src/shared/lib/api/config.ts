/**
 * API配置模块
 */
import { siteConfig } from '@shared/config/site.config'

/**
 * HTTP全局配置
 */
export const httpConfig = {
  enableLogging:
    siteConfig?.api?.enableLogging ??
    process.env.NEXT_PUBLIC_ENV !== 'production',
  logStyle: 'color: #1E88E5',
  errorStyle: 'color: #D32F2F'
}

/**
 * 默认HTTP配置
 */
export const CONFIG = {
  baseURL: siteConfig?.api?.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: siteConfig?.api?.timeout || 10000
}

/**
 * 日志工具
 */
export const logger = {
  log: (m: string, d?: any) => {
    if (!httpConfig.enableLogging) return
    console.log(`%c[HTTP] ${m}`, httpConfig.logStyle, d || '')
  },
  error: (m: string, e?: any) => {
    if (!httpConfig.enableLogging) return
    const safeMessage = m?.includes('undefined')
      ? m.replace('undefined', '未知错误')
      : m || '未知错误'
    console.error(
      `%c[HTTP Error] ${safeMessage}`,
      httpConfig.errorStyle,
      e || ''
    )
  }
}
