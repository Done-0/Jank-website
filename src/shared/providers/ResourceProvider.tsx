'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo
} from 'react'

// Types
type CleanupFn = () => void
type ResKey = string | number

enum ResType {
  TIMEOUT = 'timeout',
  INTERVAL = 'interval',
  OBSERVER = 'observer',
  EVENT = 'event',
  OTHER = 'other'
}

interface ResourceItem {
  cleanup: CleanupFn
  type: ResType
  timestamp: number
}

interface ResourceContext {
  register: (key: ResKey, cleanup: CleanupFn, type?: ResType) => void
  unregister: (key: ResKey) => void
  cleanup: (prefix?: string) => void
  timeout: (fn: Function, ms: number, id?: string) => any
  interval: (fn: Function, ms: number, id?: string) => any
  observe: (
    target: Node,
    callback: MutationCallback,
    options: MutationObserverInit,
    id?: string
  ) => MutationObserver
  listen: <T extends EventTarget>(
    target: T,
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
    id?: string
  ) => () => void
  count: () => number
}

// Constants
const MEMORY_THRESHOLD = 300 // 资源数量基础清理阈值：超过此值触发内存压力清理
const IDLE_THRESHOLD = 180000 // 资源闲置时间阈值：3分钟未使用的资源可被清理
const LOW_MEMORY_THRESHOLD = 800 // 内存警告解除阈值：资源数低于此值时解除警告状态
const HIGH_MEMORY_THRESHOLD = 1000 // 内存警告触发阈值：资源数超过此值时触发警告日志
const CLEANUP_CYCLE = 10 // 深度清理周期：每10次常规清理执行1次深度清理
const CLEANUP_INTERVAL = 60000 // 定期清理间隔：每1分钟执行一次检查清理
let idCounter = 1 // 资源ID计数器：用于生成唯一资源标识
let currentCompId: string | null = null // 当前组件ID：跟踪资源归属的组件上下文

const isProd = process.env.NODE_ENV === 'production'
const isVerboseLogging = !isProd

const ResContext = createContext<ResourceContext | null>(null)

