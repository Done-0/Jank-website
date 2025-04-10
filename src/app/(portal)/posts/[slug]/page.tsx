'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePost } from '@/modules/post/hooks/usePost'
import Loading from '@shared/components/custom/Loading'
import { AlertCircle } from 'lucide-react'
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

  // 数据获取
  useEffect(() => {
    if (!isNaN(postId) && !isLoading && !currentPost && !error) {
      handleGetPostDetail(postId)
    }
  }, [postId, currentPost, isLoading, error, handleGetPostDetail])

  // 代码高亮
  useEffect(() => {
    if (!contentRef.current || !currentPost?.content_html) return

    highlighterRef.current?.cleanupButtons()
    highlighterRef.current = createCodeHighlighter(contentRef.current)
    setDocumentTheme(resolvedTheme || 'light')
    highlighterRef.current.applyFormatting(CopyCodeButton)

    return () => {
      highlighterRef.current?.cleanupButtons()
      highlighterRef.current = null
    }
  }, [currentPost, resolvedTheme])

  // 动画控制
  useEffect(() => {
    if (!currentPost) return

    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => {
      clearTimeout(timer)
      setIsVisible(false)
    }
  }, [currentPost])

  if (error) {
    return (
      <main className='container mx-auto p-4'>
        <div className='p-4 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 flex items-center gap-2 max-w-2xl mx-auto'>
          <AlertCircle className='h-5 w-5 flex-shrink-0' />
          <span>{error}</span>
        </div>
      </main>
    )
  }

  if (!currentPost) {
    return <Loading fullscreen allowScroll />
  }

  const isDark = resolvedTheme === 'dark'
  const bgColor = isDark ? '9,9,11' : '255,255,255'
  const gradientBg = `linear-gradient(to bottom, rgba(${bgColor},0) 0%, rgba(${bgColor},0.5) 70%, rgba(${bgColor},1) 100%)`
  const processedContent = currentPost.content_html
    ? formatHtmlContent(currentPost.content_html)
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
            src={currentPost.image || '/images/default-cover.jpg'}
            alt={currentPost.title}
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
            {currentPost.title}
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
