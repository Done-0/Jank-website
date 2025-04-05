/**
 * API模块统一导出
 */

// 导入HTTP客户端
import { http } from './http'

// 类型导出
export type {
  HttpRequestOptions,
  HttpResponse,
  HttpError,
  ServiceConfig,
  ApiResponse,
  ActionResponse
} from './types'

// 错误相关
export { ErrorCode } from './types'
export { AppError, errors } from './errors'

// 响应处理
export { createSuccess, createError, isSuccess, apiToAction } from './response'

// 全局配置
export { httpConfig } from './config'

// HTTP客户端
export { http, serverHttp } from './http'

// 基础类
export { BaseService } from './base-service'
export { BaseAction } from './base-action'

// 简便函数
export const { get, post, put, delete: httpDelete } = http
