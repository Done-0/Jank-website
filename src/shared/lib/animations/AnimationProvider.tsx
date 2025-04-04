/**
 * 动画系统Provider组件
 *
 * 在React应用的顶层提供动画配置和初始化
 */
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { initAnimationSystem } from './animationCore'
import { ANIMATION_PRESETS } from './animationPresets'
import { AnimationOptions } from './animationTypes'

// 定义Provider接受的参数
export interface AnimationProviderProps {
  children: React.ReactNode
  disabled?: boolean
  mode?: 'balanced' | 'fast' | 'performance' | 'progressive' | 'quality'
  options?: AnimationOptions
}

// 创建上下文
type AnimationContextType = {
  options: AnimationOptions
}

const AnimationContext = createContext<AnimationContextType>({
  options: ANIMATION_PRESETS.balanced
})

/**
 * 使用动画上下文的hook
 *
 * @returns 动画系统配置选项
 */
export const useAnimationContext = () => useContext(AnimationContext)

/**
 * 动画系统Provider组件
 * 在应用顶层提供动画配置，并初始化动画系统
 *
 * @param props - Provider组件参数
 * @returns Provider包装的React节点
 */
export function AnimationProvider({
  children,
  disabled = false,
  mode = 'balanced',
  options = {}
}: AnimationProviderProps) {
  const initializedRef = useRef(false)
  const [mounted, setMounted] = useState(false)

  // 合并预设和自定义选项，使用useMemo防止每次渲染都创建新对象
  const presetOptions = ANIMATION_PRESETS[mode] || ANIMATION_PRESETS.balanced
  const mergedOptions = useMemo(
    () => ({
      ...presetOptions,
      ...options,
      disabled
    }),
    [presetOptions, options, disabled]
  )

  const toggleAnimations = (enable: boolean) => {
    if (typeof document !== 'undefined') {
      document.body.classList[enable ? 'remove' : 'add']('reduce-motion')
    }
  }

  // 初始化动画系统
  useEffect(() => {
    if (!mounted) return

    const cleanup = initAnimationSystem(mergedOptions)

    // 页面加载后添加类以启用动画（防止布局偏移）
    if (typeof document !== 'undefined') {
      requestAnimationFrame(() => {
        document.documentElement.classList.add('is-page-loaded')
      })
    }

    return () => {
      cleanup()
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('is-page-loaded')
      }
    }
  }, [mergedOptions, mounted])

  // 检测用户偏好
  useEffect(() => {
    if (typeof window === 'undefined' || initializedRef.current) return

    initializedRef.current = true
    setMounted(true)

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isLowEndDevice =
      !window.matchMedia('(min-width: 768px)').matches ||
      navigator.hardwareConcurrency <= 4 ||
      !!navigator.userAgent.match(/android|mobile/i)

    // 根据条件禁用动画
    if (prefersReducedMotion || isLowEndDevice || disabled) {
      toggleAnimations(false)
    }

    // 监听偏好变化
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      toggleAnimations(!(e.matches || disabled || isLowEndDevice))
    }

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
    } else {
      // @ts-ignore - 兼容旧版浏览器
      reducedMotionQuery.addListener(handleReducedMotionChange)
    }

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener(
          'change',
          handleReducedMotionChange
        )
      } else {
        // @ts-ignore - 兼容旧版浏览器
        reducedMotionQuery.removeListener(handleReducedMotionChange)
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('animation-cleanup'))
      }
    }
  }, [disabled])

  // 响应禁用状态变化
  useEffect(() => {
    if (!initializedRef.current) return
    toggleAnimations(!disabled)
  }, [disabled])

  // 避免客户端渲染时的闪烁
  if (!mounted) {
    return <>{children}</>
  }

  // 提供上下文值
  return (
    <AnimationContext.Provider value={{ options: mergedOptions }}>
      {children}
    </AnimationContext.Provider>
  )
}
