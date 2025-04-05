'use client'

import React, { memo, useEffect } from 'react'
import { cn } from '@shared/lib/utils/classname'
import { generateMultipleIds } from '@shared/lib/utils/assets'
import {
  SVGContainer,
  SVGGradients,
  SVGPath,
  SVGRect
} from '@shared/lib/utils/assets/svg'

// Loading组件接口
interface LoadingProps {
  fullscreen?: boolean
  width?: number
  height?: number
  className?: string
  bgClassName?: string
  allowScroll?: boolean
}

// Loading动画SVG组件
const LoadingSVG = memo(
  ({
    width = 140,
    height = 140,
    className
  }: {
    width?: number
    height?: number
    className?: string
  }) => {
    // 使用静态ID，避免服务器/客户端水合不匹配
    const ids = generateMultipleIds('loading', ['primary', 'secondary'], true)

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
        viewBox='0 0 240 240'
        className={className}
      >
        <SVGGradients gradients={gradients} />
        <g transform='translate(86, 77.5)'>
          <SVGPath
            d='M0,0 L55,0 C62,0 68,6 68,13 L68,55 C68,72 55,85 38,85 L0,85 L0,68 L33,68 C40,68 45,63 45,56 L45,22 L0,22 Z'
            fill={`url(#${ids.primary})`}
          />
          {/* 带动画的矩形 */}
          <SVGRect
            x={15}
            y={32}
            width={0}
            height={9}
            rx={4.5}
            fill={`url(#${ids.secondary})`}
          >
            <animate
              attributeName='width'
              values='0;30;30;0'
              keyTimes='0;0.2;0.4;1'
              dur='0.08s'
              repeatCount='indefinite'
            />
          </SVGRect>
          <SVGRect
            x={15}
            y={46}
            width={0}
            height={9}
            rx={4.5}
            fill={`url(#${ids.secondary})`}
          >
            <animate
              attributeName='width'
              values='0;28;28;0'
              keyTimes='0;0.2;0.4;1'
              dur='0.08s'
              repeatCount='indefinite'
            />
          </SVGRect>
        </g>
      </SVGContainer>
    )
  }
)
LoadingSVG.displayName = 'LoadingSVG'

// Loading组件 - 提供UI封装
const Loading = memo(
  ({
    fullscreen = false,
    width = 140,
    height = 140,
    className,
    bgClassName = 'bg-background',
    allowScroll = false
  }: LoadingProps) => {
    useEffect(() => {
      if (!fullscreen || allowScroll) return

      document.documentElement.classList.add('overflow-y-scroll')
      document.body.style.overflow = 'hidden'

      return () => {
        document.documentElement.classList.remove('overflow-y-scroll')
        document.body.style.overflow = ''
      }
    }, [fullscreen, allowScroll])

    // 全屏加载
    if (fullscreen) {
      const positionClass = allowScroll
        ? 'absolute inset-0 z-50 flex items-center justify-center min-h-screen'
        : 'fixed inset-0 z-50 flex items-center justify-center'

      return (
        <div className={cn(positionClass, bgClassName)}>
          <LoadingSVG width={width} height={height} className={className} />
        </div>
      )
    }

    // 内联加载
    return <LoadingSVG width={width} height={height} className={className} />
  }
)
Loading.displayName = 'Loading'

export default Loading
