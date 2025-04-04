'use client'

import { seoConfig } from '@/shared/config/seo.config'
import { siteConfig } from '@/shared/config/site.config'
import {
  buildUrl,
  formatKeywords,
  getOgImage,
  OptimizedResources,
  SeoProps
} from '@/shared/lib/seo'
import Head from 'next/head'
import React from 'react'

/**
 * Pages Router SEO组件
 */
export const PageSeoHead = React.memo((props: SeoProps) => {
  const config =
    props.overrideConfig && Object.keys(props.overrideConfig).length > 0
      ? { ...seoConfig, ...props.overrideConfig }
      : seoConfig

  // 处理标题
  const title = !props.title
    ? siteConfig.name
    : `${props.title} | ${siteConfig.name}`
  const description = props.description || config.description
  const url = props.canonicalUrl
    ? buildUrl(props.canonicalUrl, config)
    : config.canonicalUrlPrefix || ''
  const image = getOgImage(props.ogImage)
  const keywords = props.keywords || seoConfig.keywords

  return (
    <Head>
      <title>{title}</title>
      <meta content={description} name='description' />
      <meta content={formatKeywords(keywords)} name='keywords' />
      <link href={url} rel='canonical' />
      {props.noIndex && <meta content='noindex, nofollow' name='robots' />}

      <meta content={siteConfig.name} name='application-name' />
      <meta content={config.author} name='author' />
      <meta content='#ffffff' name='theme-color' />

      {/* OpenGraph */}
      <meta content={title} property='og:title' />
      <meta content={description} property='og:description' />
      <meta content={url} property='og:url' />
      <meta content={image} property='og:image' />
      <meta content='website' property='og:type' />
      <meta content={siteConfig.name} property='og:site_name' />

      {/* 网站图标 */}
      {config.additionalLinkTags?.map((link, index) => (
        <link
          key={`${link.rel}-${index}`}
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
    </Head>
  )
})

PageSeoHead.displayName = 'PageSeoHead'

// 导出别名
export type PageSeoProps = SeoProps
export const SEOHeader = PageSeoHead
export const ResourceHints = OptimizedResources
