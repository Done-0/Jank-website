/**
 * 动画系统核心功能
 *
 * 提供基础动画功能函数，负责初始化和管理动画系统
 */
import {
  AnimationOptions,
  getCleanupListeners,
  getIsInitialized,
  getObservedElements,
  getObserver,
  getPendingRaf,
  hasIO,
  hasRAF,
  isBrowser,
  scheduleTask,
  setCleanupListeners,
  setIsInitialized,
  setObservedElements,
  setObserver,
  setPendingRaf
} from './types'

/**
 * 手动触发元素动画
 * 可用于编程方式触发动画，而不依赖滚动
 *
 * @param element - 要添加动画的HTML元素
 * @param delayOrOptions - 延迟时间(毫秒)或动画配置选项
 */
export function animateElement(
  element: HTMLElement,
  delayOrOptions?: AnimationOptions | number
): void {
  if (!isBrowser || !element) return

  if (!element.classList.contains('scroll-animate')) {
    element.classList.add('scroll-animate')
  }

  let delay: number | undefined

  // 根据参数类型提取延迟值
  if (typeof delayOrOptions === 'number') {
    delay = delayOrOptions
  } else if (delayOrOptions && typeof delayOrOptions === 'object') {
    delay = delayOrOptions.baseDelayMs
  }

  // 应用延迟类
  if (delay !== undefined && delay > 0) {
    const delayClass =
      delay <= 50
        ? 'delay-anim-1'
        : delay <= 100
          ? 'delay-anim-2'
          : delay <= 200
            ? 'delay-anim-3'
            : delay <= 300
              ? 'delay-anim-4'
              : 'delay-anim-5'

    element.classList.add(delayClass)
  }

  requestAnimationFrame(() => {
    element.classList.add('animate-in')
  })
}

/**
 * 在浏览器环境下注册全局清理事件
 * 确保在页面卸载、路由变化时正确清理资源
 */
if (isBrowser) {
  window.addEventListener('pagehide', () => {
    cleanupResources()
  })

  window.addEventListener('animation-cleanup', () => {
    cleanupResources()
  })

  if (!(window as any).__animationCleanupRegistered) {
    ;(window as any).__animationCleanupRegistered = true

    window.addEventListener('popstate', () => {
      setTimeout(cleanupResources, 100)
    })
  }
}

/**
 * 批量处理元素动画
 * 通过批量处理来优化性能，避免频繁DOM操作
 *
 * @param elementsOrOptions - 要处理的元素数组或动画配置选项
 * @param animationClass - 要应用的动画类名
 */
export function batchProcessAnimations(
  elementsOrOptions: AnimationOptions | HTMLElement[],
  animationClass = 'animate-in'
) {
  if (!Array.isArray(elementsOrOptions)) {
    const selector = elementsOrOptions.selector || '.scroll-animate'
    const elements = document.querySelectorAll<HTMLElement>(
      `${selector}:not(.${animationClass})`
    )

    const elementsArray = Array.from(elements)
    if (!elementsArray.length) return

    if (getPendingRaf() !== null) {
      cancelAnimationFrame(getPendingRaf()!)
    }

    setPendingRaf(
      requestAnimationFrame(() => {
        const len = elementsArray.length
        for (let i = 0; i < len; i++) {
          elementsArray[i].classList.add(animationClass || 'animate-in')
        }
        setPendingRaf(null)
      })
    )
    return
  }

  const elements = elementsOrOptions
  if (!elements.length) return

  if (getPendingRaf() !== null) {
    cancelAnimationFrame(getPendingRaf()!)
  }

  setPendingRaf(
    requestAnimationFrame(() => {
      const len = elements.length
      for (let i = 0; i < len; i++) {
        elements[i].classList.add(animationClass)
      }
      setPendingRaf(null)
    })
  )
}

/**
 * 全局资源清理函数
 * 负责清理所有观察器和定时器，防止内存泄漏
 *
 * @param intersectionObserver - 要清理的交叉观察器实例
 * @param mutationObserver - 要清理的DOM变化观察器实例
 * @param resizeObserver - 要清理的尺寸变化观察器实例
 * @param animationTimers - 要清理的动画定时器集合
 */
