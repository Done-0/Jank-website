import { Post } from '@/modules/post/types/Post'
import { postService } from '@/modules/post/services/postService'
import { cache } from 'react'

/**
 * 获取文章列表数据 - 用于SEO功能（站点地图、RSS等）
 */
export async function fetchPostsForSeo(options?: {
  limit?: number
}): Promise<Post[]> {
  const { limit = 100 } = options || {}

  try {
    const response = await postService.fetchPostList({
      page: 1,
      pageSize: limit
    })
    return response.code === 0 ? response.data?.posts || [] : []
  } catch (error) {
    console.error('获取文章数据失败:', error)
    return []
  }
}

/**
 * 获取单篇文章数据 - 用于SEO功能 (支持缓存)
 */
export const fetchPostForSeo = cache(
  async (id?: number, title?: string): Promise<Post | null> => {
    if (!id && !title) return null

    try {
      const response = await postService.fetchOnePost({ id, title })
      return response.code === 0 ? response.data || null : null
    } catch (error) {
      console.error('获取文章详情失败:', error)
      return null
    }
  }
)
