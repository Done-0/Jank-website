'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'

type Heading = {
  id: string
  text: string
  level: number
  children?: Heading[]
}

type TableOfContentsProps = {
  contentRef: React.RefObject<HTMLElement>
  height?: string
}

const TableOfContents: React.FC<TableOfContentsProps> = React.memo(
  ({ contentRef, height = '250px' }) => {
    const [headings, setHeadings] = useState<Heading[]>([])
    const [activeId, setActiveId] = useState<string>('')
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const observerRef = useRef<IntersectionObserver | null>(null)
    const tocContainerRef = useRef<HTMLDivElement>(null)
    const isManualScrollRef = useRef<boolean>(false)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const prevActiveIdRef = useRef<string>('')
    const headingsMapRef = useRef<Map<string, Heading>>(new Map())

    const handleToggle = useCallback((id: string) => {
      setExpandedIds(prev => {
        const newExpanded = new Set(prev)
        newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
        return newExpanded
      })
    }, [])

    const createSafeId = useCallback((text: string): string => {
      return `heading-${text
        .trim()
        .slice(0, 50)
        .toLowerCase()
        .replace(/[^\w-]/g, '-')}`
    }, [])

    const parseContent = useCallback(
      (content: HTMLElement): Heading[] => {
        const headingElements = content.querySelectorAll(
          'h1, h2, h3, h4, h5, h6'
        )
        const listItems = content.querySelectorAll('ol > li')
        const allElements: Element[] = []

        // 收集有效元素
        for (let i = 0; i < headingElements.length; i++) {
          const el = headingElements[i]
          if (!el.closest('pre, code') && el.textContent?.trim()) {
            allElements.push(el)
          }
        }

        for (let i = 0; i < listItems.length; i++) {
          const el = listItems[i]
          if (
            !el.closest('pre, code, ul, .non-toc') &&
            el.textContent?.trim()
          ) {
            allElements.push(el)
          }
        }

        // 排序
        allElements.sort((a, b) => {
          const position = a.compareDocumentPosition(b)
          return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        })

        // 构建标题列表
        const headingsMap = new Map<string, Heading>()
        const result: Heading[] = []
        const stack: Heading[] = []

        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i]
          const level = el.tagName.startsWith('H')
            ? parseInt(el.tagName.substring(1), 10)
            : 7
          const fullText = el.textContent!.trim()
          const text =
            fullText.length > 60 ? fullText.slice(0, 57) + '...' : fullText
          const id = el.id || createSafeId(text)
          if (!el.id) el.id = id

          const heading = { id, text, level }

          // 构建层次结构
          while (
            stack.length &&
            stack[stack.length - 1].level >= heading.level
          ) {
            stack.pop()
          }

          if (stack.length) {
            const parent = stack[stack.length - 1]
            parent.children = parent.children || []
            parent.children.push(heading)
          } else {
            result.push(heading)
          }

          stack.push(heading)
          headingsMap.set(heading.id, heading)
        }

        headingsMapRef.current = headingsMap
        return result
      },
      [createSafeId]
    )

    const scrollToHeading = useCallback(
      (id: string) => {
        if (!contentRef.current) return

        const targetElement = contentRef.current.querySelector(`#${id}`)
        if (!targetElement) return

        // 平滑滚动到目标元素
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })

        // 可选：添加一些偏移，避免标题被固定导航栏遮挡
        const yOffset = -100 // 根据需要调整这个值
        window.scrollBy({
          top: yOffset,
          behavior: 'smooth'
        })

        // 更新活动ID
        setActiveId(id)
      },
      [contentRef]
    )

    const findParentIds = useCallback(
      (headings: Heading[], targetId: string): string[] => {
        const parentIds: string[] = []
        const visited = new Set<string>()
        const queue: Array<{ item: Heading; path: string[] }> = []

        // 初始化队列
        for (const heading of headings) {
          queue.push({ item: heading, path: [heading.id] })
        }

        // BFS搜索
        while (queue.length > 0) {
          const { item, path } = queue.shift()!

          if (item.id === targetId) {
            return path
          }

          if (item.children && item.children.length > 0) {
            for (const child of item.children) {
              if (!visited.has(child.id)) {
                visited.add(child.id)
                queue.push({ item: child, path: [...path, child.id] })
              }
            }
          }
        }

        return parentIds
      },
      []
    )

    const scrollToActiveItem = useCallback(() => {
      if (
        !tocContainerRef.current ||
        !activeId ||
        isManualScrollRef.current ||
        prevActiveIdRef.current === activeId
      )
        return

      prevActiveIdRef.current = activeId

      try {
        const activeElement = tocContainerRef.current.querySelector(
          `[data-heading-id="${activeId}"]`
        ) as HTMLElement
        if (!activeElement) return

        const containerRect = tocContainerRef.current.getBoundingClientRect()
        const activeRect = activeElement.getBoundingClientRect()

        // 检查元素是否在可视区域内
        const isVisible =
          activeRect.top >= containerRect.top + containerRect.height * 0.1 &&
          activeRect.bottom <= containerRect.bottom - containerRect.height * 0.1

        if (!isVisible) {
          const targetScroll =
            tocContainerRef.current.scrollTop +
            (activeRect.top - containerRect.top - containerRect.height * 0.25)

          requestAnimationFrame(() => {
            tocContainerRef.current?.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            })
          })
        }
      } catch (error) {
        console.error('Error scrolling to active item:', error)
      }
    }, [activeId])

    const handleManualScroll = useCallback(() => {
      isManualScrollRef.current = true
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        isManualScrollRef.current = false
      }, 1000)
    }, [])

    // 初始化逻辑
    useEffect(() => {
      if (!contentRef.current) return

      try {
        const idleCallback =
          window.requestIdleCallback || (cb => setTimeout(cb, 1))

        idleCallback(() => {
          if (!contentRef.current) return

          const hierarchicalHeadings = parseContent(contentRef.current)
          setHeadings(hierarchicalHeadings)

          // 只展开第一级标题
          const firstLevelIds = new Set(hierarchicalHeadings.map(h => h.id))
          setExpandedIds(firstLevelIds)

          // 设置IntersectionObserver
          observerRef.current = new IntersectionObserver(
            entries => {
              const visibleEntries = entries.filter(
                entry => entry.isIntersecting
              )
              if (visibleEntries.length === 0) return

              // 找到最靠近顶部的元素
              visibleEntries.sort(
                (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
              )
              const topEntry = visibleEntries[0]
              const currentId = topEntry.target.id

              if (currentId !== prevActiveIdRef.current) {
                setActiveId(currentId)
                const parentIds = findParentIds(hierarchicalHeadings, currentId)
                if (parentIds.length > 0) {
                  setExpandedIds(new Set(parentIds))
                }
                prevActiveIdRef.current = currentId
              }
            },
            { rootMargin: '-100px 0px -80% 0px', threshold: [0.1, 0.5] }
          )

          // 观察元素
          const elements = contentRef.current.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, ol > li'
          )
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i]
            if (el.closest('pre, code, ul, .non-toc')) continue
            if (!el.id && el.textContent) el.id = createSafeId(el.textContent)
            if (el.id) observerRef.current.observe(el)
          }
        })
      } catch (error) {
        console.error('Error initializing TableOfContents:', error)
      }

      return () => {
        observerRef.current?.disconnect()
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      }
    }, [contentRef, parseContent, findParentIds, createSafeId])

    // 滚动处理
    useEffect(() => {
      if (activeId) {
        const rafId = requestAnimationFrame(scrollToActiveItem)
        return () => cancelAnimationFrame(rafId)
      }
    }, [activeId, scrollToActiveItem])

    // 事件监听
    useEffect(() => {
      const container = tocContainerRef.current
      if (!container) return

      container.addEventListener('scroll', handleManualScroll, {
        passive: true
      })
      return () => {
        container.removeEventListener('scroll', handleManualScroll)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      }
    }, [handleManualScroll])

    const HeadingItem = useMemo(
      () =>
        React.memo(({ heading }: { heading: Heading }) => {
          const indentClass = `pl-${Math.min(8, (heading.level - 1) * 2)}`
          const isExpanded = expandedIds.has(heading.id)
          const hasChildren = heading.children && heading.children.length > 0
          const isActive = activeId === heading.id

          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault() // 阻止默认行为

            // 点击标题时切换展开/折叠状态
            if (hasChildren) {
              handleToggle(heading.id)
            }

            // 滚动到对应标题
            scrollToHeading(heading.id)
          }

          return (
            <li key={heading.id} className={indentClass}>
              <a
                href={`#${heading.id}`}
                className={`block py-1.5 text-sm transition-all duration-300 ease-in-out border-l-2 pl-2 ${
                  isActive
                    ? 'text-primary border-primary font-medium'
                    : 'text-foreground/60 border-transparent hover:border-foreground/20 hover:text-foreground/80'
                }`}
                onClick={handleClick}
                data-heading-id={heading.id}
              >
                <span className='truncate'>{heading.text}</span>
              </a>

              {hasChildren && (
                <ul
                  className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {heading.children!.map(child => (
                    <HeadingItem key={child.id} heading={child} />
                  ))}
                </ul>
              )}
            </li>
          )
        }),
      [activeId, expandedIds, handleToggle, scrollToHeading]
    )

    // 渲染逻辑
    const renderHeadings = useMemo(() => {
      if (headings.length === 0) return null

      return (
        <ul className='space-y-1'>
          {headings.map(heading => (
            <HeadingItem key={heading.id} heading={heading} />
          ))}
        </ul>
      )
    }, [headings, HeadingItem])

    return (
      <div className='w-full p-4 border border-border rounded-lg text-card-foreground shadow-sm'>
        <h3 className='text-lg font-medium mb-2'>目录</h3>
        <div
          ref={tocContainerRef}
          className='overflow-y-auto relative toc-container'
          style={{
            height,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maskImage:
              'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <style jsx global>{`
            .toc-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {headings.length > 0 ? (
            <nav>{renderHeadings}</nav>
          ) : (
            <p className='text-sm text-foreground/60 italic'>暂无目录</p>
          )}
        </div>
      </div>
    )
  }
)

export { TableOfContents }
