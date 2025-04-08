'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

export function NavigationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const path = usePathname()
  const params = useSearchParams()
  const [key, setKey] = useState(0)
  const { theme, systemTheme } = useTheme()

  const state = useRef({
    path: '',
    search: '',
    init: true,
    busy: false,
    lastTime: 0,
    isPopState: false,
    timers: { nav: 0, refresh: 0 }
  }).current

  // 处理导航更新
  const handleNav = useCallback(
    (isPopState = false) => {
      const now = Date.now()

      // 防抖逻辑
      if (!isPopState && state.busy && now - state.lastTime < 250) return

      state.busy = true
      state.lastTime = now
      state.isPopState = isPopState

      // 在导航前保存当前主题状态
      const currentTheme = theme === 'system' ? systemTheme : theme
      if (currentTheme) {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(currentTheme)
      }

      router.refresh()

      if (isPopState) {
        setKey(k => k + 1)
        clearTimeout(state.timers.refresh)
        state.timers.refresh = setTimeout(() => {
          if (state.isPopState) {
            router.refresh()
            state.isPopState = false
          }
        }, 120) as any
      } else {
        clearTimeout(state.timers.nav)
        state.timers.nav = setTimeout(() => {
          state.busy = false
        }, 80) as any
      }
    },
    [router, state, theme, systemTheme]
  )

  // 处理浏览器历史导航
  useEffect(() => {
    const onPopState = () => handleNav(true)
    window.addEventListener('popstate', onPopState, { passive: true })

    return () => {
      window.removeEventListener('popstate', onPopState)
      clearTimeout(state.timers.nav)
      clearTimeout(state.timers.refresh)
    }
  }, [handleNav, state])

  // 处理路由变化
  useEffect(() => {
    const search = params.toString()

    // 初始化
    if (state.init) {
      state.init = false
      state.path = path
      state.search = search
      return
    }

    // 路径发生变化
    if (state.path !== path || state.search !== search) {
      state.path = path
      state.search = search

      if (!state.isPopState) {
        handleNav(false)
      }
    }
  }, [path, params, handleNav, state])

  return (
    <div key={key} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
