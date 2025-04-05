'use client'

import React, { useMemo, useEffect, useRef, memo, useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/shadcn/card'
import { PaginationComponent } from './Pagination'
import { useRouter } from 'next/navigation'
import { Post } from '../types/Post'
import { truncateText } from '@/shared/lib/utils/format'
import Image from 'next/image'

type PostListProps = {
  posts: Post[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  redirectEnabled?: boolean
}

// 文章项组件
const PostItem = memo(({ post, index, setRef, onClick, extractText }: any) => (
  <div
    ref={el => setRef(el, index)}
    className='relative md:h-[135px] h-[100px] cursor-pointer scroll-animate'
    data-post-id={post.id}
    onClick={onClick}
  >
    <div className='group flex h-full overflow-hidden rounded-xl border hover:shadow-xl'>
      <div className='relative w-1/3 overflow-hidden'>
        <Image
          src={post.image}
          alt={post.title}
          className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
          fill
          sizes='(max-width: 768px) 33vw, 25vw'
          loading='lazy'
          quality={80}
        />
      </div>
      <div className='h-full w-2/3 border-l'>
        <div className='flex flex-col justify-center space-y-2 p-4 sm:p-5 md:p-6 group-hover:translate-x-3 transition-all duration-500 ease-out'>
          <h3 className='md:text-xl line-clamp-1'>{post.title}</h3>
          <p className='text-sm text-muted-foreground opacity-55 line-clamp-1'>
            {extractText(post.content_html)}
          </p>
        </div>
      </div>
    </div>
  </div>
))

const PostList = ({
  posts,
  totalPages,
  currentPage,
  onPageChange,
  redirectEnabled = false
}: PostListProps) => {
  const router = useRouter()
  const [showPagination, setShowPagination] = useState(false)
  const refs = useRef<Set<HTMLElement>>(new Set())
  const observer = useRef<IntersectionObserver | null>(null)
  const visibleCount = useRef(0)
  const key = useMemo(() => posts.map(p => p.id).join(','), [posts])

  const extractText = useMemo(
    () =>
      (html: string): string => {
        if (!html?.trim()) return '暂无内容描述...'
        try {
          const div = document.createElement('div')
          div.innerHTML = html
          const text = div.textContent?.trim() || '暂无内容描述'
          return truncateText(text, 100) + (text.length > 100 ? '' : '...')
        } catch {
          return '暂无内容描述...'
        }
      },
    []
  )

  useEffect(() => {
    setShowPagination(false)
    visibleCount.current = 0
    refs.current.clear()

    if (typeof window === 'undefined' || !posts.length) return

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const el = entry.target as HTMLElement
        observer.current?.unobserve(el)
        refs.current.delete(el)

        const idx = parseInt(el.dataset.index || '0')
        requestAnimationFrame(() => {
          el.classList.add('animate-in', `delay-anim-${(idx % 5) + 1}`)
          visibleCount.current++

          if (visibleCount.current >= posts.length) {
            setTimeout(() => setShowPagination(true), 300)
          }
        })
      })
    }

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    })

    return () => observer.current?.disconnect()
  }, [key, posts.length])

  const setRef = (el: HTMLDivElement | null, index: number) => {
    if (!el) return
    el.dataset.index = String(index)
    refs.current.add(el)
    observer.current?.observe(el)
  }

  return (
    <Card className='w-full'>
      <CardContent className='p-4 w-full'>
        <div className='space-y-4'>
          {posts.map((post, index) => (
            <PostItem
              key={post.id}
              post={post}
              index={index}
              setRef={setRef}
              onClick={() =>
                redirectEnabled && router.push(`/posts/${post.id}`)
              }
              extractText={extractText}
            />
          ))}
        </div>
      </CardContent>

      {posts.length > 0 && (
        <div
          className={`transition-opacity duration-300 ease-in-out ${showPagination ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='border mx-14' />
          <div>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </Card>
  )
}

export { PostList }
