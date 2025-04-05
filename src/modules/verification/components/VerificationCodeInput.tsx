'use client'

import { Button } from '@shared/components/ui/shadcn/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@shared/components/ui/shadcn/form'
import { Input } from '@shared/components/ui/shadcn/input'
import { Key, Shield } from 'lucide-react'
import Image from 'next/image'
import { Control } from 'react-hook-form'

interface VerificationCodeInputProps {
  control: Control<any>
  cooldown?: number
  countdown?: number
  imgCode?: string
  isSending?: boolean
  label: string
  name: string
  onFetchCode?: () => void
  onSendCode?: () => void
  type: 'email' | 'image'
}

export function VerificationCodeInput({
  control,
  cooldown = 0,
  countdown = 0,
  imgCode,
  isSending = false,
  label,
  name,
  onFetchCode,
  onSendCode,
  type
}: VerificationCodeInputProps) {
  const Icon = type === 'image' ? Shield : Key

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs sm:text-sm font-medium text-muted-foreground'>
            {label}
          </FormLabel>
          <div className='flex gap-1 sm:gap-2'>
            <FormControl>
              <div className='relative flex-1'>
                <Icon className='absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground/70' />
                <Input
                  className='pl-7 sm:pl-10 text-sm sm:text-base h-9 sm:h-11 placeholder:text-muted-foreground/60 placeholder:text-xs sm:placeholder:text-sm'
                  placeholder={`请输入${type === 'image' ? '图形' : '邮箱'}验证码`}
                  {...field}
                />
              </div>
            </FormControl>
            {type === 'image' ? (
              <div
                className='w-24 sm:w-28 h-9 sm:h-11 overflow-hidden flex-shrink-0 cursor-pointer'
                onClick={onFetchCode}
              >
                {imgCode ? (
                  <Image
                    alt='验证码'
                    className='w-full h-full object-cover'
                    height={44}
                    src={imgCode}
                    width={112}
                    priority={true}
                    quality={90}
                  />
                ) : (
                  <Button
                    className='w-full h-full text-xs sm:text-sm text-muted-foreground/80'
                    disabled={cooldown > 0}
                    type='button'
                    variant='outline'
                  >
                    {cooldown > 0 ? `${cooldown}s` : '获取验证码'}
                  </Button>
                )}
              </div>
            ) : (
              <Button
                className='w-24 sm:w-28 h-9 sm:h-11 flex-shrink-0 text-xs sm:text-sm px-1 sm:px-2 text-muted-foreground/80'
                disabled={isSending || countdown > 0}
                onClick={onSendCode}
                type='button'
                variant='outline'
              >
                {countdown > 0 ? `${countdown}s` : '发送验证码'}
              </Button>
            )}
          </div>
          <FormMessage className='text-xs sm:text-sm' />
        </FormItem>
      )}
    />
  )
}
