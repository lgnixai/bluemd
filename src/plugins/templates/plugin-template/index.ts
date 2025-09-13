/**
 * 插件入口文件
 * 导出插件的所有公共接口
 */

export { default as PluginComponent } from './components/PluginComponent'
export { default as PluginConfig } from './config/plugin.config'
export { default as PluginIcon } from './assets/plugin-icon'
export * from './types/plugin.types'
export * from './hooks/usePlugin'
