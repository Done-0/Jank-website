/**
 * Animate组件
 *
 * 提供React组件封装的滚动动画效果
 * 当元素进入视口时自动应用动画
 */
import React, { useEffect, useRef } from 'react'

import { useAnimationSystem } from './hooks'
import { AnimationOptions } from './types'

export interface AnimateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: React.ReactNode

  /**
   * 自定义元素类名
   */
  className?: string

  /**
   * 动画延迟(毫秒)
   */
  delay?: number

  /**
   * 是否禁用动画
   */
  disabled?: boolean

  /**
   * 动画触发的视口偏移量
   */
  rootMargin?: string

  /**
   * 元素可见比例阈值
   */
  threshold?: number
}

/**
 * Animate组件
 *
 * 将子元素包装在可动画的容器中
 * 当组件进入视口时自动应用动画效果
 */
export function Animate({
  children,
  className = '',
  delay = 0,
  disabled = false,
  rootMargin,
  threshold,
  ...props
}: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null)

  // 配置动画系统选项
  const options: AnimationOptions = {
    baseDelayMs: delay,
    disabled,
    rootMargin,
    threshold
  }

  const { animateElement } = useAnimationSystem(options)

  // 监控元素可见性
  useEffect(() => {
    if (ref.current && !disabled) {
      // 添加动画标记
      ref.current.setAttribute('data-animate', 'true')

      // 手动触发动画
      if (ref.current.getBoundingClientRect().top < window.innerHeight) {
        animateElement(ref.current)
      }
    }
  }, [animateElement, disabled])

  // 构建类名，添加scroll-animate标记
  const finalClassName = `scroll-animate ${className}`.trim()

  return (
    <div className={finalClassName} ref={ref} {...props}>
      {children}
    </div>
  )
}
