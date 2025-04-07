'use client'

import { useEffect, useState, useRef } from 'react'
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
import '@shared/lib/utils/highlight/syntax-highlight.css'
import './post.css'

/**
 * 文章详情页面
 */
export default function PostDetailPage() {
  const params = useParams()
  const postId = parseInt(params?.slug as string, 10)
  const [mounted, setMounted] = useState(false)
  const { currentPost, isLoading, error, handleGetPostDetail } = usePost(false)
  const { resolvedTheme } = useTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const formattedRef = useRef(false)
  const highlighterRef = useRef<ReturnType<
    typeof createCodeHighlighter
  > | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  // 初始化数据
  useEffect(() => {
    setMounted(true)
    if (!isNaN(postId)) handleGetPostDetail(postId)

    return () => {
      if (highlighterRef.current) {
        highlighterRef.current.cleanupButtons()
        highlighterRef.current = null
      }
      formattedRef.current = false
    }
  }, [postId, handleGetPostDetail])

  // 代码高亮处理
  useEffect(() => {
    if (!mounted || !contentRef.current || !currentPost?.content_html) return

    // 创建高亮处理器
    if (contentRef.current) {
      highlighterRef.current = createCodeHighlighter(contentRef.current, {
        formattedRef
      })
    }

    // 应用高亮函数
    const applyHighlighting = () => {
      if (
        !formattedRef.current &&
        contentRef.current &&
        highlighterRef.current
      ) {
        setDocumentTheme(resolvedTheme || 'light')
        highlighterRef.current.applyFormatting(CopyCodeButton)
      }
    }

    // 延迟应用高亮
    const timeoutId = setTimeout(() => applyHighlighting(), 300)

    // 监听DOM变化
    if (contentRef.current) {
      const observer = new MutationObserver(() => {
        if (formattedRef.current) return
        setTimeout(() => applyHighlighting(), 300)
      })

      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: false
      })

      return () => {
        observer.disconnect()
        clearTimeout(timeoutId)
      }
    }

    // 页面淡入动画
    if (pageRef.current) {
      const pageElement = pageRef.current
      pageElement.style.opacity = '0'
      pageElement.style.transform = 'translateY(20px)'
      pageElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease'

      requestAnimationFrame(() => {
        const animTimer = setTimeout(() => {
          if (pageElement) {
            pageElement.style.opacity = '1'
            pageElement.style.transform = 'translateY(0)'
          }
        }, 100)

        return () => clearTimeout(animTimer)
      })
    }

    return () => clearTimeout(timeoutId)
  }, [currentPost, mounted, resolvedTheme])

  if (!mounted) return <div className='min-h-screen bg-background' />
  if (isLoading) return <Loading fullscreen allowScroll />
  if (error) {
    return (
      <main className='container mx-auto px-4 sm:px-6'>
        <div className='p-3 sm:p-4 mb-4 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 flex items-center gap-2 text-sm sm:text-base max-w-2xl mx-auto'>
          <AlertCircle className='h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0' />
          <span>{error}</span>
        </div>
      </main>
    )
  }
  if (!currentPost) {
    return (
      <main className='container mx-auto px-4 sm:px-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='text-center py-8 text-muted-foreground'>
              文章不存在
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  const isDark = resolvedTheme === 'dark'
  const processedContent = currentPost.content_html
    ? formatHtmlContent(currentPost.content_html)
    : null

  return (
    <div className='container mx-auto pt-4 px-4 sm:px-6' ref={pageRef}>
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
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0.5) 70%, rgba(9,9,11,1) 100%)'
                : 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,1) 100%)'
            }}
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
                  暂无内容
                </p>
              )}
            </div>
          </article>
        </main>

        <aside className='hidden lg:block'>
          <div className='sticky top-20'>
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
