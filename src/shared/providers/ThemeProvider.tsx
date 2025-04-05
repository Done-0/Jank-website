'use client'

import { siteConfig } from '@shared/config/site.config'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import React from 'react'

/**
 * 主题提供器组件 - 管理应用的主题状态
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute='class'
      defaultTheme={siteConfig.defaultTheme as 'dark' | 'light' | 'system'}
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </NextThemeProvider>
  )
}
