'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { cn } from '@shared/lib/utils/classname'
import { siteConfig } from '@shared/config/site.config'
import { useResource, generateMultipleIds } from '@shared/lib/utils/assets'
import {
  SVGContainer,
  SVGGradients,
  SVGPath,
  SVGRect
} from '@shared/lib/utils/assets/svg'

// Logo组件接口
interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Jank Logo SVG组件
const JankLogoSVG = memo(
  ({
    width = 100,
    height = 100,
    className = ''
  }: {
    width?: number
    height?: number
    className?: string
  }) => {
    // 使用静态ID，避免服务器/客户端水合不匹配
    const ids = generateMultipleIds('logo', ['primary', 'secondary'], true)

    // 品牌渐变定义
    const gradients = [
      {
        id: ids.primary,
        type: 'linear' as const,
        stops: [
          { offset: '0%', stopColor: '#36F1CD' },
          { offset: '50%', stopColor: '#13C2C2' },
          { offset: '100%', stopColor: '#1677FF' }
        ],
        attributes: {
          x1: '0%',
          y1: '0%',
          x2: '100%',
          y2: '100%'
        }
      },
      {
        id: ids.secondary,
        type: 'linear' as const,
        stops: [
          { offset: '0%', stopColor: '#FF4D4F' },
          { offset: '100%', stopColor: '#F759AB' }
        ],
        attributes: {
          x1: '0%',
          y1: '0%',
          x2: '100%',
          y2: '0%'
        }
      }
    ]

    return (
      <SVGContainer
        width={width}
        height={height}
        viewBox='0 0 100 100'
        className={className}
        role='img'
        aria-label={`${siteConfig.name} logo`}
      >
        <SVGGradients gradients={gradients} />
        <g transform='translate(16, 7.5)'>
          <SVGPath
            d='M0,0 L55,0 C62,0 68,6 68,13 L68,55 C68,72 55,85 38,85 L0,85 L0,68 L33,68 C40,68 45,63 45,56 L45,22 L0,22 Z'
            fill={`url(#${ids.primary})`}
          />
          <SVGRect
            x={15}
            y={32}
            width={35}
            height={7}
            rx={3.5}
            fill={`url(#${ids.secondary})`}
          />
          <SVGRect
            x={15}
            y={46}
            width={22}
            height={7}
            rx={3.5}
            fill={`url(#${ids.secondary})`}
          />
        </g>
      </SVGContainer>
    )
  }
)
JankLogoSVG.displayName = 'JankLogoSVG'

// Logo组件 - 提供UI封装
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
      <JankLogoSVG
        width={staticLogoDimensions.width}
        height={staticLogoDimensions.height}
        className='object-contain'
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
