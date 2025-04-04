import './syntax-highlight.css'

// 预编译正则表达式
const CODE_BLOCK_REGEX = /<pre><code[\s\S]*?<\/code><\/pre>/g
const INLINE_CODE_REGEX = /(@[a-zA-Z0-9_\-\/]+)(?![^<]*<\/code>)/g
const BLOCKQUOTE_REGEX = /<blockquote>([\s\S]*?)<\/blockquote>/g

// 引用模式类型
type QuotePattern = {
  pattern: RegExp
  replacement?: string
  handler?: (match: string, ...groups: string[]) => string
}

// 引用模式配置
const quotePatterns: QuotePattern[] = [
  {
    pattern: /<p>["'""](.+?)["'""](?:\s*.*?)?<\/p>/g,
    replacement: '<blockquote><p>$1</p></blockquote>'
  },
  {
    pattern: /(<p>["'""].*?["'""](?:\s*.*?)?<\/p>)\s*(<p>.*?<\/p>)/g,
    handler: (m: string, q: string, n: string) =>
      n.includes(' said') ? `<blockquote>${q}${n}</blockquote>` : m
  },
  {
    pattern: /<p>&gt;\s*(.*?)<\/p>/g,
    replacement: '<blockquote><p>$1</p></blockquote>'
  },
  {
    pattern: /<p>&gt;&gt;\s*(.*?)<\/p>/g,
    replacement: '<blockquote><blockquote><p>$1</p></blockquote></blockquote>'
  }
]

// 处理多行引用
const processMultiLineQuotes = (html: string): string =>
  html.replace(
    /(<p>&gt;\s*(.*?)<\/p>)+/g,
    (match: string) =>
      `<blockquote>${[...match.matchAll(/<p>&gt;\s*(.*?)<\/p>/g)].map(m => `<p>${m[1]}</p>`).join('')}</blockquote>`
  )

// 缓存设置
const MAX_CACHE_SIZE = 50
const contentCache = new Map<string, string>()

/**
 * 处理HTML内容并应用格式化
 */
export function processContent(html: string): string {
  if (!html) return ''

  try {
    // 保护代码块
    const codeBlocks: string[] = []
    let processed = html.replace(CODE_BLOCK_REGEX, match => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
      codeBlocks.push(match)
      return placeholder
    })

    // 处理内联代码
    processed = processed.replace(INLINE_CODE_REGEX, '<code>$1</code>')

    // 应用引用处理
    quotePatterns.forEach(({ pattern, replacement, handler }) => {
      processed = replacement
        ? processed.replace(pattern, replacement)
        : handler
          ? processed.replace(pattern, handler)
          : processed
    })

    // 处理多行引用和样式
    processed = processMultiLineQuotes(processed)
    processed = processed.replace(BLOCKQUOTE_REGEX, (m, c) =>
      m.includes('class=')
        ? m
        : `<blockquote class="styled-quote">${c}</blockquote>`
    )

    // 恢复代码块
    codeBlocks.forEach(
      (block, i) =>
        (processed = processed.replace(`__CODE_BLOCK_${i}__`, block))
    )

    return processed
  } catch (e) {
    console.error('HTML处理错误:', e)
    return html
  }
}

/**
 * 处理HTML内容并缓存结果
 */
export function formatHtmlContent(html: string | undefined | null): string {
  if (!html) return ''

  const cached = contentCache.get(html)
  if (cached) return cached

  const result = processContent(html)

  if (contentCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = contentCache.keys().next().value
    if (oldestKey) contentCache.delete(oldestKey)
  }

  contentCache.set(html, result)
  return result
}
