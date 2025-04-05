'use server'

import { BaseAction, HttpResponse } from '@/shared/lib/api'
import type {
  GetAccount,
  LoginAccountResponse,
  RegisterAccountResponse
} from '../types/Account'
import {
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues
} from '../validators/form-validators'
import { authService } from '../services/authService'
import { cache } from 'react'

/**
 * 账户认证操作类
 * 处理账户相关的服务端逻辑
 */
class AuthActions extends BaseAction {
  /**
   * 获取用户信息
   */
  async getAccountInfo(email: string): Promise<HttpResponse<GetAccount>> {
    return this.execute(
      () => authService.getAccountInfo(email),
      '获取用户信息成功',
      '获取用户信息失败'
    )
  }

  /**
   * 用户登录
   */
  async login(
    data: LoginFormValues
  ): Promise<HttpResponse<LoginAccountResponse['data']>> {
    return this.execute(
      () => authService.loginUser(data),
      '登录成功',
      '登录失败'
    )
  }

  /**
   * 用户注册
   */
  async register(
    data: RegisterFormValues
  ): Promise<HttpResponse<RegisterAccountResponse['data']>> {
    return this.execute(
      () => authService.registerUser(data),
      '注册成功',
      '注册失败'
    )
  }

  /**
   * 重置密码
   */
  async resetPassword(
    data: ResetPasswordFormValues
  ): Promise<HttpResponse<{ success: boolean }>> {
    return this.execute(
      () => authService.resetUserPassword(data),
      '重置密码成功',
      '重置密码失败'
    )
  }

  /**
   * 用户登出
   */
  async logout(): Promise<HttpResponse<null>> {
    return this.execute(() => authService.logoutUser(), '登出成功', '登出失败')
  }
}

// 创建实例
const authActions = new AuthActions()

// 使用缓存优化的账户操作
export const getAccountInfoAction = cache(async (email: string) =>
  authActions.getAccountInfo(email)
)

export const loginAction = async (data: LoginFormValues) =>
  authActions.login(data)

export const registerAction = async (data: RegisterFormValues) =>
  authActions.register(data)

export const resetPasswordAction = async (data: ResetPasswordFormValues) =>
  authActions.resetPassword(data)

export const logoutAction = async () => authActions.logout()
