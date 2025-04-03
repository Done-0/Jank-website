'use client'

import React, { useMemo, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/shared/components/ui/shadcn/card'
import { PaginationComponent } from './Pagination'
import { useRouter } from 'next/navigation'
import { Post } from '../types/Post'
import { truncateText } from '@/shared/lib/utils/format'

type PostListProps = {
  posts: Post[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  redirectEnabled?: boolean
}

/**
 * 文章列表组件 - 展示文章卡片列表及分页
 */
const PostList: React.FC<PostListProps> = ({
  posts,
  totalPages,
  currentPage,
  onPageChange,
  redirectEnabled = false
}) => {
  const router = useRouter()
  const postRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    postRefs.current = postRefs.current.slice(0, posts.length)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in')
              entry.target.classList.add(`delay-anim-${(idx % 5) + 1}`)
            }, 50)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    postRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [posts])

  const extractText = useMemo(
    () =>
      (htmlContent: string): string => {
        try {
          if (!htmlContent?.trim()) return '暂无内容描述...'

          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = htmlContent
          const text =
            (tempDiv.textContent || tempDiv.innerText || '').trim() ||
            '暂无内容描述'

          const truncated = truncateText(text, 100)
          return truncated.endsWith('...') ? truncated : truncated + '...'
        } catch {
          return '暂无内容描述...'
        }
      },
    []
  )

  const setPostRef = (el: HTMLDivElement | null, index: number) => {
    postRefs.current[index] = el
  }

  return (
    <Card className='w-full'>
      <CardContent className='p-4 w-full'>
        {posts.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>暂无内容</div>
        ) : (
          <div className='space-y-4'>
            {posts.map((post, index) => (
              <div
                key={post.id}
                ref={el => setPostRef(el, index)}
                className='relative md:h-[135px] h-[100px] cursor-pointer scroll-animate'
                onClick={() =>
                  redirectEnabled && router.push(`/posts/${post.id}`)
                }
              >
                <div className='group flex h-full overflow-hidden rounded-xl border hover:shadow-xl'>
                  {/* 图片区域 */}
                  <div className='relative w-1/3 overflow-hidden'>
                    <img
                      src={post.image}
                      alt={post.title}
                      className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                      loading='lazy'
                    />
                  </div>

                  {/* 内容区域 */}
                  <div className='h-full w-2/3 border-l'>
                    <div className='flex flex-col justify-center space-y-2 p-4 sm:p-5 md:p-6 group-hover:translate-x-3 transition-all duration-500 ease-out'>
                      <h3 className='md:text-xl line-clamp-1'>{post.title}</h3>
                      <p
                        className='text-sm text-muted-foreground opacity-55 line-clamp-1'
                        style={{ WebkitBoxOrient: 'vertical' }}
                      >
                        {extractText(post.content_html)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <div className='border mx-14'></div>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Card>
  )
}

export { PostList }
