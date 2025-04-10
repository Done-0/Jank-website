/**
 * 动画系统预设配置
 */
import { siteConfig } from '@shared/config/site.config'
import { AnimationOptions } from './types'

export const ANIMATION_PRESETS: Record<string, AnimationOptions> = {
  balanced: {
    baseDelayMs: 50,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  },
  fast: {
    baseDelayMs: 10,
    rootMargin: '0px 0px -5% 0px',
    threshold: 0.05
  },
  performance: {
    baseDelayMs: 0,
    rootMargin: '0px',
    threshold: 0.01
  },
  progressive: {
    baseDelayMs: 150,
    rootMargin: '0px 0px -20% 0px',
    threshold: 0.2
  }
}

export function getCurrentAnimationPreset(): AnimationOptions {
  if (!siteConfig?.ui?.animation?.enabled) return ANIMATION_PRESETS.performance

  const preset = siteConfig?.ui?.animation?.preset || 'performance'
  return ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.balanced
}
