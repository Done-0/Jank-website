'use client'

import { useEffect, useCallback } from 'react'
import { usePostList } from '@/modules/post/hooks/usePostList'
import { PostList } from '@/modules/post/components/PostList'
import Loading from '@shared/components/custom/Loading'
import { AlertCard } from '@shared/components/custom/Error'
import { useSeo } from '@shared/providers/SeoProvider'

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

  const { setTitle } = useSeo()

  useEffect(() => {
    setTitle('文章列表')

    return () => setTitle('')
  }, [setTitle])

  const handleRefresh = useCallback(() => {
    refreshPage()
  }, [refreshPage])

  if (isLoading) return <Loading fullscreen allowScroll />

  if (error) {
    return (
      <AlertCard
        type='error'
        message={error}
        onAction={handleRefresh}
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
