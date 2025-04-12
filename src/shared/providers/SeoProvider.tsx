'use client'

import {
  ReactNode,
  useContext,
  createContext,
  useCallback,
  useMemo
} from 'react'
import { siteConfig } from '@shared/config/site.config'

// SEO上下文及Hook
const SeoContext = createContext<{
  setTitle: (title: string, format?: boolean) => void
}>({
  setTitle: () => {}
})
export const useSeo = () => useContext(SeoContext)

// SEO提供器
export function SeoProvider({ children }: { children: ReactNode }) {
  const setTitle = useCallback((newTitle: string, format = true) => {
    if (!newTitle) return
    document.title = format ? `${newTitle} | ${siteConfig.name}` : newTitle
  }, [])

  const value = useMemo(() => ({ setTitle }), [setTitle])

  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>
}
