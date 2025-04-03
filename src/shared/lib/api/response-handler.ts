/**
 * 响应处理工具
 * 提供统一的响应格式化和错误处理，匹配后端API标准
 */

// 错误代码枚举
export enum ErrorCode {
    SUCCESS = 0,
    PARAM_ERROR = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}

// 错误信息
export interface ApiError {
    code: number
    msg: string
}

// API响应结构
export interface ApiResponse<T = any> {
    code: number
    msg: string
    data: T
    requestId: string
    timeStamp: number
}

// Action响应结构
export type ActionResponse<T = any> = {
    data: T
    code: number
    msg: string
    success: boolean
    requestId: string
    timeStamp: number
}

// 自定义错误类
export class AppError extends Error {
    code: number

    constructor(message: string, code = ErrorCode.SERVER_ERROR) {
        super(message)
        this.code = code
        this.name = 'AppError'
    }
}

/**
 * 创建成功响应
 */
export function createSuccess<T>(
    data: T,
    message = '操作成功',
    options?: {
        requestId?: string
        timeStamp?: number
    }
): ActionResponse<T> {
    return {
        code: ErrorCode.SUCCESS,
        data,
        msg: message,
        success: true,
        requestId: options?.requestId || `req-${Date.now()}`,
        timeStamp: options?.timeStamp || Date.now()
    }
}

/**
 * 创建错误响应
 */
export function createError<T>(
    error: unknown,
    options?: {
        message?: string
        code?: number
        requestId?: string
        timeStamp?: number
    }
): ActionResponse<T> {
    // 处理错误信息
    let errorMessage = '操作失败'
    let errorCode = ErrorCode.SERVER_ERROR

    if (error instanceof AppError) {
        errorMessage = error.message
        errorCode = error.code
    } else if (error instanceof Error) {
        errorMessage = error.message
    }

    console.error('[API错误]:', error)

    return {
        code: options?.code ?? errorCode,
        data: {} as T,
        msg: options?.message ?? errorMessage,
        success: false,
        requestId: options?.requestId || `err-${Date.now()}`,
        timeStamp: options?.timeStamp || Date.now()
    }
}

/**
 * 检查响应是否成功
 */
export function isSuccess<T>(response: ActionResponse<T>): boolean {
    return response.success === true && response.code === ErrorCode.SUCCESS
}

/**
 * 向后兼容的别名
 * @deprecated 使用 isSuccess 代替
 */
export const isActionSuccess = isSuccess

/**
 * 预定义错误
 */
export const errors = {
    param: (message = '参数错误') =>
        new AppError(message, ErrorCode.PARAM_ERROR),
    unauthorized: (message = '未授权') =>
        new AppError(message, ErrorCode.UNAUTHORIZED),
    notFound: (message = '资源不存在') =>
        new AppError(message, ErrorCode.NOT_FOUND),
    server: (message = '服务器错误') =>
        new AppError(message, ErrorCode.SERVER_ERROR)
}

/**
 * 将API响应转换为Action响应
 */
export function apiToAction<T>(response: ApiResponse<T>): ActionResponse<T> {
    return {
        code: response.code,
        data: response.data,
        msg: response.msg,
        success: response.code === ErrorCode.SUCCESS,
        requestId: response.requestId,
        timeStamp: response.timeStamp
    }
}


