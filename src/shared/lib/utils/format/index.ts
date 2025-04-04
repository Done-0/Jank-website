/**
 * 格式化工具函数
 * 提供各种数据格式化方法
 */

/**
 * 格式化日期为本地字符串
 * @param date 日期
 * @param locale 区域设置
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'zh-CN'
): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 格式化货币
 * @param amount 金额
 * @param currency 货币代码
 * @param locale 区域设置
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 截断文本并添加省略号
 * @param text 文本
 * @param maxLength 最大长度
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 格式化数字（添加千位分隔符）
 * @param num 数字
 * @param locale 区域设置
 */
export function formatNumber(num: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num)
}
