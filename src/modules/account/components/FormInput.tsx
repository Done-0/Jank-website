'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/shadcn/form'
import { Input } from '@/shared/components/ui/shadcn/input'
import { LucideIcon } from 'lucide-react'
import { Control } from 'react-hook-form'

interface FormInputProps {
  control: Control<any>
  icon: LucideIcon
  label: string
  name: string
  optional?: boolean
  placeholder?: string
  type?: string
}

export function FormInput({
  control,
  icon: Icon,
  label,
  name,
  optional = false,
  placeholder,
  type = 'text'
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs sm:text-sm font-medium text-muted-foreground'>
            {label}
            {optional && (
              <span className='ml-1 text-muted-foreground/70 text-xs'>
                (选填)
              </span>
            )}
          </FormLabel>
          <FormControl>
            <div className='relative'>
              <Icon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70' />
              <Input
                className='pl-10 h-11 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring text-sm placeholder:text-muted-foreground/60 placeholder:text-sm'
                placeholder={placeholder || `请输入${label}`}
                type={type}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage className='text-xs sm:text-sm' />
        </FormItem>
      )}
    />
  )
}
