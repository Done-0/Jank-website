'use client'

import { cn } from '@/shared/lib/utils/classname'
import { useEffect } from 'react'

interface LoadingProps {
  /**
   * 是否全屏显示
   */
  fullscreen?: boolean
  /**
   * 自定义宽度
   */
  width?: number
  /**
   * 自定义高度
   */
  height?: number
  /**
   * 自定义CSS类名
   */
  className?: string
  /**
   * 背景色CSS类名
   */
  bgClassName?: string
}

/**
 * 全局加载指示器组件 - 精简高性能版本
 */
export default function Loading({
  fullscreen = false,
  width = 140,
  height = 140,
  className,
  bgClassName = 'bg-background'
}: LoadingProps) {
  useEffect(() => {
    if (!fullscreen) return

    document.documentElement.classList.add('overflow-y-scroll')
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [fullscreen])

  const LoadingSvg = (
    <svg
      width={width}
      height={height}
      viewBox='0 0 240 240'
      xmlns='http://www.w3.org/2000/svg'
      className={cn(className)}
    >
      <defs>
        <linearGradient
          id='primaryGradient'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='100%'
        >
          <stop offset='0%' stopColor='#36F1CD' />
          <stop offset='50%' stopColor='#13C2C2' />
          <stop offset='100%' stopColor='#1677FF' />
        </linearGradient>

        <linearGradient
          id='secondaryGradient'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='0%'
        >
          <stop offset='0%' stopColor='#FF4D4F' />
          <stop offset='100%' stopColor='#F759AB' />
        </linearGradient>
      </defs>

      <rect width='240' height='240' fill='transparent' />

      <g transform='translate(86, 77.5)'>
        <path
          d='M0,0 L55,0 C62,0 68,6 68,13 L68,55 C68,72 55,85 38,85 L0,85 L0,68 L33,68 C40,68 45,63 45,56 L45,22 L0,22 Z'
          fill='url(#primaryGradient)'
        />

        <g>
          <rect
            x='15'
            y='32'
            width='0'
            height='7'
            rx='3.5'
            fill='url(#secondaryGradient)'
          >
            <animate
              attributeName='width'
              values='0;35;35;0'
              keyTimes='0;0.3;0.7;1'
              dur='1.5s'
              repeatCount='indefinite'
            />
          </rect>

          <rect
            x='15'
            y='46'
            width='0'
            height='7'
            rx='3.5'
            fill='url(#secondaryGradient)'
          >
            <animate
              attributeName='width'
              values='0;22;22;0'
              keyTimes='0;0.3;0.7;1'
              dur='1.5s'
              begin='0.3s'
              repeatCount='indefinite'
            />
          </rect>
        </g>
      </g>
    </svg>
  )

  if (fullscreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 flex items-center justify-center z-50',
          bgClassName
        )}
      >
        {LoadingSvg}
      </div>
    )
  }

  return LoadingSvg
}
