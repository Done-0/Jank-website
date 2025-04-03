/**
 * HTTP客户端模块
 * 提供统一的HTTP请求接口和类型定义
 */

/**
 * HTTP请求配置接口
 */
export interface HttpRequestOptions {
    data?: any
    headers?: Record<string, string>
    method?: 'DELETE' | 'GET' | 'POST' | 'PUT'
    params?: Record<string, any>
    timeout?: number
    withToken?: boolean
    signal?: AbortSignal
}

/**
 * HTTP响应接口
 */
export interface HttpResponse<T = any> {
    code: number
    data: T
    msg: string
    requestId: string
    timeStamp: number
}

/**
 * 基础配置
 */
const CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
}

/**
 * 构建完整的请求URL，处理查询参数
 */
function buildUrl(api: string, params?: Record<string, any>): string {
    if (!params) return `${CONFIG.baseURL}${api}`

    const query = Object.entries(params)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => {
            const val = Array.isArray(v)
                ? v.map(encodeURIComponent).join(',')
                : encodeURIComponent(String(v))
            return `${encodeURIComponent(k)}=${val}`
        })
        .join('&')

    return query ? `${CONFIG.baseURL}${api}?${query}` : `${CONFIG.baseURL}${api}`
}

/**
 * 核心请求函数
 */
async function request<T = any>(
    api: string,
    options: HttpRequestOptions = {}
): Promise<HttpResponse<T>> {
    const {
        data,
        headers = {},
        method = 'GET',
        params,
        timeout = CONFIG.timeout,
        signal
    } = options

    // 超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // 合并信号
    const reqSignal = signal
        ? (() => {
            const ctrl = new AbortController()
                ;[signal, controller.signal].forEach(s => {
                    if (s.aborted) return ctrl.abort(s.reason)
                    s.addEventListener('abort', () => ctrl.abort(s.reason), { once: true })
                })
            return ctrl.signal
        })()
        : controller.signal

    try {
        const response = await fetch(buildUrl(api, params), {
            method,
            headers: new Headers({ ...CONFIG.headers, ...headers }),
            body: data && method !== 'GET' ? JSON.stringify(data) : undefined,
            signal: reqSignal
        })

        clearTimeout(timeoutId)

        // 处理响应
        const result = await response.json().catch(() => ({
            code: response.status,
            msg: '无效的响应格式',
            data: null
        }))

        if (response.ok) return result

        throw { ...result, status: response.status, url: api }
    } catch (error: any) {
        clearTimeout(timeoutId)

        // 标准化错误
        if (error.name === 'AbortError') {
            throw { code: 408, msg: '请求超时', data: null, timeStamp: Date.now(), requestId: '' }
        }

        throw error.code
            ? error
            : { code: 500, msg: error.message || '网络请求失败', data: null, timeStamp: Date.now(), requestId: '' }
    }
}

/**
 * HTTP请求方法
 */
export const http = {
    delete: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
        request<T>(api, { data, method: 'DELETE', ...options }),

    get: <T = any>(api: string, params?: Record<string, any>, options?: HttpRequestOptions) =>
        request<T>(api, { params, method: 'GET', ...options }),

    post: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
        request<T>(api, { data, method: 'POST', ...options }),

    put: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
        request<T>(api, { data, method: 'PUT', ...options })
}

// 服务器端使用的别名，保持兼容性
export const serverHttp = http

// 单独导出HTTP方法，便于直接使用
export const { get: httpGet, post: httpPost, put: httpPut, delete: httpDelete } = http 