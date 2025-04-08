'use client'

import { siteConfig } from '@shared/config/site.config'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import React from 'react'

// 防止主题切换闪烁的脚本组件
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || '${siteConfig.defaultTheme}';
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              document.documentElement.classList.add(theme === 'system' ? systemTheme : theme);
            } catch (e) {}
          })();
        `
      }}
    />
  )
}

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
      <ThemeScript />
      {children}
    </NextThemeProvider>
  )
}
