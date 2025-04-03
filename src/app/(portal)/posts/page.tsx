'use client'

import { usePostList } from '@/modules/post/hooks/usePostList'
import { PostList } from '@/modules/post/components/PostList'
import { AlertCircle } from 'lucide-react'
import Loading from '@/shared/components/custom/Loading'
import { useState, useEffect } from 'react'

/**
 * 帖子列表页面
 */
export default function PostsPage() {
  const [mounted, setMounted] = useState(false)
  const { posts, totalPages, currentPage, isLoading, error, handlePageChange } =
    usePostList(5)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return <Loading fullscreen />
  }

  if (error) {
    return (
      <main className='container mx-auto px-4 sm:px-6 scroll-animate'>
        <div className='p-3 sm:p-4 mb-4 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base max-w-full sm:max-w-2xl mx-auto'>
          <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-500 dark:text-red-400 flex-shrink-0' />
          <span>{error}</span>
        </div>
      </main>
    )
  }

  return (
    <main className='container mx-auto px-4 sm:px-6 scroll-animate'>
      <div className='pb-6'>
        <PostList
          posts={posts}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          redirectEnabled={true}
        />
      </div>
    </main>
  )
}
