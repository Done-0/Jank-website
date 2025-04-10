/**
 * 动画系统类型定义
 * 包含系统配置选项及全局状态变量
 */

/**
 * 动画系统配置选项接口
 *
 * @property animationClass - 应用于元素的动画CSS类名
 * @property baseDelayMs - 基础动画延迟时间(毫秒)
 * @property disableAutoDelay - 是否禁用自动计算的延迟时间
 * @property disabled - 是否完全禁用动画系统
 * @property rootMargin - IntersectionObserver的rootMargin参数
 * @property selector - 用于选择需要动画的元素的CSS选择器
 * @property threshold - 元素可见比例阈值，触发动画的条件
 */
export type AnimationOptions = {
  animationClass?: string
  baseDelayMs?: number
  disableAutoDelay?: boolean
  disabled?: boolean
  rootMargin?: string
  selector?: string
  threshold?: number
}

// 观察器和状态变量
let _observer: IntersectionObserver | null = null
let _mutationObserver: MutationObserver | null = null
let _isInitialized = false
let _pendingRaf: null | number = null
let _observedElements = new WeakSet()
let _cleanupListeners: Array<() => void> = []

// 观察器状态管理
export const getObserver = () => _observer
export const setObserver = (value: IntersectionObserver | null) => {
  _observer = value
}

// MutationObserver状态管理
export const getMutationObserver = () => _mutationObserver
export const setMutationObserver = (value: MutationObserver | null) => {
  _mutationObserver = value
}

// 初始化状态管理
export const getIsInitialized = () => _isInitialized
export const setIsInitialized = (value: boolean) => {
  _isInitialized = value
}

// requestAnimationFrame ID管理
export const getPendingRaf = () => _pendingRaf
export const setPendingRaf = (value: null | number) => {
  _pendingRaf = value
}

// 已观察元素集合管理
export const getObservedElements = () => _observedElements
export const setObservedElements = (value: WeakSet<any>) => {
  _observedElements = value
}

// 清理监听器管理
export const getCleanupListeners = () => _cleanupListeners
export const setCleanupListeners = (value: Array<() => void>) => {
  _cleanupListeners = value
}
export const addCleanupListener = (callback: () => void) => {
  _cleanupListeners.push(callback)
}

/**
 * 环境检测
 * 用于确定代码运行环境以及可用的API
 */
export const isBrowser = typeof window !== 'undefined'
export const hasIO = isBrowser && 'IntersectionObserver' in window
export const hasRAF = isBrowser && 'requestAnimationFrame' in window

/**
 * 防抖函数优化
 * 用于延迟执行任务，避免频繁调用
 * 闭包模式保持内部状态
 */
export const scheduleTask = (() => {
  let timerId: null | ReturnType<typeof setTimeout> = null

  return (callback: () => void, delay = 20) => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => {
      callback()
      timerId = null
    }, delay)
  }
})()
