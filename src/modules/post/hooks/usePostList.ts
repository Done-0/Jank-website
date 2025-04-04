'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { getPostListAction } from '../actions/postActions'
import { usePostStore } from '../store/postStore'
import { toast } from 'sonner'
import { Post } from '../types/Post'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

// 短暂缓存防止重复请求
const requestCache = { key: '', timestamp: 0 }

/**
 * 文章列表管理钩子
 * 专注于列表数据获取、分页控制和数据格式转换
 */
export function usePostList(defaultItemsPerPage = 5) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initialPage = Number(searchParams.get('page') || 1)

  // 状态管理
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { postList, setPostList } = usePostStore()

  // 请求控制
  const isMounted = useRef(false)
  const isLoading_ref = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 更新URL参数
  const updateUrlParams = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      page === 1 ? params.delete('page') : params.set('page', page.toString())
      router.push(
        `${pathname}${params.toString() ? '?' + params.toString() : ''}`,
        { scroll: false }
      )
    },
    [pathname, router, searchParams]
  )

  // 获取文章列表
  const fetchData = useCallback(
    async (page: number, forceRefresh = false) => {
      if (isLoading_ref.current || page < 1) return

      // 短暂缓存检查 (只缓存500ms，允许数据更新)
      const cacheKey = `${page}-${defaultItemsPerPage}`
      if (
        !forceRefresh &&
        cacheKey === requestCache.key &&
        Date.now() - requestCache.timestamp < 500
      ) {
        return
      }

      isLoading_ref.current = true
      setIsLoading(true)
      setError(null)

      try {
        const response = await getPostListAction(page, defaultItemsPerPage)

        if (response.code === 0) {
          const {
            posts,
            totalPages: pages,
            currentPage: responsePage
          } = response.data
          setPostList(posts)
          setTotalPages(Math.max(1, pages || 1))

          requestCache.key = cacheKey
          requestCache.timestamp = Date.now()

          if (responsePage && responsePage !== page) {
            setCurrentPage(responsePage)
            updateUrlParams(responsePage)
          }
        } else {
          setError(response.msg || '获取数据失败')
          toast.error(response.msg || '获取数据失败')
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '获取数据失败'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setIsLoading(false)
        isLoading_ref.current = false
      }
    },
    [defaultItemsPerPage, setPostList, updateUrlParams]
  )

  // 防抖处理
  const debouncedFetch = useCallback(
    (page: number, forceRefresh = false) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => fetchData(page, forceRefresh), 50)
    },
    [fetchData]
  )

  // 页面切换
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setCurrentPage(page)
      updateUrlParams(page)
    },
    [currentPage, totalPages, updateUrlParams]
  )

  // 组合useEffect
  useEffect(() => {
    const pageParam = Number(searchParams.get('page') || 1)
    if (pageParam !== currentPage) {
      setCurrentPage(pageParam)
      return
    }

    if (typeof window !== 'undefined') {
      if (!isMounted.current) {
        isMounted.current = true
      }
      debouncedFetch(currentPage)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [currentPage, searchParams, debouncedFetch])

  // 格式化文章数据
  const formattedPosts = useCallback(() => {
    return postList.map(post => ({
      id: post.id,
      title: post.title,
      image: post.image || 'http://www.w3.org/2000/svg',
      content_html: post.content_html || '<p>暂无内容</p>',
      content_markdown: post.content_markdown || '',
      category_ids: post.category_ids || [],
      visibility: post.visibility
    }))
  }, [postList])

  // 刷新数据（强制获取最新）
  const refreshData = useCallback(
    () => debouncedFetch(currentPage, true),
    [currentPage, debouncedFetch]
  )

  return {
    posts: formattedPosts(),
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    refreshPage: refreshData
  }
}
