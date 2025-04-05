/**
 * API类型定义
 */

/**
 * HTTP请求选项
 */
export interface HttpRequestOptions {
    data?: any
    headers?: Record<string, string>
    method?: 'DELETE' | 'GET' | 'POST' | 'PUT'
    params?: Record<string, any>
    timeout?: number
    signal?: AbortSignal
    silent?: boolean
}

/**
 * HTTP响应
 */
export interface HttpResponse<T = any> {
    code?: number
    data: T
    msg?: string
    requestId: string
    timeStamp: number
}

/**
 * HTTP错误
 */
export interface HttpError {
    code: number
    msg: string
    data: any
    url?: string
    requestId?: string
    timeStamp: number
}

/**
 * 服务配置
 */
export interface ServiceConfig {
    baseUrl: string
    useClientApi?: boolean
    silent?: boolean
    serviceName?: string
}

/**
 * 错误码
 */
export enum ErrorCode {
    SUCCESS = 0,
    PARAM_ERROR = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}

/**
 * API响应
 */
export interface ApiResponse<T = any> {
    code: number
    msg: string
    data: T
    requestId: string
    timeStamp: number
}

/**
 * Action响应
 */
export type ActionResponse<T = any> = {
    data: T
    code: number
    msg: string
    success: boolean
    requestId: string
    timeStamp: number
} 