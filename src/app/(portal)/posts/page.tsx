'use client'

import { usePostList } from '@/modules/post/hooks/usePostList'
import { PostList } from '@/modules/post/components/PostList'
import Loading from '@shared/components/custom/Loading'
import { useEffect, useRef } from 'react'
import { AlertCard } from '@shared/components/custom/Error'

export default function PostsPage() {
  const {
    posts,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    refreshPage
  } = usePostList(5)

  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    abortControllerRef.current = new AbortController()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  if (isLoading) return <Loading fullscreen allowScroll />

  if (error) {
    return (
      <AlertCard
        type='error'
        message={error}
        onAction={refreshPage}
        className='scroll-animate'
      />
    )
  }

  return (
    <main className='container mx-auto p-4 sm:p-4 scroll-animate'>
      <div className='pb-6'>
        <PostList
          posts={posts || []}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          redirectEnabled={true}
        />
      </div>
    </main>
  )
}
