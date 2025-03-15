import type { HttpResponse } from '@/types/HttpType';
import http from '@/lib/axios';

/** 获取图形验证码 */
export const fetchVerificationCode = (email: string): Promise<HttpResponse<{ imgBase64: string }>> =>
    http.get(`/v1/verification/sendImgVerificationCode?email=${email}`);

/** 发送邮箱验证码 */
export const sendVerificationCode = (email: string): Promise<HttpResponse<string>> =>
    http.get(`/v1/verification/sendEmailVerificationCode?email=${email}`);
