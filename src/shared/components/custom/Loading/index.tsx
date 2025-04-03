'use client'

import { cn } from '@/shared/lib/utils/classname'
import { useEffect, useState } from 'react'

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
 * 全局加载指示器组件
 */
export default function Loading({
  fullscreen = false,
  width = 70,
  height = 70,
  className,
  bgClassName = 'bg-background'
}: LoadingProps) {
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    setVisible(true)
    return () => setVisible(false)
  }, [])

  const LoadingSvg = (
    <svg
      width={width}
      height={height}
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('text-primary', className)}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      <circle
        fill='none'
        stroke='currentColor'
        strokeWidth='6'
        strokeMiterlimit='15'
        strokeDasharray='14.2472,14.2472'
        cx='50'
        cy='50'
        r='47'
      >
        <animateTransform
          attributeName='transform'
          attributeType='XML'
          type='rotate'
          dur='5s'
          from='0 50 50'
          to='360 50 50'
          repeatCount='indefinite'
        />
      </circle>
      <circle
        fill='none'
        stroke='currentColor'
        strokeWidth='1'
        strokeMiterlimit='10'
        strokeDasharray='10,10'
        cx='50'
        cy='50'
        r='39'
      >
        <animateTransform
          attributeName='transform'
          attributeType='XML'
          type='rotate'
          dur='5s'
          from='0 50 50'
          to='-360 50 50'
          repeatCount='indefinite'
        />
      </circle>
      <g fill='currentColor'>
        {[0.1, 0.2, 0.3, 0.4, 0.5].map((begin, i) => (
          <rect key={i} x={30 + i * 10} y='35' width='5' height='30'>
            <animateTransform
              attributeName='transform'
              dur='1s'
              type='translate'
              values='0 5 ; 0 -5; 0 5'
              repeatCount='indefinite'
              begin={begin}
            />
          </rect>
        ))}
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
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        {LoadingSvg}
      </div>
    )
  }

  return LoadingSvg
}
