import './syntax-highlight.css'

const CODE_BLOCK_REGEX = /<pre><code[\s\S]*?<\/code><\/pre>/g
const INLINE_CODE_REGEX = /(@[a-zA-Z0-9_\-\/]+)(?![^<]*<\/code>)/g
const BLOCKQUOTE_REGEX = /<blockquote>([\s\S]*?)<\/blockquote>/g

type QuotePattern = {
  pattern: RegExp
  replacement?: string
  handler?: (match: string, ...groups: string[]) => string
}

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

const processMultiLineQuotes = (html: string): string =>
  html.replace(
    /(<p>&gt;\s*(.*?)<\/p>)+/g,
    (match: string) =>
      `<blockquote>${[...match.matchAll(/<p>&gt;\s*(.*?)<\/p>/g)].map(m => `<p>${m[1]}</p>`).join('')}</blockquote>`
  )

const MAX_CACHE_SIZE = 100
const contentCache = new Map<string, string>()

 * 处理HTML内容并应用格式化
export function processContent(html: string): string {
  if (!html) return ''

  const codeBlocks: string[] = []
  let processed = html.replace(CODE_BLOCK_REGEX, match => {
    codeBlocks.push(match)
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`
  })

  processed = processed.replace(INLINE_CODE_REGEX, '<code>$1</code>')

  quotePatterns.forEach(({ pattern, replacement, handler }) => {
    processed = replacement
      ? processed.replace(pattern, replacement)
      : handler
        ? processed.replace(pattern, handler)
        : processed
  })

  processed = processMultiLineQuotes(processed)
  processed = processed.replace(BLOCKQUOTE_REGEX, (m, c) =>
    m.includes('class=')
      ? m
      : `<blockquote class="styled-quote">${c}</blockquote>`
  )

  codeBlocks.forEach((block, i) => {
    processed = processed.replace(`__CODE_BLOCK_${i}__`, block)
  })

  return processed
}

 * 处理HTML内容并缓存结果
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
