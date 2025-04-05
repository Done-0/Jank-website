/**
 * API响应处理模块
 */
import { ActionResponse, ApiResponse, ErrorCode } from './types'
import { AppError } from './errors'

/**
 * 创建成功响应
 */
export function createSuccess<T>(
    data: T,
    message = '操作成功',
    options?: { requestId?: string, timeStamp?: number }
): ActionResponse<T> {
    return {
        code: ErrorCode.SUCCESS,
        data,
        msg: message,
        success: true,
        requestId: options?.requestId || `req-${Date.now()}`,
        timeStamp: options?.timeStamp || Date.now()
    };
}

/**
 * 创建错误响应
 */
export function createError<T>(
    error: unknown,
    options?: { message?: string, code?: number, requestId?: string, timeStamp?: number }
): ActionResponse<T> {
    let errorMessage = '操作失败';
    let errorCode = ErrorCode.SERVER_ERROR;

    if (error instanceof AppError) {
        errorMessage = error.message;
        errorCode = error.code;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    console.error('[API错误]:', error);

    return {
        code: options?.code ?? errorCode,
        data: {} as T,
        msg: options?.message ?? errorMessage,
        success: false,
        requestId: options?.requestId || `err-${Date.now()}`,
        timeStamp: options?.timeStamp || Date.now()
    };
}

/**
 * 判断响应是否成功
 */
export function isSuccess<T>(response: ActionResponse<T>): boolean {
    return response.success === true && response.code === ErrorCode.SUCCESS;
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
    };
} 