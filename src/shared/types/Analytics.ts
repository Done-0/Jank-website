/**
 * Google Analytics 配置接口
 * 用于配置和管理 Google Analytics 4 的跟踪功能
 */
export interface AnalyticsConfig {
  /** Google Analytics 4 测量 ID */
  measurementId: string
  /** 是否启用调试模式，默认为非生产环境 */
  debug?: boolean
  /** 默认事件配置 */
  defaultEvents: {
    /** 是否启用页面浏览跟踪 */
    pageView: boolean
    /** 滚动深度跟踪配置 */
    scrollDepth?: {
      /** 是否启用滚动深度跟踪 */
      enabled: boolean
      /** 滚动深度阈值百分比数组，例如 [25, 50, 75, 90] */
      thresholds: number[]
    }
  }
  /** 自定义维度配置 */
  customDimensions?: Record<string, string>
  /** 自定义指标配置 */
  customMetrics?: Record<string, string>
}

/**
 * Google Analytics 事件接口
 * 用于定义发送到 Google Analytics 的自定义事件
 */
export interface AnalyticsEvent {
  /** 事件名称 */
  name: string
  /** 事件参数，键值对形式 */
  params?: Record<string, any>
}
