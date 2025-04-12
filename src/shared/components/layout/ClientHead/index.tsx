'use client'

import { useMemo } from 'react'
import {
  getSiteStructuredData,
  generatePostStructuredData
} from '@shared/lib/seo'
import { Post } from '@/modules/post/types/Post'

const { organization: ORG_DATA, website: WEBSITE_DATA } =
  getSiteStructuredData()
const ORG_JSON = JSON.stringify(ORG_DATA)
const WEBSITE_JSON = JSON.stringify(WEBSITE_DATA)

/**
 * 结构化数据组件 - 应用于所有页面
 */
const StructuredData = () => (
  <>
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: WEBSITE_JSON }}
    />
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: ORG_JSON }}
    />
  </>
)

/**
 * 文章结构化数据组件
 */
const PostStructuredData = ({ post }: { post: Post }) => {
  const postJson = useMemo(() => {
    const postData = generatePostStructuredData(post)
    return JSON.stringify(postData)
  }, [post])

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: postJson }}
    />
  )
}

/**
 * 客户端头部组件 - 仅处理结构化数据和需要客户端动态处理的内容
 * 所有静态元数据通过Next.js的metadata API处理
 */
const ClientHead = ({ post }: { post?: Post }) => (
  <>
    {/* 结构化数据 */}
    {post ? <PostStructuredData post={post} /> : <StructuredData />}
  </>
)

export default ClientHead
