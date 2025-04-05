'use client'

import { AnimationProvider } from '@/shared/providers/AnimationProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { NavigationProvider } from '@/shared/providers/NavigationProvider'
import {
  ResourceProvider,
  ResourceMonitor
} from '@/shared/providers/ResourceProvider'

/**
 * 全局提供器组件 - 集中管理应用的上下文提供器
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ResourceProvider>
      <ResourceMonitor>
        <ThemeProvider>
          <NavigationProvider>
            <AnimationProvider>{children}</AnimationProvider>
          </NavigationProvider>
        </ThemeProvider>
      </ResourceMonitor>
    </ResourceProvider>
  )
}
