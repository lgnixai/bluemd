/**
 * 插件类型定义
 * 定义插件相关的TypeScript类型
 */

// 插件状态接口
export interface PluginState {
  enabled: boolean
  data: any
  loading: boolean
  error: string | null
}

// 插件操作接口
export interface PluginActions {
  initialize: () => Promise<void>
  performAction: () => Promise<void>
  toggle: () => void
  reset: () => void
  updateData: (data: any) => void
  setError: (error: string | null) => void
}

// 插件配置接口
export interface PluginConfig {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  autoStart: boolean
  notifications: boolean
  [key: string]: any
}

// 插件数据接口
export interface PluginData {
  id: string
  timestamp: string
  type: string
  payload: any
}

// 插件事件接口
export interface PluginEvent {
  type: string
  data: any
  timestamp: string
}

// 插件API接口
export interface PluginAPI {
  // 数据操作
  getData: (key: string) => Promise<any>
  setData: (key: string, value: any) => Promise<void>
  deleteData: (key: string) => Promise<void>
  
  // 事件系统
  emit: (event: string, data: any) => void
  on: (event: string, callback: (data: any) => void) => void
  off: (event: string, callback: (data: any) => void) => void
  
  // UI操作
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  openModal: (component: React.ComponentType, props?: any) => void
  closeModal: () => void
  
  // 路由操作
  navigate: (path: string) => void
  getCurrentPath: () => string
  
  // 权限检查
  hasPermission: (permission: string) => boolean
  requestPermission: (permission: string) => Promise<boolean>
}

// 插件生命周期接口
export interface PluginLifecycle {
  onInstall?: () => void | Promise<void>
  onUninstall?: () => void | Promise<void>
  onEnable?: () => void | Promise<void>
  onDisable?: () => void | Promise<void>
  onUpdate?: (oldVersion: string, newVersion: string) => void | Promise<void>
  onError?: (error: Error) => void
}

// 插件依赖接口
export interface PluginDependency {
  id: string
  version: string
  required: boolean
}

// 插件权限接口
export interface PluginPermission {
  id: string
  description: string
  required: boolean
}

// 插件路由接口
export interface PluginRoute {
  path: string
  component: string
  title: string
  icon?: string
  hidden?: boolean
  permissions?: string[]
}

// 插件菜单接口
export interface PluginMenuItem {
  id: string
  label: string
  icon: string
  action: 'navigate' | 'function' | 'modal'
  path?: string
  function?: string
  permissions?: string[]
  children?: PluginMenuItem[]
}

// 插件设置接口
export interface PluginSetting {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea'
  value: any
  options?: { label: string; value: any }[]
  description?: string
  required?: boolean
  validation?: (value: any) => boolean | string
}

// 插件主题接口
export interface PluginTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    accent: string
  }
  fonts: {
    primary: string
    secondary: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// 插件国际化接口
export interface PluginI18n {
  [locale: string]: {
    [key: string]: string
  }
}

// 插件导出接口
export interface PluginExport {
  config: any
  component: React.ComponentType
  hooks?: { [key: string]: any }
  utils?: { [key: string]: any }
  types?: { [key: string]: any }
}

