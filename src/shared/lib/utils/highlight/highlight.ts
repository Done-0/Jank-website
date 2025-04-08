import hljs from 'highlight.js'
import React from 'react'
import './syntax-highlight.css'

// 初始化配置
hljs.configure({
  ignoreUnescapedHTML: true,
  languages: ['*']
})

type RootRef = { root: any; container: HTMLElement }

type HighlighterOptions = {
  formattedRef?: { current: boolean }
  buttonRefs?: RootRef[]
  onCleanup?: () => void
  onHighlightComplete?: () => void
  onInitialHighlightComplete?: () => void
}

/**
 * 代码高亮工具类
 */
export class CodeHighlighter {
  private element: HTMLElement
  private isFormatted: { current: boolean }
  private buttons: RootRef[]
  private cleanup: () => void
  private onHighlightComplete?: () => void
  private onInitialHighlightComplete?: () => void
  private highlightedElements: Set<HTMLElement>
  private intersectionObserver: IntersectionObserver | null
  private initialHighlightDone: boolean

  constructor(
    element: HTMLElement,
    isFormatted: { current: boolean },
    buttons: RootRef[],
    cleanup?: () => void,
    onHighlightComplete?: () => void,
    onInitialHighlightComplete?: () => void
  ) {
    this.element = element
    this.isFormatted = isFormatted
    this.buttons = buttons
    this.cleanup = cleanup || (() => { })
    this.onHighlightComplete = onHighlightComplete
    this.onInitialHighlightComplete = onInitialHighlightComplete
    this.highlightedElements = new Set<HTMLElement>()
    this.intersectionObserver = null
    this.initialHighlightDone = false
    element.classList.add('hljs-content')

    // 立即添加基础样式
    const codeBlocks = element.querySelectorAll('pre code')
    codeBlocks.forEach(block => {
      const element = block as HTMLElement
      element.classList.add('hljs')
    })
  }

  // 清理按钮和高亮状态 
  cleanupButtons(): void {
    const buttons = [...this.buttons]
    this.buttons.length = 0
    this.highlightedElements.clear()
    this.isFormatted.current = false
    this.initialHighlightDone = false
    this.intersectionObserver?.disconnect()
    this.intersectionObserver = null

    requestAnimationFrame(() => {
      buttons.forEach(({ root, container }) => {
        root?.unmount?.()
        container.remove()
      })
      this.cleanup()
    })
  }

  // 处理单个代码块
  private async processCodeBlock(
    element: HTMLElement,
    CopyButton: React.ComponentType<{ code: string }>
  ): Promise<void> {
    if (this.highlightedElements.has(element)) return

    const { createRoot } = await import('react-dom/client')
    const language = hljs.highlightAuto(element.textContent || '').language
    if (language) element.className = `language-${language} hljs`
    hljs.highlightElement(element)
    element.setAttribute('data-highlighted', 'yes')
    this.highlightedElements.add(element)

    const pre = element.closest('pre')
    if (pre && !pre.hasAttribute('data-button-added')) {
      const container = document.createElement('div')
      container.className = 'absolute top-2 right-2 z-10'
      pre.appendChild(container)
      const root = createRoot(container)
      root.render(React.createElement(CopyButton, { code: element.textContent || '' }))
      this.buttons.push({ root, container })
      pre.setAttribute('data-button-added', 'true')
    }
  }

  // 应用格式化
  async applyFormatting(
    CopyButton: React.ComponentType<{ code: string }>
  ): Promise<boolean> {
    if (!this.element || this.isFormatted.current) return false

    this.isFormatted.current = true

    const codeBlocks = this.element.querySelectorAll('pre code:not([data-highlighted="yes"])')
    const visibleBlocks: HTMLElement[] = []
    const hiddenBlocks: HTMLElement[] = []

    // 先处理前5个可见代码块
    let visibleCount = 0
    codeBlocks.forEach(block => {
      const element = block as HTMLElement
      const pre = element.closest('pre')
      if (pre) {
        if (visibleCount < 5 && this.isElementInViewport(pre)) {
          visibleBlocks.push(element)
          visibleCount++
        } else {
          hiddenBlocks.push(element)
        }
      }
    })

    // 立即处理可见代码块
    await Promise.all(visibleBlocks.map(block => this.processCodeBlock(block, CopyButton)))

    // 通知初始高亮完成
    if (!this.initialHighlightDone) {
      this.initialHighlightDone = true
      this.onInitialHighlightComplete?.()
    }

    // 设置 IntersectionObserver 处理剩余代码块
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const codeBlock = entry.target.querySelector('code')
            if (codeBlock && !this.highlightedElements.has(codeBlock as HTMLElement)) {
              this.processCodeBlock(codeBlock as HTMLElement, CopyButton)
            }
          }
        })
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    )

    // 观察剩余代码块
    hiddenBlocks.forEach(block => {
      const pre = block.closest('pre')
      if (pre) this.intersectionObserver?.observe(pre)
    })

    return true
  }

  // 检查元素是否在视口中
  private isElementInViewport(el: Element): boolean {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
}

/**
 * 创建代码高亮器
 */
export function createCodeHighlighter(
  element: HTMLElement,
  options: HighlighterOptions = {}
): CodeHighlighter {
  return new CodeHighlighter(
    element,
    options.formattedRef || { current: false },
    options.buttonRefs || [],
    options.onCleanup,
    options.onHighlightComplete,
    options.onInitialHighlightComplete
  )
}

/**
 * 设置文档主题
 */
export function setDocumentTheme(theme: string | null): void {
  document.documentElement.classList.remove('dark', 'light')
  document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light')
}
