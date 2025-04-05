'use client'

import { AnimationProvider as LibAnimationProvider } from '@shared/lib/animations'
import React from 'react'

/**
 * 动画提供器组件 - 管理应用的动画系统
 */
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  return <LibAnimationProvider>{children}</LibAnimationProvider>
}
