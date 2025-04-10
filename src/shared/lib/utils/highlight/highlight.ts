import hljs from 'highlight.js'
import React from 'react'
import './syntax-highlight.css'

// 初始化highlight.js核心配置
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
 * 代码高亮管理类
 */
export class CodeHighlighter {
  private element: HTMLElement
  private isFormatted: { current: boolean }
  private buttons: RootRef[] = []
  private cleanup: () => void
  private onHighlightComplete?: () => void
  private onInitialHighlightComplete?: () => void
  private highlightedElements = new Set<HTMLElement>()
  private intersectionObserver: IntersectionObserver | null = null
  private initialHighlightDone = false

  constructor(
    element: HTMLElement,
    isFormatted: { current: boolean },
    buttons: RootRef[] = [],
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

    element.classList.add('hljs-content')

    // 预处理代码块基础样式
    element.querySelectorAll('pre code').forEach(block =>
      (block as HTMLElement).classList.add('hljs')
    )
  }

  // 清理所有高亮标记和按钮
  cleanupButtons(): void {
    const buttons = [...this.buttons]
    this.buttons = []
    this.highlightedElements.clear()
    this.isFormatted.current = false
    this.initialHighlightDone = false

    this.intersectionObserver?.disconnect()
    this.intersectionObserver = null

    if (this.element) {
      // 一次性选择所有需要清理的元素
      this.element.querySelectorAll('pre code[data-highlighted]')
        .forEach(block => block.removeAttribute('data-highlighted'))

      this.element.querySelectorAll('pre[data-button-added]')
        .forEach(pre => pre.removeAttribute('data-button-added'))
    }

    // 异步移除DOM按钮，避免阻塞主线程
    requestAnimationFrame(() => {
      buttons.forEach(({ root, container }) => {
        root?.unmount?.()
        container?.remove()
      })
      this.cleanup()
    })
  }

  // 处理单个代码块的高亮和按钮添加
  private async processCodeBlock(
    element: HTMLElement,
    CopyButton: React.ComponentType<{ code: string }>
  ): Promise<void> {
    if (this.highlightedElements.has(element)) return

    // 重置高亮状态
    element.hasAttribute('data-highlighted') && element.removeAttribute('data-highlighted')

    const { createRoot } = await import('react-dom/client')
    const language = hljs.highlightAuto(element.textContent || '').language

    if (language) element.className = `language-${language} hljs`

    hljs.highlightElement(element)
    element.setAttribute('data-highlighted', 'yes')
    this.highlightedElements.add(element)

    const pre = element.closest('pre')
    if (pre?.hasAttribute('data-button-added')) return

    if (pre) {
      const container = document.createElement('div')
      container.className = 'absolute top-2 right-2 z-10'
      pre.appendChild(container)

      const root = createRoot(container)
      root.render(React.createElement(CopyButton, { code: element.textContent || '' }))

      this.buttons.push({ root, container })
      pre.setAttribute('data-button-added', 'true')
    }
  }

  // 应用代码高亮格式化，优先处理可见区域
  async applyFormatting(
    CopyButton: React.ComponentType<{ code: string }>
  ): Promise<boolean> {
    if (!this.element || this.isFormatted.current) return false

    this.isFormatted.current = true

    // 收集所有代码块并分类处理
    const codeBlocks = this.element.querySelectorAll('pre code')
    const visibleBlocks: HTMLElement[] = []
    const hiddenBlocks: HTMLElement[] = []

    // 优先处理视口内代码块
    let visibleCount = 0
    codeBlocks.forEach(block => {
      const element = block as HTMLElement
      const pre = element.closest('pre')

      if (!pre) return

      if (visibleCount < 5 && this.isElementInViewport(pre)) {
        visibleBlocks.push(element)
        visibleCount++
      } else {
        hiddenBlocks.push(element)
      }
    })

    // 立即处理可见代码块
    await Promise.all(visibleBlocks.map(block => this.processCodeBlock(block, CopyButton)))

    // 通知初始高亮完成
    if (!this.initialHighlightDone) {
      this.initialHighlightDone = true
      this.onInitialHighlightComplete?.()
    }

    // 惰性处理视口外代码块
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const codeBlock = entry.target.querySelector('code') as HTMLElement
            codeBlock && this.processCodeBlock(codeBlock, CopyButton)
            this.intersectionObserver?.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '100px', threshold: 0.1 }
    )

    // 观察剩余代码块
    hiddenBlocks.forEach(block => {
      const pre = block.closest('pre')
      pre && this.intersectionObserver?.observe(pre)
    })

    return true
  }

  // 检查元素是否在视口内
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
 * 创建代码高亮器实例
 */
export function createCodeHighlighter(
  element: HTMLElement,
  options: HighlighterOptions = {}
): CodeHighlighter {
  return new CodeHighlighter(
    element,
    options.formattedRef || { current: false },
    options.buttonRefs,
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
