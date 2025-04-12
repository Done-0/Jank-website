'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@shared/lib/utils/classname'
import { siteConfig } from '@shared/config/site.config'
import { useResource } from '@shared/lib/utils/assets'

// Logo组件接口
interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Logo组件 - 使用外部SVG文件
const Logo = memo(({ className, showText = true, size = 'md' }: LogoProps) => {
  // 根据尺寸确定logo大小
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 }
  }

  const staticLogoDimensions = useResource(
    `logo-dimensions-${size}`,
    () => dimensions[size]
  )

  return (
    <Link
      href='/'
      className={cn('flex items-center gap-2', className)}
      aria-label={`${siteConfig.name} 首页`}
    >
      <Image
        src='/images/jank.svg'
        width={staticLogoDimensions.width}
        height={staticLogoDimensions.height}
        alt={`${siteConfig.name} logo`}
        className='object-contain'
        priority
      />

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
})
Logo.displayName = 'Logo'

export default Logo
export { Logo }
