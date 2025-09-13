/**
 * 插件工具函数
 * 提供插件开发中常用的工具函数
 */

// 生成唯一ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// 格式化时间
export const formatTime = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (typeof obj === 'object') {
    const clonedObj = {} as any
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// 验证邮箱
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 获取文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 颜色工具
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// 生成随机颜色
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

// 存储工具
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

// 事件发射器
export class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function): void {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(...args))
  }

  once(event: string, callback: Function): void {
    const onceCallback = (...args: any[]) => {
      callback(...args)
      this.off(event, onceCallback)
    }
    this.on(event, onceCallback)
  }
}

// 插件状态管理
export class PluginStateManager {
  private state: { [key: string]: any } = {}
  private listeners: { [key: string]: Function[] } = {}

  getState(key: string): any {
    return this.state[key]
  }

  setState(key: string, value: any): void {
    const oldValue = this.state[key]
    this.state[key] = value
    
    // 通知监听器
    if (this.listeners[key]) {
      this.listeners[key].forEach(listener => listener(value, oldValue))
    }
  }

  subscribe(key: string, callback: Function): () => void {
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    this.listeners[key].push(callback)
    
    // 返回取消订阅函数
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback)
    }
  }
}

export default {
  generateId,
  formatTime,
  debounce,
  throttle,
  deepClone,
  validateEmail,
  validateUrl,
  formatFileSize,
  hexToRgb,
  generateRandomColor,
  storage,
  EventEmitter,
  PluginStateManager
}

