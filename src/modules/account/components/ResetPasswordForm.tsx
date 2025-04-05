'use client'

import { sendVerificationCode } from '@/modules/verification/services/verification'
import { Button } from '@shared/components/ui/shadcn/button'
import { Form } from '@shared/components/ui/shadcn/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { VerificationCodeInput } from '../../verification/components/VerificationCodeInput'
import {
  type ResetPasswordFormValues,
  resetPasswordValidator
} from '../validators/form-validators'
import { FormInput } from './FormInput'

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormValues) => Promise<void>
  onSwitchToLogin: () => void
}

export function ResetPasswordForm({
  onSubmit,
  onSwitchToLogin
}: ResetPasswordFormProps) {
  const [countdown, setCountdown] = useState(0)
  const [emailCodeSending, setEmailCodeSending] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      again_new_password: '',
      email: '',
      email_verification_code: '',
      new_password: ''
    },
    resolver: zodResolver(resetPasswordValidator)
  })

  // 发送邮箱验证码
  const handleSendEmailCode = useCallback(
    async (email: string) => {
      if (!email || emailCodeSending || countdown > 0) return

      setEmailCodeSending(true)
      try {
        await sendVerificationCode(email)
        setCountdown(60)
        alert('验证码已发送，请查收邮箱')
      } catch (error) {
        console.error('发送邮箱验证码失败', error)
        alert('发送验证码失败，请稍后重试')
      } finally {
        setEmailCodeSending(false)
      }
    },
    [emailCodeSending, countdown]
  )

  // 倒计时处理
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
            label='新密码'
            name='new_password'
            type='password'
          />
          <FormInput
            control={form.control}
            icon={Lock}
            label='确认新密码'
            name='again_new_password'
            type='password'
          />
          <VerificationCodeInput
            control={form.control}
            countdown={countdown}
            isSending={emailCodeSending}
            label='邮箱验证码'
            name='email_verification_code'
            onSendCode={() => handleSendEmailCode(form.getValues('email'))}
            type='email'
          />
        </div>

        <Button className='w-full' type='submit'>
          重置密码
        </Button>

        <div className='mt-4 text-center text-sm text-muted-foreground'>
          记起密码了？{' '}
          <Button
            className='h-auto p-0 text-sm font-medium'
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