export function ResourceProvider({ children }: { children: React.ReactNode }) {
  const state = useRef({
    resources: new Map<ResKey, ResourceItem>(),
    stats: {
      [ResType.TIMEOUT]: 0,
      [ResType.INTERVAL]: 0,
      [ResType.OBSERVER]: 0,
      [ResType.EVENT]: 0,
      [ResType.OTHER]: 0
    },
    initialized: false,
    lastCleanup: Date.now(),
    memWarning: false,
    cleanupCount: 0,
    timeoutPattern: `:${ResType.TIMEOUT}`,
    eventPattern: `:${ResType.EVENT}`
  })

  const getResourceId = useCallback(
    (prefix = 'res') => `${prefix}:${idCounter++}`,
    []
  )

  const register = useCallback(
    (key: ResKey, cleanup: CleanupFn, type: ResType = ResType.OTHER) => {
      const s = state.current

      if (s.resources.has(key)) {
        try {
          const old = s.resources.get(key)!
          old.cleanup()
          s.stats[old.type]--
        } catch {}
      }

      s.resources.set(key, { cleanup, type, timestamp: Date.now() })
      s.stats[type]++

      if (!s.memWarning && s.resources.size > HIGH_MEMORY_THRESHOLD) {
        if (!isProd)
          console.warn(`Memory pressure: ${s.resources.size} resources`)
        s.memWarning = true
      }
    },
    []
  )

  const unregister = useCallback((key: ResKey) => {
    const s = state.current
    if (!s.resources.has(key)) return

    try {
      const item = s.resources.get(key)!
      item.cleanup()
      s.stats[item.type]--
      s.resources.delete(key)

      if (s.memWarning && s.resources.size < LOW_MEMORY_THRESHOLD)
        s.memWarning = false
    } catch {
      s.resources.delete(key)
    }
  }, [])

  const count = useCallback(() => state.current.resources.size, [])

  const cleanup = useCallback((prefix?: string) => {
    const s = state.current
    const now = Date.now()

    if (prefix) {
      const keysToClean: ResKey[] = []
      s.resources.forEach((_, key) => {
        if (typeof key === 'string' && key.startsWith(prefix))
          keysToClean.push(key)
      })

      for (let i = 0; i < keysToClean.length; i++) {
        const key = keysToClean[i]
        try {
          const item = s.resources.get(key)!
          item.cleanup()
          s.stats[item.type]--
          s.resources.delete(key)
        } catch {
          s.resources.delete(key)
        }
      }
    } else {
      const entries = Array.from(s.resources.entries())
      for (let i = 0; i < entries.length; i++) {
        try {
          entries[i][1].cleanup()
        } catch {}
      }

      Object.keys(s.stats).forEach(t => (s.stats[t as ResType] = 0))
      s.resources.clear()
      s.memWarning = false
    }

    s.lastCleanup = now
  }, [])

  const timeout = useCallback(
    (fn: Function, ms: number, id?: string): any => {
      const prefix = id || currentCompId || 'global'
      const key = getResourceId(`${prefix}:${ResType.TIMEOUT}`)

      const timeoutId = setTimeout(() => {
        try {
          unregister(key)
          fn()
        } catch (e) {
          unregister(key)
          throw e
        }
      }, ms)

      register(key, () => clearTimeout(timeoutId), ResType.TIMEOUT)
      return timeoutId
    },
    [register, unregister, getResourceId]
  )

  const interval = useCallback(
    (fn: Function, ms: number, id?: string): any => {
      const prefix = id || currentCompId || 'global'
      const key = getResourceId(`${prefix}:${ResType.INTERVAL}`)

      const intervalId = setInterval(() => {
        try {
          fn()
        } catch {}
      }, ms)

      register(key, () => clearInterval(intervalId), ResType.INTERVAL)
      return intervalId
    },
    [register, getResourceId]
  )

  const observe = useCallback(
    (
      target: Node,
      callback: MutationCallback,
      options: MutationObserverInit,
      id?: string
    ): MutationObserver => {
      const prefix = id || currentCompId || 'global'
      const key = getResourceId(`${prefix}:${ResType.OBSERVER}`)

      const observer = new MutationObserver((mutations, observer) => {
        try {
          callback(mutations, observer)
        } catch {}
      })

      observer.observe(target, options)
      register(key, () => observer.disconnect(), ResType.OBSERVER)
      return observer
    },
    [register, getResourceId]
  )

  const listen = useCallback(
    <T extends EventTarget>(
      target: T,
      event: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
      id?: string
    ): (() => void) => {
      const prefix = id || currentCompId || 'global'
      const key = getResourceId(`${prefix}:${ResType.EVENT}:${event}`)

      let wrappedListener: EventListenerOrEventListenerObject
      if (typeof listener === 'function') {
        wrappedListener = (e: Event) => {
          try {
            ;(listener as EventListener)(e)
          } catch {}
        }
      } else {
        wrappedListener = {
          handleEvent(e: Event) {
            try {
              listener.handleEvent.call(listener, e)
            } catch {}
          }
        }
      }

      target.addEventListener(event, wrappedListener, options)
      const cleanupFn = () =>
        target.removeEventListener(event, wrappedListener, options)
      register(key, cleanupFn, ResType.EVENT)
      return cleanupFn
    },
    [register, getResourceId]
  )

  const runCleanup = useCallback(() => {
    const s = state.current
    const now = Date.now()
    const resourceCount = s.resources.size
    s.cleanupCount = (s.cleanupCount + 1) % CLEANUP_CYCLE

    const isMemPressure = resourceCount > MEMORY_THRESHOLD
    const isDeepCleanup = s.cleanupCount === 0

    if (isMemPressure || isDeepCleanup) {
      const { timeoutPattern, eventPattern } = s
      const timeoutKeys: ResKey[] = []
      const eventKeys: ResKey[] = []
      const threshold = isDeepCleanup ? IDLE_THRESHOLD / 2 : IDLE_THRESHOLD

      s.resources.forEach((item, key) => {
        if (now - item.timestamp <= threshold) return

        if (typeof key === 'string') {
          if (key.includes(timeoutPattern)) {
            timeoutKeys.push(key)
          } else if (isDeepCleanup && key.includes(eventPattern)) {
            eventKeys.push(key)
          }
        }
      })

      const hasItemsToClean = timeoutKeys.length > 0 || eventKeys.length > 0

      if (isVerboseLogging && hasItemsToClean) {
        console.log(
          `Resource cleanup: ${timeoutKeys.length} timeouts, ${eventKeys.length} events`
        )
      }

      if (hasItemsToClean) {
        for (let i = 0; i < timeoutKeys.length; i++) unregister(timeoutKeys[i])
        for (let i = 0; i < eventKeys.length; i++) unregister(eventKeys[i])
      }
    }

    s.lastCleanup = now
  }, [unregister])

  useEffect(() => {
    const s = state.current

    if (!s.initialized) {
      s.initialized = true
      runCleanup()

      const cleanupInterval = setInterval(runCleanup, CLEANUP_INTERVAL)

      if (typeof document !== 'undefined') {
        const visibilityHandler = () => {
          if (document.visibilityState === 'visible') runCleanup()
        }
        document.addEventListener('visibilitychange', visibilityHandler)

        return () => {
          clearInterval(cleanupInterval)
          document.removeEventListener('visibilitychange', visibilityHandler)
        }
      }
      return () => clearInterval(cleanupInterval)
    }
    return () => cleanup()
  }, [cleanup, runCleanup])

  const contextValue = useMemo(
    () => ({
      register,
      unregister,
      cleanup,
      timeout,
      interval,
      observe,
      listen,
      count
    }),
    [register, unregister, cleanup, timeout, interval, observe, listen, count]
  )

  return (
    <ResContext.Provider value={contextValue}>{children}</ResContext.Provider>
  )
}

