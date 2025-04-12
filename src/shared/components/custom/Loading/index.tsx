'use client'

import React, { memo, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@shared/lib/utils/classname'

// Loading组件接口
interface LoadingProps {
  fullscreen?: boolean
  width?: number
  height?: number
  className?: string
  bgClassName?: string
  allowScroll?: boolean
}

// Loading组件 - 使用外部SVG文件
const Loading = memo(
  ({
    fullscreen = false,
    width = 60,
    height = 60,
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

    // 加载图标组件
    const LoadingIcon = () => (
      <div className={className}>
        <Image
          src='/images/loading.svg'
          width={width}
          height={height}
          alt='Loading...'
          className='object-contain'
          priority
        />
      </div>
    )

    // 全屏加载
    if (fullscreen) {
      const positionClass = allowScroll
        ? 'absolute inset-0 z-50 flex items-center justify-center min-h-screen'
        : 'fixed inset-0 z-50 flex items-center justify-center'

      return (
        <div className={cn(positionClass, bgClassName)}>
          <LoadingIcon />
        </div>
      )
    }

    // 内联加载
    return <LoadingIcon />
  }
)
Loading.displayName = 'Loading'

export default Loading
