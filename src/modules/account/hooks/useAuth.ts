'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getAccountInfoAction,
  loginAction,
  logoutAction,
  registerAction,
  resetPasswordAction
} from '../actions/authActions'
import { useAuthStore } from '../store/authStore'
import { HttpResponse } from '@/shared/lib/api/http'
import { GetAccount, LoginAccountResponse } from '../types/Account'
import {
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues
} from '../validators/form-validators'

type AsyncOperation<T, R> = (data: T) => Promise<HttpResponse<R>>

/**
 * 身份认证钩子
 * 抽象组件级别的认证状态管理
 */
export function useAuth() {
  const router = useRouter()
  const {
    isAuthenticated,
    login,
    logout: storeLogout,
    updateUserInfo,
    userInfo
  } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    if (isAuthenticated && userInfo) {
      handleGetAccountInfo(userInfo.email)
    }
  }, [isAuthenticated, userInfo?.email])

  /**
   * 通用异步操作处理器
   * 统一处理loading状态、错误处理和消息提示
   */
  const handleAsyncOperation = async <T, R>(
    operation: AsyncOperation<T, R>,
    data: T,
    successMessage: string,
    successCallback?: (result: R) => void,
    redirectPath?: string
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await operation(data)

      if (result.code === 0) {
        toast.success(result.msg || successMessage)
        if (successCallback && result.data) {
          successCallback(result.data)
        }
        if (redirectPath) {
          router.push(redirectPath)
        }
        return true
      } else {
        const errorMsg = result.msg || '操作失败'
        setError(errorMsg)
        toast.error(errorMsg)
        return false
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '操作失败，请重试'
      setError(message)
      toast.error(message)
      console.error('操作错误:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理登录
   */
  const handleLogin = async (data: LoginFormValues) => {
    return handleAsyncOperation(
      loginAction,
      data,
      '登录成功',
      (data: LoginAccountResponse['data']) =>
        login(data.access_token, data.refresh_token, data.userInfo),
      '/dashboard'
    )
  }

  /**
   * 处理注册
   */
  const handleRegister = async (data: RegisterFormValues) => {
    return handleAsyncOperation(
      registerAction,
      data,
      '注册成功，请登录',
      undefined,
      '/login'
    )
  }

  /**
   * 处理退出登录
   */
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logoutAction()
      storeLogout()
      toast.success('退出成功')
      router.push('/login')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '退出失败，请重试'
      toast.error(message)
      console.error('退出错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 获取账户信息
   */
  const handleGetAccountInfo = async (email: string) => {
    return handleAsyncOperation(
      email => getAccountInfoAction(email),
      email,
      '获取账户信息成功',
      (data: GetAccount) => updateUserInfo(data)
    )
  }

  /**
   * 处理重置密码
   */
  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    return handleAsyncOperation(
      resetPasswordAction,
      data,
      '密码重置成功，请重新登录',
      undefined,
      '/login'
    )
  }

  return {
    error,
    handleGetAccountInfo,
    handleLogin,
    handleLogout,
    handleRegister,
    handleResetPassword,
    isAuthenticated,
    isLoading,
    userInfo
  }
}
