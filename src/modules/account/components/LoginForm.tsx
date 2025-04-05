'use client'

import { verificationService } from '@/modules/verification/services/verification'
import { Button } from '@/shared/components/ui/shadcn/button'
import { Form } from '@/shared/components/ui/shadcn/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { VerificationCodeInput } from '../../verification/components/VerificationCodeInput'
import { useAuth } from '../hooks/useAuth'
import {
  type LoginFormValues,
  loginValidator
} from '../validators/form-validators'
import { FormInput } from './FormInput'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { handleLogin, isLoading } = useAuth()
  const [imgVerificationCode, setImgVerificationCode] = useState('')
  const [verificationCooldown, setVerificationCooldown] = useState(0)

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      img_verification_code: '',
      password: ''
    },
    resolver: zodResolver(loginValidator)
  })

  const fetchImgVerificationCode = useCallback(
    async (email: string) => {
      if (verificationCooldown > 0) return

      const emailError = await form.trigger('email')
      if (!emailError) {
        toast.error('请输入正确的邮箱地址')
        return
      }

      try {
        setVerificationCooldown(3)
        const toastId = toast.loading('获取验证码中...')

        const response =
          await verificationService.fetchImgVerificationCode(email)

        if (response.data?.imgBase64) {
          setImgVerificationCode(response.data.imgBase64)
          toast.success('验证码已发送', { id: toastId })
        } else {
          throw new Error('验证码数据无效')
        }
      } catch (error: any) {
        toast.error(error.msg || '获取验证码失败，请重试')
        setVerificationCooldown(0)
      }
    },
    [verificationCooldown, form]
  )

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (verificationCooldown > 0) {
      timer = setTimeout(() => setVerificationCooldown(prev => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [verificationCooldown])

  return (
    <Form {...form}>
      <form className='space-y-5' onSubmit={form.handleSubmit(handleLogin)}>
        <div className='grid gap-4'>
          <FormInput
            control={form.control}
            icon={Mail}
            label='邮箱'
            name='email'
          />
          <FormInput
            control={form.control}
            icon={Lock}
            label='密码'
            name='password'
            type='password'
          />
          <VerificationCodeInput
            control={form.control}
            cooldown={verificationCooldown}
            imgCode={imgVerificationCode}
            label='图形验证码'
            name='img_verification_code'
            onFetchCode={() => {
              const email = form.getValues('email')
              fetchImgVerificationCode(email)
            }}
            type='image'
          />
        </div>

        <Button
          className='w-full h-11 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-full shadow-sm hover:bg-[hsl(var(--foreground)/0.9)] border-0'
          disabled={isLoading}
          type='submit'
        >
          {isLoading ? '登录中...' : '登录'}
        </Button>

        <div className='mt-4 text-center text-sm'>
          <span className='text-muted-foreground'>没有账号？</span>{' '}
          <Button
            className='h-auto p-0 text-sm font-medium text-primary dark:text-primary'
            onClick={onSwitchToRegister}
            type='button'
            variant='link'
          >
            立即注册
          </Button>
        </div>
      </form>
    </Form>
  )
}
