/**
 * API基础Action类模块
 */
import { ActionResponse } from './types'
import { createSuccess, createError } from './response'

/**
 * 基础Action类
 * 封装通用的错误处理和响应格式化
 */
export class BaseAction {
  /**
   * 执行服务调用并处理响应
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
   * 获取列表数据
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
   * 获取详情数据
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
