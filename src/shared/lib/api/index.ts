/**
 * HTTP客户端模块 - 封装网络请求功能
 * 
 * 客户端导出 (仅在'use client'组件中使用):
 * - http: 客户端HTTP客户端对象
 * 
 * 服务器端导出 (在服务器组件和Server Actions中使用):
 * - serverHttp: 服务器端HTTP客户端对象
 */

// 导出类型和服务器端HTTP客户端
export type { HttpRequestOptions, HttpResponse } from './http'
export { serverHttp } from './http'

// 客户端HTTP类型
type HttpClient = {
    delete: (api: string, data?: any, options?: any) => Promise<any>;
    get: (api: string, params?: any, options?: any) => Promise<any>;
    post: (api: string, data?: any, options?: any) => Promise<any>;
    put: (api: string, data?: any, options?: any) => Promise<any>;
}

// 客户端HTTP方法
const httpMethods = ['delete', 'get', 'post', 'put'] as const

// 导出客户端HTTP客户端
export const http = httpMethods.reduce((acc, method) => {
    acc[method] = (api: string, data?: any, options?: any) => {
        if (typeof window === 'undefined') {
            console.error(`http.${method}() 被从服务器端调用，请使用 serverHttp`)
            throw new Error('http 只能在客户端组件中使用')
        }
        // 确保只在客户端执行
        return require('./http')[`http${method.charAt(0).toUpperCase() + method.slice(1)}`](api, data, options)
    }
    return acc
}, {} as HttpClient)
