/**
 * XML生成工具函数
 */

/**
 * 生成带有标准XML头部的文档
 */
export function wrapXmlDocument(content: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>${content}`
}

/**
 * 使用CDATA包装XML内容
 */
export function wrapCdata(content: string): string {
  return `<![CDATA[${content}]]>`
}

/**
 * 生成简单XML元素
 */
export function xmlElement(
  tag: string,
  content: string | number | boolean
): string {
  return `<${tag}>${content}</${tag}>`
}

/**
 * 生成带属性的XML元素
 */
export function xmlElementWithAttrs(
  tag: string,
  content: string,
  attributes: Record<string, string>
): string {
  const attrs = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  return `<${tag} ${attrs}>${content}</${tag}>`
}
