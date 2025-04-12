import { AnalyticsConfig } from '@shared/types/Analytics'

/**
 * Google Analytics 配置
 * 包含所有 Google Analytics 4 的跟踪配置
 */
export const analyticsConfig: AnalyticsConfig = {
  /** Google Analytics 4 测量 ID */
  measurementId: 'G-QP7GYEVKK1',

  /** 是否启用调试模式 */
  debug: process.env.NEXT_PUBLIC_ENV !== 'production',

  /** 默认事件配置 */
  defaultEvents: {
    /** 启用页面浏览跟踪 */
    pageView: true,
    /** 滚动深度跟踪配置 */
    scrollDepth: {
      enabled: true,
      thresholds: [25, 50, 75, 90]
    }
  },

  /** 自定义维度配置 */
  customDimensions: {
    userRole: 'dimension1'
  },

  /** 自定义指标配置 */
  customMetrics: {
    pageLoadTime: 'metric1'
  }
}
