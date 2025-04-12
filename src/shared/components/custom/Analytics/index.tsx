'use client'

import Script from 'next/script'
import { useEffect, useCallback, useRef } from 'react'
import { analyticsConfig } from '@shared/config/analytics.config'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export function GoogleAnalytics() {
  const trackedThresholds = useRef<Set<number>>(new Set())

  const handleScroll = useCallback(() => {
    if (
      typeof window === 'undefined' ||
      !analyticsConfig.defaultEvents.scrollDepth?.enabled
    )
      return

    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) /
        document.documentElement.scrollHeight) *
        100
    )

    analyticsConfig.defaultEvents.scrollDepth.thresholds.forEach(threshold => {
      if (
        scrollPercent >= threshold &&
        !trackedThresholds.current.has(threshold)
      ) {
        trackedThresholds.current.add(threshold)
        window.gtag?.('event', 'scroll_depth', {
          value: threshold,
          percent_scrolled: scrollPercent
        })
      }
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 初始化 Google Analytics
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', analyticsConfig.measurementId, {
      debug_mode: analyticsConfig.debug
    })

    // 设置自定义维度和指标
    if (analyticsConfig.customDimensions) {
      Object.entries(analyticsConfig.customDimensions).forEach(
        ([key, value]) => {
          window.gtag('set', value, key)
        }
      )
    }

    // 启用滚动跟踪
    if (analyticsConfig.defaultEvents.scrollDepth?.enabled) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.measurementId}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsConfig.measurementId}', {
            debug_mode: ${analyticsConfig.debug}
          });
        `}
      </Script>
    </>
  )
}
