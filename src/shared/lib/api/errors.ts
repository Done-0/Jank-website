/**
 * API错误模块
 */
import { ErrorCode } from './types'

/**
 * 应用错误类
 */
export class AppError extends Error {
    code: number;

    constructor(message: string, code = ErrorCode.SERVER_ERROR) {
        super(message);
        this.code = code;
        this.name = 'AppError';
    }
}

/**
 * 常用错误工厂
 */
export const errors = {
    param: (message = '参数错误') => new AppError(message, ErrorCode.PARAM_ERROR),
    unauthorized: (message = '未授权') => new AppError(message, ErrorCode.UNAUTHORIZED),
    notFound: (message = '资源不存在') => new AppError(message, ErrorCode.NOT_FOUND),
    server: (message = '服务器错误') => new AppError(message, ErrorCode.SERVER_ERROR)
}; 