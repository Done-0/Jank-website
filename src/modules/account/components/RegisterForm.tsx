'use client'

import { fetchVerificationCode } from '@/modules/verification/services/verification'
import { Button } from '@/shared/components/ui/shadcn/button'
import { Form } from '@/shared/components/ui/shadcn/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, User } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { VerificationCodeInput } from '../../verification/components/VerificationCodeInput'
import { useAuth } from '../hooks/useAuth'
import {
  type RegisterFormValues,
  registerValidator
} from '../validators/form-validators'
import { FormInput } from './FormInput'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { handleRegister, isLoading } = useAuth()
  const [imgVerificationCode, setImgVerificationCode] = useState('')
  const [verificationCooldown, setVerificationCooldown] = useState(0)

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      again_password: '',
      email: '',
      email_verification_code: '',
      img_verification_code: '',
      nickname: '',
      password: ''
    },
    resolver: zodResolver(registerValidator)
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
        const response = await fetchVerificationCode(email)
        setImgVerificationCode(response.data.imgBase64)
        setVerificationCooldown(3)
      } catch (error) {
        console.error('获取图形验证码失败', error)
        toast.error('获取验证码失败，请重试')
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

  const handleSendEmailCode = useCallback(async () => {
    const emailError = await form.trigger('email')
    if (!emailError) {
      toast.error('请输入正确的邮箱地址')
      return
    }

    try {
      toast.success('验证码已发送，请查收邮件')
    } catch (error) {
      console.error('发送验证码失败', error)
      toast.error('发送验证码失败，请重试')
    }
  }, [form])

  return (
    <Form {...form}>
      <form className='space-y-5' onSubmit={form.handleSubmit(handleRegister)}>
        <div className='grid gap-4'>
          <FormInput
            control={form.control}
            icon={Mail}
            label='邮箱'
            name='email'
          />
          <FormInput
            control={form.control}
            icon={User}
            label='昵称'
            name='nickname'
          />
          <FormInput
            control={form.control}
            icon={Lock}
            label='密码'
            name='password'
            type='password'
          />
          <FormInput
            control={form.control}
            icon={Lock}
            label='确认密码'
            name='again_password'
            type='password'
          />
          <VerificationCodeInput
            control={form.control}
            label='邮箱验证码'
            name='email_verification_code'
            onSendCode={handleSendEmailCode}
            type='email'
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
          {isLoading ? '注册中...' : '注册'}
        </Button>

        <div className='mt-4 text-center text-sm'>
          <span className='text-muted-foreground'>已有账号？</span>{' '}
          <Button
            className='h-auto p-0 text-sm font-medium text-primary dark:text-primary'
            onClick={onSwitchToLogin}
            type='button'
            variant='link'
          >
            立即登录
          </Button>
        </div>
      </form>
    </Form>
  )
}
