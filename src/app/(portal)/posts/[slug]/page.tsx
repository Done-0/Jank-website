'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { usePost } from '@/modules/post/hooks/usePost'
import Loading from '@shared/components/custom/Loading'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@shared/components/ui/shadcn/card'
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
import { initAnimationSystem } from '@shared/lib/animations/animationCore'
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
  const animationCleanupRef = useRef<(() => void) | null>(null)

  // 获取文章数据并初始化动画系统
  useEffect(() => {
    if (!isNaN(postId)) {
      handleGetPostDetail(postId)
    }

    // 初始化动画系统
    animationCleanupRef.current = initAnimationSystem()

    // 清理资源
    return () => {
      if (animationCleanupRef.current) {
        animationCleanupRef.current()
      }
      if (highlighterRef.current) {
        highlighterRef.current.cleanupButtons()
        highlighterRef.current = null
      }
    }
  }, [postId, handleGetPostDetail])

  // 应用代码高亮
  useEffect(() => {
    if (!contentRef.current || !currentPost?.content_html) return

    // 清理旧的高亮器
    if (highlighterRef.current) {
      highlighterRef.current.cleanupButtons()
    }

    // 创建新的高亮器
    highlighterRef.current = createCodeHighlighter(contentRef.current)
    setDocumentTheme(resolvedTheme || 'light')
    highlighterRef.current.applyFormatting(CopyCodeButton)
  }, [currentPost, resolvedTheme])

  if (isLoading) return <Loading fullscreen allowScroll />

  if (error) {
    return (
      <main className='container mx-auto p-4 sm:p-4'>
        <div className='p-3 sm:p-4 mb-4 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 flex items-center gap-2 text-sm sm:text-base max-w-2xl mx-auto'>
          <AlertCircle className='h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0' />
          <span>{error}</span>
        </div>
      </main>
    )
  }

  if (!currentPost) {
    return (
      <main className='container mx-auto p-4 sm:p-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='text-center py-8 text-muted-foreground'>
              未找到文章
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  const isDark = resolvedTheme === 'dark'
  const gradientBg = isDark
    ? 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0.5) 70%, rgba(9,9,11,1) 100%)'
    : 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,1) 100%)'

  const processedContent = currentPost.content_html
    ? formatHtmlContent(currentPost.content_html)
    : null

  return (
    <div className='container mx-auto p-4'>
      <div className='relative mb-6 scroll-animate'>
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
          <article className='rounded-lg shadow-sm overflow-hidden border scroll-animate'>
            <div className='article-content hljs-content p-6' ref={contentRef}>
              {processedContent ? (
                parse(processedContent)
              ) : (
                <p className='text-muted-foreground text-center py-4'>
                  此文章暂无内容
                </p>
              )}
            </div>
          </article>
        </main>

        <aside className='hidden lg:block'>
          <div className='sticky top-20 scroll-animate'>
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
