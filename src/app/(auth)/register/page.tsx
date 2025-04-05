'use client'

import { RegisterForm } from '@/modules/account/components/RegisterForm'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className='flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4'>
      <div className='w-full max-w-sm sm:max-w-md rounded-lg border shadow-sm p-6 sm:p-8'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <h1 className='text-2xl font-semibold tracking-tight text-center'>
              创建账号
            </h1>
            <p className='text-sm text-muted-foreground text-center'>
              请填写以下信息完成注册
            </p>
          </div>

          <div className='transition-all duration-200 ease-in-out'>
            <RegisterForm onSwitchToLogin={() => router.push('/login')} />
          </div>
        </div>
      </div>
    </div>
  )
}
