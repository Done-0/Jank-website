import { seoConfig } from '@/shared/config/seo.config'
import React from 'react'

/**
 * 资源优化组件
 */
export const OptimizedResources = React.memo(() => (
  <>
    {/* DNS预解析和预连接 */}
    {seoConfig.performance?.dnsPreconnect?.map((domain, i) => (
      <link href={domain} key={`dns-${i}`} rel='dns-prefetch' />
    ))}
    {seoConfig.performance?.preconnectOrigins?.map((domain, i) => (
      <link
        crossOrigin='anonymous'
        href={domain}
        key={`preconnect-${i}`}
        rel='preconnect'
      />
    ))}

    {/* 预加载资源 */}
    {seoConfig.performance?.preloadAssets?.map((asset, i) => (
      <link
        as={asset.as}
        crossOrigin='anonymous'
        href={asset.href}
        key={`preload-${i}`}
        rel='preload'
        type={asset.type}
      />
    ))}

    {/* 网站图标 */}
    {seoConfig.additionalLinkTags?.map((link, i) => (
      <link
        key={`link-${i}`}
        rel={link.rel}
        href={link.href}
        type={link.type}
        sizes={link.sizes}
        media={link.media}
        as={link.as}
        crossOrigin={
          link.crossOrigin as 'anonymous' | 'use-credentials' | '' | undefined
        }
      />
    ))}
  </>
))

OptimizedResources.displayName = 'OptimizedResources'
