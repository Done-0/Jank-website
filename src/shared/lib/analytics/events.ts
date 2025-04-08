import { EventParams, PageViewParams, ErrorParams, ConversionParams } from './types'

/**
 * 检查是否在浏览器环境中
 */
const isBrowser = typeof window !== 'undefined'

/**
 * 发送事件到 Google Analytics
 * @param eventName 事件名称
 * @param params 事件参数
 */
export function sendEvent(eventName: string, params?: EventParams) {
    if (isBrowser) {
        window.gtag('event', eventName, params)
    }
}

/**
 * 发送页面浏览事件
 * @param params 页面浏览参数
 */
export function sendPageView(params: PageViewParams) {
    if (isBrowser) {
        window.gtag('event', 'page_view', params)
    }
}

/**
 * 发送错误事件
 * @param params 错误参数
 */
export function sendError(params: ErrorParams) {
    if (isBrowser) {
        window.gtag('event', 'error', params)
    }
}

/**
 * 发送转化事件
 * @param params 转化参数
 */
export function sendConversion(params: ConversionParams) {
    if (isBrowser) {
        window.gtag('event', 'conversion', params)
    }
} 