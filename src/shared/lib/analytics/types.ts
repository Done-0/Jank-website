/**
 * Google Analytics 类型定义
 */

declare global {
    interface Window {
        gtag: (...args: any[]) => void
    }
}

/**
 * 事件参数接口
 */
export interface EventParams {
    [key: string]: any
}

/**
 * 页面浏览事件参数
 */
export interface PageViewParams {
    page_path: string
    page_title: string
}

/**
 * 错误事件参数
 */
export interface ErrorParams {
    error_message: string
    error_source: string
}

/**
 * 转化事件参数
 */
export interface ConversionParams {
    send_to: string
    [key: string]: any
} 