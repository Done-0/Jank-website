'use client'

import {
  ReactNode,
  useContext,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useEffect
} from 'react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@shared/config/site.config'

const SeoContext = createContext<{
  setTitle: (title: string, format?: boolean) => void
}>({ setTitle: () => {} })

export const useSeo = () => useContext(SeoContext)

export function SeoProvider({ children }: { children: ReactNode }) {
  const titleRef = useRef('')
  const formatRef = useRef(true)
  const observerRef = useRef<MutationObserver | null>(null)
  const pathname = usePathname()

  // 应用标题
  const applyTitle = useCallback(() => {
    if (!titleRef.current) return

    const title = formatRef.current
      ? `${titleRef.current} | ${siteConfig.name}`
      : titleRef.current

    if (document.title !== title) document.title = title
  }, [])

  // 设置标题
  const setTitle = useCallback(
    (newTitle: string, format = true) => {
      if (titleRef.current === newTitle && formatRef.current === format) return

      titleRef.current = newTitle
      formatRef.current = format
      applyTitle()
    },
    [applyTitle]
  )

  // 监控标题变化
  useEffect(() => {
    if (typeof window === 'undefined') return

    const titleElement = document.querySelector('title')
    if (titleElement && !observerRef.current) {
      observerRef.current = new MutationObserver(mutations => {
        if (mutations.length > 0 && titleRef.current) {
          requestAnimationFrame(applyTitle)
        }
      })

      // 监控title元素和head元素
      observerRef.current.observe(titleElement, {
        subtree: true,
        characterData: true,
        childList: true
      })

      const headElement = document.querySelector('head')
      if (headElement) {
        observerRef.current.observe(headElement, { childList: true })
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [applyTitle])

  // 路由变化时重新应用标题
  useEffect(() => {
    if (pathname && titleRef.current) {
      applyTitle()

      // 多次应用标题确保覆盖Next.js默认行为
      const applyMultipleTimes = () => {
        for (let i = 0; i < 3; i++) setTimeout(applyTitle, i * 50)
      }

      applyMultipleTimes()
      const delayed = setTimeout(applyMultipleTimes, 200)

      return () => clearTimeout(delayed)
    }
  }, [pathname, applyTitle])

  return (
    <SeoContext.Provider value={useMemo(() => ({ setTitle }), [setTitle])}>
      {children}
    </SeoContext.Provider>
  )
}
