'use client'

import { siteConfig } from '@/shared/config/site.config'
import { cn } from '@/shared/lib/utils'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Logo组件 - 显示网站logo
 */
export const Logo = ({
  className,
  showText = true,
  size = 'md'
}: LogoProps) => {
  const { resolvedTheme } = useTheme()
  const [logoSrc, setLogoSrc] = useState('')

  // 根据尺寸确定logo大小
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 }
  }

  useEffect(() => {
    const logoPath =
      resolvedTheme === 'dark'
        ? siteConfig?.ui?.logo?.dark
        : siteConfig?.ui?.logo?.light

    if (logoPath) setLogoSrc(logoPath.replace('/public', ''))
  }, [resolvedTheme])

  return (
    <Link href='/' className={cn('flex items-center gap-2', className)}>
      {logoSrc && (
        <Image
          src={logoSrc}
          alt={`${siteConfig.name} logo`}
          width={dimensions[size].width}
          height={dimensions[size].height}
          className='object-contain'
          priority
        />
      )}

      {showText && (
        <span
          className={cn('font-semibold leading-tight tracking-tight', {
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-xl': size === 'lg'
          })}
        >
          {siteConfig.name}
        </span>
      )}
    </Link>
  )
}