export function useResources() {
  const context = useContext(ResContext)
  if (!context)
    throw new Error('useResources must be used within ResourceProvider')
  return context
}

export function setComponentId(id: string | null) {
  currentCompId = id
}

export function getComponentId(): string | null {
  return currentCompId
}

export function useComponentResources(id: string) {
  const resources = useResources()

  useEffect(() => {
    const prevId = getComponentId()
    setComponentId(id)
    return () => {
      setComponentId(prevId)
      resources.cleanup(id)
    }
  }, [id, resources])

  return useMemo(
    () => ({
      register: (key: string, fn: CleanupFn) =>
        resources.register(`${id}:${key}`, fn),
      unregister: (key: string) => resources.unregister(`${id}:${key}`),
      cleanup: () => resources.cleanup(id),
      setTimeout: (fn: Function, ms: number) => resources.timeout(fn, ms, id),
      setInterval: (fn: Function, ms: number) => resources.interval(fn, ms, id),
      createObserver: (
        target: Node,
        callback: MutationCallback,
        options: MutationObserverInit
      ) => resources.observe(target, callback, options, id),
      addEventListener: <T extends EventTarget>(
        target: T,
        event: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
      ) => resources.listen(target, event, listener, options, id)
    }),
    [id, resources]
  )
}

interface MonitorOptions {
  monitorResize?: boolean
  monitorDOMChanges?: boolean
  monitorTimeouts?: boolean
  debug?: boolean
}

export function useResourceMonitor(id: string, options: MonitorOptions = {}) {
  const {
    monitorResize = true,
    monitorDOMChanges = true,
    monitorTimeouts = true,
    debug = false
  } = options

  const resources = useComponentResources(id)
  const ref = useRef<HTMLElement | null>(null)
  const debugEnabled = useRef(debug && isVerboseLogging)

  const log = useCallback(
    (message: string, ...args: any[]) => {
      if (debugEnabled.current) {
        console.log(`[RM:${id}] ${message}`, ...args)
      }
    },
    [id]
  )

  useEffect(() => {
    debugEnabled.current = debug && isVerboseLogging
    if (typeof window === 'undefined') return

    if (monitorResize) {
      let timer: number | null = null
      const RESIZE_DELAY = 200

      resources.addEventListener(
        window,
        'resize',
        () => {
          if (timer) window.clearTimeout(timer)
          timer = window.setTimeout(() => {
            debugEnabled.current && log('Resized')
            timer = null
          }, RESIZE_DELAY)
        },
        { passive: true }
      )
    }

    if (monitorDOMChanges && typeof document !== 'undefined') {
      const target = ref.current || document.body
      if (target) {
        resources.createObserver(
          target,
          mutations => {
            if (!debugEnabled.current) return

            let added = 0,
              removed = 0
            for (let i = 0; i < mutations.length; i++) {
              added += mutations[i].addedNodes.length
              removed += mutations[i].removedNodes.length
            }

            if (added > 0 || removed > 0) log(`DOM: +${added}/-${removed}`)
          },
          {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
          }
        )
      }
    }
  }, [
    id,
    monitorResize,
    monitorDOMChanges,
    monitorTimeouts,
    debug,
    resources,
    log
  ])

  return useMemo(
    () => ({
      ref,
      cleanup: resources.cleanup,
      debug: (on = true) => {
        debugEnabled.current = on && isVerboseLogging
      }
    }),
    [resources.cleanup, log]
  )
}

export function useGlobalResourceMonitor(options: MonitorOptions = {}) {
  return useResourceMonitor('GlobalRM', {
    ...options,
    monitorResize: true,
    monitorDOMChanges: true,
    monitorTimeouts: true
  })
}

export function ResourceMonitor({ children }: { children: React.ReactNode }) {
  useGlobalResourceMonitor({
    debug: isVerboseLogging
  })
  return <>{children}</>
}

export function withAutoResources<P extends {}>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component'
  const resourceId = componentName || displayName

  const WrappedComponent: React.FC<P> = props => {
    useComponentResources(resourceId)
    return <Component {...props} />
  }

  WrappedComponent.displayName = `withAutoResources(${displayName})`
  return WrappedComponent
}
