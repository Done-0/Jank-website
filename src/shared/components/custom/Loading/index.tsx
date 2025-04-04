'use client'

import { cn } from '@/shared/lib/utils/classname'
import { useEffect } from 'react'

interface LoadingProps {
  fullscreen?: boolean
  width?: number
  height?: number
  className?: string
  bgClassName?: string
}

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
      document.documentElement.classList.remove('overflow-y-scroll')
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

      <g transform='translate(86, 77.5)'>
        <path
          d='M0,0 L55,0 C62,0 68,6 68,13 L68,55 C68,72 55,85 38,85 L0,85 L0,68 L33,68 C40,68 45,63 45,56 L45,22 L0,22 Z'
          fill='url(#primaryGradient)'
        />
        <rect
          x='15'
          y='32'
          width='0'
          height='9'
          rx='4.5'
          fill='url(#secondaryGradient)'
        >
          <animate
            attributeName='width'
            values='0;30;30;0'
            keyTimes='0;0.2;0.4;1'
            dur='0.08s'
            repeatCount='indefinite'
          />
        </rect>
        <rect
          x='15'
          y='46'
          width='0'
          height='9'
          rx='4.5'
          fill='url(#secondaryGradient)'
        >
          <animate
            attributeName='width'
            values='0;28;28;0'
            keyTimes='0;0.2;0.4;1'
            dur='0.08s'
            repeatCount='indefinite'
          />
        </rect>
      </g>
    </svg>
  )

  if (fullscreen) {
    return (
      <div
        className={cn(
          'fixed top-0 left-0 w-full h-screen flex items-center justify-center z-[9999]',
          bgClassName
        )}
      >
        {LoadingSvg}
      </div>
    )
  }

  return LoadingSvg
}
