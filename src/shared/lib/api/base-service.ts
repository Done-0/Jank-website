/**
 * 服务基类
 * 提供通用的HTTP服务方法，减少重复代码
 */

import { serverHttp, http, HttpResponse, HttpRequestOptions } from './index'

export interface ServiceConfig {
    baseUrl: string
    useClientApi?: boolean  // 默认使用服务端API
}

/**
 * 基础服务类
 * 封装常见的API操作，可被各模块服务继承
 */
export class BaseService {
    protected baseUrl: string
    protected api: typeof serverHttp | typeof http

    constructor(config: ServiceConfig) {
        this.baseUrl = config.baseUrl
        this.api = config.useClientApi ? http : serverHttp
    }

    /**
     * 构建完整URL
     */
    protected getFullUrl(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`
    }

    /**
     * 执行GET请求
     */
    protected async get<T>(
        endpoint: string,
        params?: Record<string, any>,
        options?: HttpRequestOptions
    ): Promise<HttpResponse<T>> {
        return this.api.get(this.getFullUrl(endpoint), params, options)
    }

    /**
     * 执行POST请求
     */
    protected async post<T>(
        endpoint: string,
        data?: any,
        options?: HttpRequestOptions
    ): Promise<HttpResponse<T>> {
        return this.api.post(this.getFullUrl(endpoint), data, options)
    }

    /**
     * 执行PUT请求
     */
    protected async put<T>(
        endpoint: string,
        data?: any,
        options?: HttpRequestOptions
    ): Promise<HttpResponse<T>> {
        return this.api.put(this.getFullUrl(endpoint), data, options)
    }

    /**
     * 执行DELETE请求
     */
    protected async delete<T>(
        endpoint: string,
        data?: any,
        options?: HttpRequestOptions
    ): Promise<HttpResponse<T>> {
        return this.api.delete(this.getFullUrl(endpoint), data, options)
    }
} 