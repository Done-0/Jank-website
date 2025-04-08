import './syntax-highlight.css'

// 正则表达式
const CODE_BLOCK_REGEX = /<pre><code[\s\S]*?<\/code><\/pre>/g
const INLINE_CODE_REGEX = /(@[a-zA-Z0-9_\-\/]+)(?![^<]*<\/code>)/g
const BLOCKQUOTE_REGEX = /<blockquote>([\s\S]*?)<\/blockquote>/g

// 简化的LRU缓存
class LRUCache {
  private cache = new Map<string, string>()
  private keys: string[] = []

  constructor(private maxSize: number) { }

  get(key: string): string | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      this.keys = this.keys.filter(k => k !== key)
      this.keys.push(key)
      return value
    }
    return undefined
  }

  set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.keys.shift()
      if (oldestKey) this.cache.delete(oldestKey)
    }

    if (this.cache.has(key)) this.keys = this.keys.filter(k => k !== key)
    this.cache.set(key, value)
    this.keys.push(key)
  }

  clear(): void {
    this.cache.clear()
    this.keys = []
  }
}

const contentCache = new LRUCache(100)

/**
 * 处理HTML内容格式化 - 优化版本
 */
export function processContent(html: string): string {
  if (!html) return ''

  const codeBlocks: string[] = []
  const processed = html
    .replace(CODE_BLOCK_REGEX, match => {
      codeBlocks.push(match)
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`
    })
    .replace(INLINE_CODE_REGEX, '<code>$1</code>')
    .replace(/(<p>["'""].*?["'""](?:\s*.*?)?<\/p>)\s*(<p>.*?<\/p>)/g,
      (m, q, n) => n.includes(' said') ? `<blockquote>${q}${n}</blockquote>` : m)
    .replace(/<p>["'""](.+?)["'""](?:\s*.*?)?<\/p>/g, '<blockquote><p>$1</p></blockquote>')
    .replace(/<p>&gt;\s*(.*?)<\/p>/g, '<blockquote><p>$1</p></blockquote>')
    .replace(/<p>&gt;&gt;\s*(.*?)<\/p>/g, '<blockquote><blockquote><p>$1</p></blockquote></blockquote>')
    .replace(/(<p>&gt;\s*(.*?)<\/p>)+/g, match =>
      `<blockquote>${[...match.matchAll(/<p>&gt;\s*(.*?)<\/p>/g)].map(m => `<p>${m[1]}</p>`).join('')}</blockquote>`)
    .replace(BLOCKQUOTE_REGEX, (m, c) =>
      m.includes('class=') ? m : `<blockquote class="styled-quote">${c}</blockquote>`)

  return processed.replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => codeBlocks[parseInt(i)])
}

/**
 * 格式化HTML并使用缓存
 */
export function formatHtmlContent(html: string | undefined | null): string {
  if (!html) return ''

  const cached = contentCache.get(html)
  if (cached) return cached

  const result = processContent(html)
  contentCache.set(html, result)
  return result
}

/**
 * 清理内容缓存
 */
export function clearContentCache(): void {
  contentCache.clear()
}
