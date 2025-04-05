'use client'

import { LoginForm } from '@/modules/account/components/LoginForm'
import { RegisterForm } from '@/modules/account/components/RegisterForm'
import { useState } from 'react'

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <div className='flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4'>
      <div className='w-full max-w-sm sm:max-w-md rounded-lg border shadow-sm p-6 sm:p-8'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <h1 className='text-2xl font-semibold tracking-tight text-center'>
              {isRegistering ? '注册账号' : '登录账号'}
            </h1>
            <p className='text-sm text-muted-foreground text-center'>
              {isRegistering
                ? '创建一个新账号以开始使用'
                : '输入您的邮箱和密码登录'}
            </p>
          </div>

          <div className='transition-all duration-200 ease-in-out'>
            {isRegistering ? (
              <RegisterForm onSwitchToLogin={() => setIsRegistering(false)} />
            ) : (
              <LoginForm onSwitchToRegister={() => setIsRegistering(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
