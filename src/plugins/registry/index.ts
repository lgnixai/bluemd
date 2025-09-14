/**
 * 插件注册表
 * 管理所有已安装的插件
 */

import { Plugin } from '@/types/plugin'
import { pluginManager } from '@/lib/plugin-manager'

// 导入所有插件
import { pluginConfig as templatePluginConfig } from '../templates/plugin-template/config/plugin.config'

/**
 * 插件注册表
 */
export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map()
  private installedPlugins: Set<string> = new Set()

  constructor() {
    this.initializeDefaultPlugins()
  }

  /**
   * 初始化默认插件
   */
  private initializeDefaultPlugins() {
    // 注册模板插件（仅用于开发）
    this.registerPlugin(templatePluginConfig)
  }

  /**
   * 注册插件
   */
  registerPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`插件 ${plugin.id} 已经注册`)
      return
    }

    this.plugins.set(plugin.id, plugin)
    console.log(`插件 ${plugin.id} 注册成功`)
  }

  /**
   * 卸载插件
   */
  unregisterPlugin(pluginId: string): void {
    if (!this.plugins.has(pluginId)) {
      console.warn(`插件 ${pluginId} 未找到`)
      return
    }

    // 如果插件已安装，先卸载
    if (this.installedPlugins.has(pluginId)) {
      this.uninstallPlugin(pluginId)
    }

    this.plugins.delete(pluginId)
    console.log(`插件 ${pluginId} 卸载成功`)
  }

  /**
   * 安装插件
   */
  installPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      console.error(`插件 ${pluginId} 未找到`)
      return false
    }

    if (this.installedPlugins.has(pluginId)) {
      console.warn(`插件 ${pluginId} 已经安装`)
      return false
    }

    try {
      // 检查依赖
      if (!this.checkDependencies(plugin)) {
        console.error(`插件 ${pluginId} 依赖检查失败`)
        return false
      }

      // 执行安装生命周期
      if (plugin.lifecycle?.onInstall) {
        plugin.lifecycle.onInstall()
      }

      // 注册到插件管理器
      pluginManager.registerPlugin(plugin)

      this.installedPlugins.add(pluginId)
      console.log(`插件 ${pluginId} 安装成功`)
      return true
    } catch (error) {
      console.error(`插件 ${pluginId} 安装失败:`, error)
      return false
    }
  }

  /**
   * 卸载插件
   */
  uninstallPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      console.error(`插件 ${pluginId} 未找到`)
      return false
    }

    if (!this.installedPlugins.has(pluginId)) {
      console.warn(`插件 ${pluginId} 未安装`)
      return false
    }

    try {
      // 执行卸载生命周期
      if (plugin.lifecycle?.onUninstall) {
        plugin.lifecycle.onUninstall()
      }

      // 从插件管理器移除
      pluginManager.unregisterPlugin(pluginId)

      this.installedPlugins.delete(pluginId)
      console.log(`插件 ${pluginId} 卸载成功`)
      return true
    } catch (error) {
      console.error(`插件 ${pluginId} 卸载失败:`, error)
      return false
    }
  }

  /**
   * 启用插件
   */
  enablePlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      console.error(`插件 ${pluginId} 未找到`)
      return false
    }

    if (!this.installedPlugins.has(pluginId)) {
      console.error(`插件 ${pluginId} 未安装`)
      return false
    }

    try {
      // 执行启用生命周期
      if (plugin.lifecycle?.onEnable) {
        plugin.lifecycle.onEnable()
      }

      pluginManager.enablePlugin(pluginId)
      console.log(`插件 ${pluginId} 启用成功`)
      return true
    } catch (error) {
      console.error(`插件 ${pluginId} 启用失败:`, error)
      return false
    }
  }

  /**
   * 禁用插件
   */
  disablePlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      console.error(`插件 ${pluginId} 未找到`)
      return false
    }

    if (!this.installedPlugins.has(pluginId)) {
      console.error(`插件 ${pluginId} 未安装`)
      return false
    }

    try {
      // 执行禁用生命周期
      if (plugin.lifecycle?.onDisable) {
        plugin.lifecycle.onDisable()
      }

      pluginManager.disablePlugin(pluginId)
      console.log(`插件 ${pluginId} 禁用成功`)
      return true
    } catch (error) {
      console.error(`插件 ${pluginId} 禁用失败:`, error)
      return false
    }
  }

  /**
   * 检查插件依赖
   */
  private checkDependencies(plugin: Plugin): boolean {
    if (!plugin.config?.dependencies || plugin.config.dependencies.length === 0) {
      return true
    }

    for (const dependency of plugin.config.dependencies) {
      if (!this.installedPlugins.has(dependency)) {
        console.error(`插件 ${plugin.id} 缺少依赖: ${dependency}`)
        return false
      }
    }

    return true
  }

  /**
   * 获取所有插件
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * 获取已安装的插件
   */
  getInstalledPlugins(): Plugin[] {
    return Array.from(this.installedPlugins)
      .map(id => this.plugins.get(id))
      .filter(Boolean) as Plugin[]
  }

  /**
   * 获取已启用的插件
   */
  getEnabledPlugins(): Plugin[] {
    return this.getInstalledPlugins().filter(plugin => 
      pluginManager.isPluginEnabled(plugin.id)
    )
  }

  /**
   * 根据分类获取插件
   */
  getPluginsByCategory(category: string): Plugin[] {
    return this.getAllPlugins().filter(plugin => plugin.category === category)
  }

  /**
   * 搜索插件
   */
  searchPlugins(query: string): Plugin[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllPlugins().filter(plugin => 
      plugin.name.toLowerCase().includes(lowerQuery) ||
      plugin.description.toLowerCase().includes(lowerQuery) ||
      plugin.author.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * 获取插件信息
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId)
  }

  /**
   * 检查插件是否已安装
   */
  isPluginInstalled(pluginId: string): boolean {
    return this.installedPlugins.has(pluginId)
  }

  /**
   * 检查插件是否已启用
   */
  isPluginEnabled(pluginId: string): boolean {
    return this.isPluginInstalled(pluginId) && pluginManager.isPluginEnabled(pluginId)
  }

  /**
   * 获取插件统计信息
   */
  getPluginStats() {
    const total = this.plugins.size
    const installed = this.installedPlugins.size
    const enabled = this.getEnabledPlugins().length

    return {
      total,
      installed,
      enabled,
      disabled: installed - enabled,
      uninstalled: total - installed
    }
  }
}

// 创建全局插件注册表实例
export const pluginRegistry = new PluginRegistry()

// 导出便捷方法
export const {
  registerPlugin,
  unregisterPlugin,
  installPlugin,
  uninstallPlugin,
  enablePlugin,
  disablePlugin,
  getAllPlugins,
  getInstalledPlugins,
  getEnabledPlugins,
  getPluginsByCategory,
  searchPlugins,
  getPlugin,
  isPluginInstalled,
  isPluginEnabled,
  getPluginStats
} = pluginRegistry

export default pluginRegistry
