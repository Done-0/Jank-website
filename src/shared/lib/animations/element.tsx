'use client'

import React, { forwardRef, HTMLAttributes, memo, ReactNode } from 'react'

import { ANIMATION_PRESETS } from './presets'

interface AnimateProps extends HTMLAttributes<HTMLDivElement> {
  animation?: 'custom' | 'fade' | 'scale' | 'slide'
  as?: React.ElementType
  children: ReactNode
  className?: string
  delay?: 100 | 200 | 300 | 400 | 500 | number
  disabled?: boolean
  once?: boolean
  preset?: keyof typeof ANIMATION_PRESETS
  rootMargin?: string
  threshold?: number
}

/**
 * 自动应用滚动触发动画效果
 * 与全局AnimationProvider协同工作
 * @example
 * <Animate delay={200} preset="fast">
 *   <div>This content will animate in when scrolled into view</div>
 * </Animate>
 */
export const Animate = memo(
  forwardRef<HTMLDivElement, AnimateProps>(
    (
      {
        animation = 'fade',
        as = 'div',
        children,
        className = '',
        delay,
        disabled = false,
        ...props
      },
      ref
    ) => {
      const Component = as

      if (disabled) {
        return (
          <Component className={className} ref={ref} {...props}>
            {children}
          </Component>
        )
      }

      const delayClass =
        typeof delay === 'number'
          ? [100, 200, 300, 400, 500].includes(delay)
            ? ` delay-${delay}`
            : delay <= 50
              ? ' delay-anim-1'
              : delay <= 100
                ? ' delay-anim-2'
                : delay <= 200
                  ? ' delay-anim-3'
                  : delay <= 300
                    ? ' delay-anim-4'
                    : ' delay-anim-5'
          : ''

      return (
        <Component
          className={`scroll-animate${delayClass} ${className}`}
          data-animation={animation}
          ref={ref}
          {...props}
        >
          {children}
        </Component>
      )
    }
  )
)

Animate.displayName = 'Animate'

export default Animate
