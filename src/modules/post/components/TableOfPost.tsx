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

const TableOfContents = React.memo(
  ({ contentRef, height = '250px' }: TableOfContentsProps) => {
    const [data, setData] = useState<{
      headings: Heading[]
      activeId: string
      expandedIds: Set<string>
    }>({
      headings: [],
      activeId: '',
      expandedIds: new Set()
    })
    const { headings, activeId, expandedIds } = data

    const refs = useRef({
      observer: null as IntersectionObserver | null,
      tocContainer: null as HTMLDivElement | null,
      isManualScroll: false,
      scrollTimeout: null as NodeJS.Timeout | null
    })

    const utils = useMemo(
      () => ({
        // 处理展开/折叠
        toggleExpand: (id: string) =>
          setData(prev => ({
            ...prev,
            expandedIds: new Set(
              prev.expandedIds.has(id)
                ? Array.from(prev.expandedIds).filter(i => i !== id)
                : [...prev.expandedIds, id]
            )
          })),

        // 安全ID生成
        createId: (text: string) =>
          `heading-${text
            .trim()
            .slice(0, 50)
            .toLowerCase()
            .replace(/[^\w-]/g, '-')}`,

        // 查找父级IDs
        findParentIds: (headings: Heading[], targetId: string): string[] => {
          const queue = headings.map(h => ({ item: h, path: [h.id] }))
          const visited = new Set<string>()

          while (queue.length > 0) {
            const { item, path } = queue.shift()!
            if (item.id === targetId) return path

            if (item.children?.length) {
              for (const child of item.children) {
                if (!visited.has(child.id)) {
                  visited.add(child.id)
                  queue.push({ item: child, path: [...path, child.id] })
                }
              }
            }
          }

          return []
        },

        // 页面滚动到标题
        scrollToHeading: (id: string) => {
          if (!contentRef.current) return
          const target = contentRef.current.querySelector(`#${id}`)
          if (!target) return

          requestAnimationFrame(() => {
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth'
            })

            setData(prev => ({ ...prev, activeId: id }))
          })
        },

        // 目录滚动到当前项
        scrollToActiveItem: (activeId: string) => {
          if (
            !refs.current.tocContainer ||
            !activeId ||
            refs.current.isManualScroll
          )
            return

          const activeEl = refs.current.tocContainer.querySelector(
            `[data-heading-id="${activeId}"]`
          ) as HTMLElement

          if (!activeEl) return

          const container = refs.current.tocContainer
          const containerRect = container.getBoundingClientRect()
          const activeRect = activeEl.getBoundingClientRect()

          const targetScroll =
            container.scrollTop +
            (activeRect.top - containerRect.top) -
            (containerRect.height / 2 - activeRect.height / 2)

          requestAnimationFrame(() => {
            container?.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            })
          })
        },

        // 解析内容
        parseContent: (element: HTMLElement): Heading[] => {
          if (!element) return []

          // 获取有效元素
          const allElements = [
            ...Array.from(
              element.querySelectorAll('h1, h2, h3, h4, h5, h6')
            ).filter(el => !el.closest('pre, code') && el.textContent?.trim()),
            ...Array.from(element.querySelectorAll('ol > li')).filter(
              el =>
                !el.closest('pre, code, ul, .non-toc') && el.textContent?.trim()
            )
          ].sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
              ? -1
              : 1
          )

          // 构建层次结构
          const result: Heading[] = []
          const stack: Heading[] = []

          for (const el of allElements) {
            const level = el.tagName.startsWith('H')
              ? parseInt(el.tagName.substring(1), 10)
              : 7
            const text = el.textContent!.trim()
            const displayText =
              text.length > 60 ? `${text.slice(0, 57)}...` : text
            const id = el.id || utils.createId(text)
            if (!el.id) el.id = id

            const heading = { id, text: displayText, level }

            // 维护层级
            while (
              stack.length &&
              stack[stack.length - 1].level >= heading.level
            )
              stack.pop()

            if (stack.length) {
              const parent = stack[stack.length - 1]
              parent.children = parent.children || []
              parent.children.push(heading)
            } else {
              result.push(heading)
            }

            stack.push(heading)
          }

          return result
        }
      }),
      [contentRef]
    )

    // 初始化
    useEffect(() => {
      if (!contentRef.current) return

      // 1. 解析内容
      const headings = utils.parseContent(contentRef.current)

      // 2. 设置状态
      setData({
        headings,
        activeId: '',
        expandedIds: new Set(headings.map(h => h.id))
      })

      // 3. 设置观察器
      refs.current.observer = new IntersectionObserver(
        entries => {
          const visible = entries.filter(e => e.isIntersecting)
          if (!visible.length) return

          // 获取最靠近顶部的元素
          const top = visible.reduce((p, c) =>
            p.boundingClientRect.top < c.boundingClientRect.top ? p : c
          )

          const id = top.target.id

          setData(prev => {
            if (prev.activeId === id) return prev

            // 查找并展开父级
            const parentIds = utils.findParentIds(headings, id)

            return {
              ...prev,
              activeId: id,
              expandedIds: parentIds.length
                ? new Set(parentIds)
                : prev.expandedIds
            }
          })
        },
        { rootMargin: '-100px 0px -80% 0px', threshold: [0.1] }
      )

      // 4. 观察元素
      contentRef.current
        .querySelectorAll('h1, h2, h3, h4, h5, h6, ol > li')
        .forEach((el: Element) => {
          if (el.closest('pre, code, ul, .non-toc')) return
          if (!el.id && el.textContent) el.id = utils.createId(el.textContent)
          if (el.id) refs.current.observer!.observe(el)
        })

      return () => {
        refs.current.observer?.disconnect()
        if (refs.current.scrollTimeout) clearTimeout(refs.current.scrollTimeout)
      }
    }, [contentRef, utils])

    // 当活动ID变化时滚动到视图
    useEffect(() => {
      if (activeId) utils.scrollToActiveItem(activeId)
    }, [activeId, utils])

    // 标题项组件
    const HeadingItem = useCallback(
      ({ heading }: { heading: Heading }) => {
        const isExpanded = expandedIds.has(heading.id)
        const hasChildren = heading.children && heading.children.length > 0
        const isActive = activeId === heading.id

        const handleClick = (e: React.MouseEvent) => {
          e.preventDefault()
          utils.scrollToHeading(heading.id)
          if (hasChildren) utils.toggleExpand(heading.id)
        }

        return (
          <li className={`pl-${Math.min(8, (heading.level - 1) * 2)}`}>
            <a
              href={`#${heading.id}`}
              className={`block py-1.5 text-sm transition-all duration-300 ease-in-out border-l-2 pl-2 ${
                isActive
                  ? 'text-primary border-primary font-medium bg-primary/5 dark:bg-primary/10'
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
      },
      [activeId, expandedIds, utils]
    )

    // 监听手动滚动
    const handleScroll = useCallback(() => {
      refs.current.isManualScroll = true
      if (refs.current.scrollTimeout) clearTimeout(refs.current.scrollTimeout)
      refs.current.scrollTimeout = setTimeout(() => {
        refs.current.isManualScroll = false
      }, 1000)
    }, [])

    const setTocRef = useCallback(
      (node: HTMLDivElement) => {
        if (node) {
          refs.current.tocContainer = node
          node.addEventListener('scroll', handleScroll, { passive: true })
        }
      },
      [handleScroll]
    )

    useEffect(() => {
      return () => {
        const container = refs.current.tocContainer
        if (container) {
          container.removeEventListener('scroll', handleScroll)
        }
        if (refs.current.scrollTimeout) clearTimeout(refs.current.scrollTimeout)
      }
    }, [handleScroll])

    return (
      <div className='w-full p-4 border border-border rounded-lg text-card-foreground shadow-sm'>
        <h3 className='text-lg font-medium mb-2'>目录</h3>
        <div
          ref={setTocRef}
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
            <nav>
              <ul className='space-y-1'>
                {headings.map(heading => (
                  <HeadingItem key={heading.id} heading={heading} />
                ))}
              </ul>
            </nav>
          ) : (
            <p className='text-sm text-foreground/60 italic'>暂无目录</p>
          )}
        </div>
      </div>
    )
  }
)

TableOfContents.displayName = 'TableOfContents'

export { TableOfContents }
