/**
 * HTTP客户端模块
 */
import { HttpRequestOptions, HttpResponse, HttpError } from './types'
import { CONFIG, logger } from './config'

// 重新导出类型
export type { HttpRequestOptions, HttpResponse, HttpError }

/**
 * 构建请求URL
 */
function buildUrl(api: string, params?: Record<string, any>): string {
  let baseUrl = CONFIG.baseURL || ''
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1'))
    baseUrl = baseUrl.replace('https://', 'http://')

  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const path = api.startsWith('/') ? api : `/${api}`
  const url = `${base}${path}`

  if (!params || Object.keys(params).length === 0) return url

  const query = Object.entries(params)
    .filter(([_, v]) => v != null)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join('&')

  return query ? `${url}${url.includes('?') ? '&' : '?'}${query}` : url
}

/**
 * 创建HTTP错误
 */
function createHttpError(
  status: number,
  message: string,
  data: any = null,
  url: string = ''
): HttpError {
  return {
    code: status,
    msg: message,
    data,
    url,
    timeStamp: Date.now(),
    requestId: ''
  }
}

/**
 * 标准化响应格式
 */
function normalizeResponse<T>(result: any, defaultValue: T): HttpResponse<T> {
  return {
    code: result?.code || 200,
    msg: result?.msg || 'success',
    data: result?.data ?? defaultValue,
    requestId: result?.requestId || `req-${Date.now()}`,
    timeStamp: result?.timeStamp || Date.now()
  }
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
    signal,
    silent = false
  } = options

  const url = buildUrl(api, params)
  if (!silent) logger.log(`${method} ${url}`, { params, data })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort('请求超时'), timeout)
  const combinedSignal = signal
    ? Object.assign(controller.signal, {
        addEventListener: signal.addEventListener
      })
    : controller.signal

  try {
    const response = await fetch(url, {
      method,
      headers: { ...CONFIG.headers, ...headers },
      body: data && method !== 'GET' ? JSON.stringify(data) : undefined,
      signal: combinedSignal
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = createHttpError(
        response.status,
        response.statusText || '请求失败',
        null,
        url
      )
      if (!silent) logger.error(`${method} ${url} 失败: ${error.msg}`, error)
      throw error
    }

    const contentType = response.headers.get('content-type')
    let result: any

    // 处理JSON响应
    if (contentType?.includes('application/json')) {
      try {
        result = await response.json()
      } catch (e) {
        result = { code: 200, msg: '解析JSON失败', data: null }
      }
      // 标准化响应格式
      result = normalizeResponse(result, null as T)
    }
    // 处理非JSON响应
    else {
      const textData = await response.text()
      result = normalizeResponse({ data: textData }, textData as unknown as T)
    }

    // 检查业务错误
    if (!silent && result.code !== 200)
      logger.error(
        `${method} ${url} 业务错误: ${result.msg || '未知错误'}`,
        result
      )

    return result
  } catch (error: any) {
    clearTimeout(timeoutId)

    let httpError: HttpError
    if (error.name === 'AbortError')
      httpError = createHttpError(408, '请求超时', null, url)
    else if (
      error instanceof TypeError &&
      error.message.includes('NetworkError')
    )
      httpError = createHttpError(503, '网络连接失败', null, url)
    else if (error.code && error.msg) httpError = error
    else
      httpError = createHttpError(
        500,
        error.message || '网络请求失败',
        null,
        url
      )

    if (!silent)
      logger.error(`${method} ${url} 异常: ${httpError.msg}`, httpError)
    throw httpError
  }
}

/**
 * HTTP客户端
 */
export const http = {
  delete: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
    request<T>(api, { data, method: 'DELETE', ...options }),
  get: <T = any>(
    api: string,
    params?: Record<string, any>,
    options?: HttpRequestOptions
  ) => request<T>(api, { params, method: 'GET', ...options }),
  post: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
    request<T>(api, { data, method: 'POST', ...options }),
  put: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
    request<T>(api, { data, method: 'PUT', ...options })
}

export const serverHttp = http
