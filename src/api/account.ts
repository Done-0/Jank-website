import type { HttpResponse } from '@/types/HttpType';
import http from '@/lib/axios';

/** 注册账号 */
export const registerAccount = (data: {
  email: string;
  nickname: string;
  password: string;
  phone?: string;
  email_verification_code: string;
  img_verification_code: string;
}): Promise<HttpResponse<any>> =>
  http.post('/v1/account/registerAccount', data);

/** 账号密码登录 */
export const loginAccount = (data: {
  email: string;
  password: string;
  img_verification_code: string;
}): Promise<HttpResponse<any>> =>
  http.post('/v1/account/loginAccount', data);

/** 账号退出 */
export const logoutAccount = (): Promise<HttpResponse<null>> =>
  http.post('/v1/account/logoutAccount');

/** 获取账号信息 */
export const getAccount = (email: string): Promise<
  HttpResponse<any>
> => http.post('/v1/account/getAccount', { email });

/** 重置密码 */
export const resetPassword = (data: {
  email: string;
  new_password: string;
  again_new_password: string;
  email_verification_code: string;
}): Promise<HttpResponse<any>> =>
  http.post('/v1/account/resetPassword', data);


