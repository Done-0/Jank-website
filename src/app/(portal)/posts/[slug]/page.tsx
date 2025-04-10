'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePost } from '@/modules/post/hooks/usePost'
import Loading from '@shared/components/custom/Loading'
import Image from 'next/image'
import parse from 'html-react-parser'
import { useTheme } from 'next-themes'
import {
  createCodeHighlighter,
  setDocumentTheme,
  formatHtmlContent
} from '@shared/lib/utils'
import { CopyCodeButton } from '@/modules/post/components/CopyCodeButton'
import { TableOfContents } from '@/modules/post/components/TableOfPost'
import { AlertCard } from '@shared/components/custom/Error'
import '@shared/lib/utils/highlight/syntax-highlight.css'
import './post.css'

export default function PostDetailPage() {
  const params = useParams()
  const postId = parseInt(params?.slug as string, 10)
  const { currentPost, isLoading, error, handleGetPostDetail } = usePost(false)
  const { resolvedTheme } = useTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const highlighterRef = useRef<ReturnType<
    typeof createCodeHighlighter
  > | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [displayedPost, setDisplayedPost] = useState<typeof currentPost>(null)
  const previousPostIdRef = useRef<number | null>(null)

  // 数据获取
  useEffect(() => {
    if (!isNaN(postId) && previousPostIdRef.current !== postId) {
      previousPostIdRef.current = postId
      setDisplayedPost(null)
      setIsVisible(false)

      if (!isLoading) handleGetPostDetail(postId)
    }

    if (currentPost && postId === parseInt(currentPost.id.toString())) {
      setDisplayedPost(currentPost)
    }
  }, [postId, currentPost, isLoading, handleGetPostDetail])

  // 代码高亮
  useEffect(() => {
    if (!contentRef.current || !displayedPost?.content_html) return

    highlighterRef.current?.cleanupButtons()
    highlighterRef.current = createCodeHighlighter(contentRef.current)
    setDocumentTheme(resolvedTheme || 'light')
    highlighterRef.current.applyFormatting(CopyCodeButton)

    const timer = setTimeout(() => setIsVisible(true), 100)

    return () => {
      highlighterRef.current?.cleanupButtons()
      highlighterRef.current = null
      clearTimeout(timer)
      setIsVisible(false)
    }
  }, [displayedPost, resolvedTheme])

  if (error) {
    return <AlertCard type='error' message={error} />
  }

  if (!displayedPost) return <Loading fullscreen allowScroll />

  const isDark = resolvedTheme === 'dark'

  const gradientBg = `linear-gradient(to bottom, 
    hsla(var(--background), 0) 0%, 
    hsla(var(--background), 0.4) 60%, 
    hsla(var(--background), 0.7) 80%, 
    hsla(var(--background), 0.9) 100%)`

  const processedContent = displayedPost.content_html
    ? formatHtmlContent(displayedPost.content_html)
    : null

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
  }

  return (
    <div className='container mx-auto p-4' style={animationStyle}>
      <div className='relative mb-6'>
        <div className='w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-t-lg relative'>
          <Image
            src={displayedPost.image || '/images/default-cover.jpg'}
            alt={displayedPost.title}
            fill
            sizes='100vw'
            className='object-cover'
            priority
          />
          <div
            className='absolute inset-0'
            style={{ background: gradientBg }}
          />
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-6 text-center'>
          <h1
            className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} drop-shadow-sm`}
          >
            {displayedPost.title}
          </h1>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6'>
        <main>
          <article className='rounded-lg shadow-sm overflow-hidden border'>
            <div className='article-content hljs-content p-6' ref={contentRef}>
              {processedContent ? (
                parse(processedContent)
              ) : (
                <p className='text-muted-foreground text-center py-4'>
                  哎呀，您的星球与我们失联啦！
                </p>
              )}
            </div>
          </article>
        </main>
        <aside className='hidden lg:block'>
          <div className='sticky top-20' style={animationStyle}>
            <TableOfContents
              contentRef={contentRef as React.RefObject<HTMLElement>}
              height='300px'
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
