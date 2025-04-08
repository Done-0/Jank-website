import { useCallback } from 'react'
import {
    sendEvent,
    sendPageView,
    sendError,
    sendConversion,
    createPageViewParams,
    createErrorParams,
    createConversionParams
} from '@shared/lib/analytics'

/**
 * Google Analytics Hook
 * 提供使用 Google Analytics 功能的便捷方法
 */
export function useAnalytics() {
    const trackPageView = useCallback((path: string, title: string) => {
        sendPageView(createPageViewParams(path, title))
    }, [])

    const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
        sendEvent(eventName, params)
    }, [])

    const trackError = useCallback((message: string, source: string) => {
        sendError(createErrorParams(message, source))
    }, [])

    const trackConversion = useCallback((conversionId: string, params?: Record<string, any>) => {
        sendConversion(createConversionParams(conversionId, params))
    }, [])

    return {
        trackPageView,
        trackEvent,
        trackError,
        trackConversion
    }
} 