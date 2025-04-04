/**
 * Action基类
 * 提供通用的服务端Action方法
 */

import { createSuccess, createError, ActionResponse } from './response-handler'

/**
 * 基础Action类
 * 封装通用的错误处理和响应格式化
 */
export class BaseAction {
  /**
   * 执行服务操作并统一处理响应和错误
   */
  protected async execute<T>(
    serviceCall: () => Promise<{ data: T }>,
    successMsg: string,
    errorMsg: string
  ): Promise<ActionResponse<T>> {
    try {
      const response = await serviceCall()
      return createSuccess(response.data, successMsg)
    } catch (error) {
      return createError(error, { message: errorMsg })
    }
  }

  /**
   * 获取数据列表
   */
  protected async getList<T, P = any>(
    serviceCall: (params: P) => Promise<{ data: T }>,
    params: P,
    successMsg = '获取列表成功',
    errorMsg = '获取列表失败'
  ): Promise<ActionResponse<T>> {
    return this.execute(() => serviceCall(params), successMsg, errorMsg)
  }

  /**
   * 获取单条数据
   */
  protected async getDetail<T, P = any>(
    serviceCall: (params: P) => Promise<{ data: T }>,
    params: P,
    successMsg = '获取详情成功',
    errorMsg = '获取详情失败'
  ): Promise<ActionResponse<T>> {
    return this.execute(() => serviceCall(params), successMsg, errorMsg)
  }

  /**
   * 创建数据
   */
  protected async create<T, P = any>(
    serviceCall: (data: P) => Promise<{ data: T }>,
    data: P,
    successMsg = '创建成功',
    errorMsg = '创建失败'
  ): Promise<ActionResponse<T>> {
    return this.execute(() => serviceCall(data), successMsg, errorMsg)
  }

  /**
   * 更新数据
   */
  protected async update<T, P = any>(
    serviceCall: (data: P) => Promise<{ data: T }>,
    data: P,
    successMsg = '更新成功',
    errorMsg = '更新失败'
  ): Promise<ActionResponse<T>> {
    return this.execute(() => serviceCall(data), successMsg, errorMsg)
  }

  /**
   * 删除数据
   */
  protected async delete<T, P = any>(
    serviceCall: (params: P) => Promise<{ data: T }>,
    params: P,
    successMsg = '删除成功',
    errorMsg = '删除失败'
  ): Promise<ActionResponse<T>> {
    return this.execute(() => serviceCall(params), successMsg, errorMsg)
  }
}
