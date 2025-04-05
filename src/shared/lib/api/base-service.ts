/**
 * API服务基类
 */
import {
  HttpRequestOptions,
  HttpResponse,
  HttpError,
  ServiceConfig
} from './types'
import { http, serverHttp } from './http'

/**
 * 基础服务类
 * 封装常见的API操作，可被各模块服务继承
 */
export class BaseService {
  protected baseUrl: string // 必选：API基础路径
  protected api: typeof serverHttp // 功能：使用服务端API
  protected serviceName: string // 标识：服务名称
  protected silent: boolean // 调试：允许日志输出

  constructor(config: ServiceConfig) {
    this.baseUrl = config.baseUrl
    this.api = config.useClientApi ? http : serverHttp
    this.serviceName = config.serviceName ?? this.constructor.name
    this.silent = config.silent ?? false
  }

  /**
   * 构建完整URL
   */
  protected getFullUrl(endpoint: string): string {
    if (endpoint.startsWith(this.baseUrl)) return endpoint
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${this.baseUrl}${path}`
  }

  /**
   * 验证响应数据，子类可重写
   */
  protected validateResponse<T>(response: HttpResponse<T>): HttpResponse<T> {
    if (response.code !== 200) {
      console.warn(
        `[${this.serviceName}] 接口返回错误码:`,
        response.code,
        response.msg
      )
    }
    return response
  }

  /**
   * 执行GET请求
   */
  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.api.get<T>(
        this.getFullUrl(endpoint),
        params,
        { silent: this.silent, ...options }
      )
      return this.validateResponse(response)
    } catch (error) {
      return this.handleError<T>(error as HttpError)
    }
  }

  /**
   * 执行POST请求
   */
  protected async post<T>(
    endpoint: string,
    data?: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.api.post<T>(this.getFullUrl(endpoint), data, {
        silent: this.silent,
        ...options
      })
      return this.validateResponse(response)
    } catch (error) {
      return this.handleError<T>(error as HttpError)
    }
  }

  /**
   * 执行PUT请求
   */
  protected async put<T>(
    endpoint: string,
    data?: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.api.put<T>(this.getFullUrl(endpoint), data, {
        silent: this.silent,
        ...options
      })
      return this.validateResponse(response)
    } catch (error) {
      return this.handleError<T>(error as HttpError)
    }
  }

  /**
   * 执行DELETE请求
   */
  protected async delete<T>(
    endpoint: string,
    data?: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.api.delete<T>(
        this.getFullUrl(endpoint),
        data,
        { silent: this.silent, ...options }
      )
      return this.validateResponse(response)
    } catch (error) {
      return this.handleError<T>(error as HttpError)
    }
  }

  /**
   * 错误处理，子类可重写
   */
  protected handleError<T>(error: HttpError): never {
    if (error.code === 401) {
      console.error(`[${this.serviceName}] 未授权:`, error)
    } else if (error.code === 404) {
      console.error(`[${this.serviceName}] 接口不存在:`, error)
      error.msg = `${error.msg || '接口不存在'}`
    } else if (!error.msg || error.msg === 'undefined') {
      error.msg = '服务未返回有效响应'
    }

    throw error
  }
}
