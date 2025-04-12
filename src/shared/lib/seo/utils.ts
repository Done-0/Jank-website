/**
 * 描述文本长度常量
 */
export const DESCRIPTION_MIN_LENGTH = 140
export const DESCRIPTION_MAX_LENGTH = 160

/**
 * 优化描述长度，确保描述符合SEO最佳实践
 */
export function optimizeDescriptionLength(text: string): string {
  if (!text) return ''
  if (
    text.length >= DESCRIPTION_MIN_LENGTH &&
    text.length <= DESCRIPTION_MAX_LENGTH
  )
    return text
  if (text.length < DESCRIPTION_MIN_LENGTH) return text

  const lastPeriodIndex = text.lastIndexOf('.', DESCRIPTION_MAX_LENGTH)
  const lastSemicolonIndex = text.lastIndexOf(';', DESCRIPTION_MAX_LENGTH)
  let cutIndex = Math.max(lastPeriodIndex, lastSemicolonIndex)

  if (cutIndex < DESCRIPTION_MIN_LENGTH) {
    cutIndex = text.lastIndexOf(' ', DESCRIPTION_MAX_LENGTH)
    if (cutIndex < DESCRIPTION_MIN_LENGTH) cutIndex = DESCRIPTION_MAX_LENGTH - 3
    return `${text.substring(0, cutIndex).trim()}...`
  }

  return text.substring(0, cutIndex + 1).trim()
}

/**
 * 从HTML或Markdown中提取纯文本描述
 */
export function extractDescription(
  html?: string | null,
  markdown?: string | null,
  maxLength = DESCRIPTION_MAX_LENGTH
): string {
  if (!html && !markdown) return ''
  const text = html
    ? html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : markdown?.trim() || ''
  return optimizeDescriptionLength(text)
}
