/**
 * 资源管理工具 - 提供各类资源的缓存和重用机制
 */

import { useMemo } from 'react'

// 资源类型定义
export type ResourceType = 'svg' | 'image' | 'icon' | 'font'

// 资源注册表 - 用于存储已加载的资源
const resourceRegistry = new Map<string, any>()

// 生成资源唯一ID
export function generateResourceId(
  prefix = 'resource',
  type: ResourceType = 'svg'
) {
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}-${type}-${random}`
}

// 生成多个相关ID
export function generateMultipleIds(
  prefix = 'resource',
  suffixes: string[] = ['primary', 'secondary'],
  isStatic = false,
  staticSuffix = 'static'
) {
  // 静态模式使用固定ID以避免服务器/客户端水合不匹配
  if (isStatic) {
    return suffixes.reduce(
      (acc, suffix) => {
        acc[suffix] = `${prefix}-${suffix}-${staticSuffix}`
        return acc
      },
      {} as Record<string, string>
    )
  }

  // 非静态模式使用随机ID，仅用于客户端渲染
  const random = Math.random().toString(36).substring(2, 9)
  return suffixes.reduce(
    (acc, suffix) => {
      acc[suffix] = `${prefix}-${suffix}-${random}`
      return acc
    },
    {} as Record<string, string>
  )
}

export function registerResource(key: string, resource: any) {
  resourceRegistry.set(key, resource)
}

export function getResource(key: string) {
  return resourceRegistry.get(key)
}

export function hasResource(key: string) {
  return resourceRegistry.has(key)
}

export function removeResource(key: string) {
  return resourceRegistry.delete(key)
}

export function clearResources() {
  resourceRegistry.clear()
}

export function registerResources(resources: Record<string, any>) {
  Object.entries(resources).forEach(([key, value]) => {
    registerResource(key, value)
  })
}

/**
 * React Hook，使用缓存的资源
 */
export function useResource<T>(key: string, factory: () => T): T {
  return useMemo(() => {
    if (hasResource(key)) {
      return getResource(key) as T
    }

    const resource = factory()
    registerResource(key, resource)
    return resource
  }, [key, factory])
}

// 预编码SVG数据URL
export function svgToDataUrl(svgString: string): string {
  const encoded = Buffer.from(svgString).toString('base64')
  return `data:image/svg+xml;base64,${encoded}`
}

// 导出SVG组件
export * from './svg'
