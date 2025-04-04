import hljs from 'highlight.js'
import React from 'react'
import './syntax-highlight.css'

// 初始化配置
hljs.configure({ ignoreUnescapedHTML: true })

type RootRef = { root: any; container: HTMLElement }

/**
 * 代码高亮工具类
 */
export class CodeHighlighter {
    private element: HTMLElement
    private isFormatted: { current: boolean }
    private buttons: RootRef[]
    private cleanup: () => void

    constructor(
        element: HTMLElement,
        isFormatted: { current: boolean },
        buttons: RootRef[],
        cleanup?: () => void
    ) {
        this.element = element
        this.isFormatted = isFormatted
        this.buttons = buttons
        this.cleanup = cleanup || (() => { })

        // 添加高亮样式类
        if (element && !element.classList.contains('hljs-content')) {
            element.classList.add('hljs-content')
        }
    }

    // 清理按钮
    cleanupButtons(): void {
        const buttons = [...this.buttons]
        this.buttons.length = 0

        requestAnimationFrame(() => {
            buttons.forEach(({ root, container }) => {
                if (root && typeof root.unmount === 'function') {
                    try { root.unmount() } catch (e) { }
                }
                container.parentNode?.removeChild(container)
            })
            this.cleanup()
        })
    }

    // 应用格式化
    async applyFormatting(CopyButton: React.ComponentType<{ code: string }>): Promise<boolean> {
        if (!this.element || this.isFormatted.current) return false

        this.isFormatted.current = true

        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                try {
                    // 代码高亮
                    this.element.querySelectorAll('pre code').forEach(block => {
                        hljs.highlightElement(block as HTMLElement)
                    })

                    // 添加复制按钮
                    const preElements = this.element.querySelectorAll('pre')
                    if (preElements.length === 0) {
                        resolve(true)
                        return
                    }

                    const { createRoot } = await import('react-dom/client')
                    preElements.forEach(pre => {
                        pre.style.position = 'relative'

                        const code = pre.querySelector('code')
                        if (!code) return

                        const container = document.createElement('div')
                        container.className = 'absolute top-2 right-2 z-10'
                        pre.appendChild(container)

                        const root = createRoot(container)

                        root.render(
                            React.createElement(CopyButton, { code: code.textContent || '' })
                        )

                        this.buttons.push({ root, container })
                    })
                    resolve(true)
                } catch (error) {
                    console.error('格式化错误:', error)
                    resolve(false)
                }
            })
        })
    }
}

/**
 * 创建代码高亮器
 */
export function createCodeHighlighter(
    element: HTMLElement,
    options: {
        formattedRef?: { current: boolean }
        buttonRefs?: RootRef[]
        onCleanup?: () => void
    } = {}
): CodeHighlighter {
    return new CodeHighlighter(
        element,
        options.formattedRef || { current: false },
        options.buttonRefs || [],
        options.onCleanup
    )
}

/**
 * 设置文档主题
 */
export function setDocumentTheme(theme: string | null): void {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light')
} 