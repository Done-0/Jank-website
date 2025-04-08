import { EventParams } from './types'

/**
 * 格式化事件参数
 * @param params 原始参数
 * @returns 格式化后的参数
 */
export function formatEventParams(params: EventParams): EventParams {
    return Object.entries(params).reduce((acc, [key, value]) => {
        // 移除 undefined 和 null 值
        if (value !== undefined && value !== null) {
            acc[key] = value
        }
        return acc
    }, {} as EventParams)
}

/**
 * 创建页面浏览参数
 * @param path 页面路径
 * @param title 页面标题
 * @returns 页面浏览参数
 */
export function createPageViewParams(path: string, title: string) {
    return {
        page_path: path,
        page_title: title
    }
}

/**
 * 创建错误参数
 * @param message 错误信息
 * @param source 错误来源
 * @returns 错误参数
 */
export function createErrorParams(message: string, source: string) {
    return {
        error_message: message,
        error_source: source
    }
}

/**
 * 创建转化参数
 * @param conversionId 转化ID
 * @param params 额外参数
 * @returns 转化参数
 */
export function createConversionParams(conversionId: string, params?: EventParams) {
    return {
        send_to: conversionId,
        ...params
    }
} 