export function cleanupResources(
  intersectionObserver?: IntersectionObserver | null,
  mutationObserver?: MutationObserver | null,
  resizeObserver?: null | ResizeObserver,
  animationTimers?: Map<string, null | ReturnType<typeof setTimeout>>
) {
  // 清理传入的观察器实例
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }

  if (mutationObserver) {
    mutationObserver.disconnect()
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  // 清理定时器
  if (animationTimers) {
    animationTimers.forEach(timer => {
      if (timer) clearTimeout(timer)
    })
    animationTimers.clear()
  }

  // 清理全局观察器实例
  const observer = getObserver()
  if (observer) {
    observer.disconnect()
    setObserver(null)
  }

  // 取消等待中的动画帧
  if (getPendingRaf() !== null) {
    cancelAnimationFrame(getPendingRaf()!)
    setPendingRaf(null)
  }

  // 执行所有注册的清理函数
  getCleanupListeners().forEach(cleanup => cleanup())
  setCleanupListeners([])

  // 重置状态
  setIsInitialized(false)
  setObservedElements(new WeakSet())
}

/**
 * 初始化动画系统
 * 设置观察器并开始监视DOM元素
 *
 * @param options - 动画系统配置选项
 * @returns 清理函数，用于停止观察并释放资源
 */
export function initAnimationSystem(options?: AnimationOptions): () => void {
  if (!isBrowser || !hasIO || !hasRAF) return () => {}

  if (getIsInitialized()) {
    cleanupResources()
  }

  // 解构配置，设置默认值
  const {
    animationClass = 'animate-in',
    baseDelayMs = 0,
    disableAutoDelay = false,
    rootMargin = '0px',
    selector = '.scroll-animate',
    threshold = 0.01
  } = options || {}

  /**
   * 交叉观察器回调函数
   * 当元素进入视口时处理动画
   */
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const toAnimate: HTMLElement[] = []
    const observedElements = getObservedElements()
    const observer = getObserver()

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement
        toAnimate.push(el)
        observer?.unobserve(el)
        observedElements.delete(el)
      }
    }

    if (toAnimate.length > 0) {
      batchProcessAnimations(toAnimate, animationClass)
    }
  }

  // 创建或重用observer
  if (!getObserver()) {
    setObserver(
      new IntersectionObserver(handleIntersection, {
        rootMargin,
        threshold
      })
    )
  }

  /**
   * 处理页面中的可动画元素
   * 查找符合条件的元素并设置观察
   */
  const processElements = () => {
    // 查询所有未应用动画的元素
    const elements = document.querySelectorAll<HTMLElement>(
      `${selector}:not(.${animationClass})`
    )
    if (!elements.length) return

    const observedElements = getObservedElements()
    const observer = getObserver()

    // 处理每个元素
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]

      // 避免重复观察
      if (observedElements.has(el)) continue

      // 标记为已观察
      observedElements.add(el)

      // 处理自动延迟
      if (!disableAutoDelay) {
        const hasCustomDelay =
          el.classList.contains('delay-100') ||
          el.classList.contains('delay-200') ||
          el.classList.contains('delay-300') ||
          el.classList.contains('delay-400') ||
          el.classList.contains('delay-500') ||
          el.classList.contains('delay-anim-1') ||
          el.classList.contains('delay-anim-2') ||
          el.classList.contains('delay-anim-3') ||
          el.classList.contains('delay-anim-4') ||
          el.classList.contains('delay-anim-5')

        if (!hasCustomDelay && baseDelayMs > 0) {
          const index = i % 5
          const delayClass = `delay-anim-${index + 1}`
          el.classList.add(delayClass)
        }
      }

      // 观察元素
      if (observer) {
        observer.observe(el)
      }
    }
  }

  // 初始化处理
  scheduleTask(processElements)

  // 设置DOM变化观察器，监听新添加的元素
  const mutationObserver = new MutationObserver(() => {
    // 使用防抖处理，避免频繁处理DOM变化
    scheduleTask(processElements, 50)
  })

  // 监视DOM变化，但只关注节点变化
  mutationObserver.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  })

  // 标记系统已初始化
  setIsInitialized(true)

  // 返回清理函数
  return () => {
    const observer = getObserver()
    if (observer) {
      observer.disconnect()
      setObserver(null)
    }

    if (getPendingRaf() !== null) {
      cancelAnimationFrame(getPendingRaf()!)
      setPendingRaf(null)
    }

    mutationObserver.disconnect()
    setIsInitialized(false)
    setObservedElements(new WeakSet())
  }
}

/**
 * 重置元素动画
 * 移除并重新添加动画类，使动画重新播放
 *
 * @param element - 要重置动画的HTML元素
 */
export function resetAnimation(element: HTMLElement): void {
  if (!isBrowser || !element) return

  if (element.classList.contains('animate-in')) {
    element.classList.remove('animate-in')

    setTimeout(() => {
      requestAnimationFrame(() => {
        element.classList.add('animate-in')
      })
    }, 10)
  }
}
