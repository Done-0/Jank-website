/**
 * 账户认证服务类
 * 负责账户认证相关的API通信
 */

import { BaseService } from '@/shared/lib/api/base-service'
import { HttpResponse } from '@/shared/lib/api'
import { UserInfo } from '../store/authStore'
import {
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues
} from '../validators/form-validators'

/**
 * 账户认证服务类
 * 封装账户认证相关API调用
 */
export class AuthService extends BaseService {
  constructor() {
    super({
      baseUrl: '/v1/account',
      useClientApi: true
    })
  }

  /**
   * 邮箱密码登录
   */
  async loginUser(data: LoginFormValues): Promise<
    HttpResponse<{
      access_token: string
      refresh_token: string
      userInfo: UserInfo
    }>
  > {
    return this.post('/loginAccount', data)
  }

  /**
   * 注册新账户
   */
  async registerUser(data: RegisterFormValues): Promise<
    HttpResponse<{
      email: string
      nickname: string
    }>
  > {
    return this.post('/registerAccount', data)
  }

  /**
   * 获取账户信息
   */
  async getAccountInfo(email: string): Promise<
    HttpResponse<{
      avatar: string
      email: string
      nickname: string
      phone: string
    }>
  > {
    return this.post('/getAccount', { email })
  }

  /**
   * 退出登录
   */
  async logoutUser(): Promise<HttpResponse<null>> {
    return this.post('/logoutAccount')
  }

  /**
   * 重置用户密码
   */
  async resetUserPassword(data: ResetPasswordFormValues): Promise<
    HttpResponse<{
      success: boolean
    }>
  > {
    return this.post('/resetPassword', data)
  }
}

// 单例实例
export const authService = new AuthService()
