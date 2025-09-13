import { Plugin, PluginManager, PluginEvent, PluginEventType } from '../types/plugin';
import { useContext } from 'react';
import { PluginContext } from '../contexts/plugin-context';

/**
 * 插件管理器实现
 */
class PluginManagerImpl implements PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private eventListeners: Map<PluginEventType, Set<(event: PluginEvent) => void>> = new Map();

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * 初始化事件监听器
   */
  private initializeEventListeners() {
    const eventTypes: PluginEventType[] = [
      'plugin-installed',
      'plugin-uninstalled',
      'plugin-enabled',
      'plugin-disabled',
      'plugin-activated',
      'plugin-deactivated'
    ];

    eventTypes.forEach(eventType => {
      this.eventListeners.set(eventType, new Set());
    });
  }

  /**
   * 注册插件
   */
  registerPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already registered`);
      return;
    }

    this.plugins.set(plugin.id, plugin);
    console.log(`Plugin ${plugin.id} registered successfully`);
  }

  /**
   * 卸载插件
   */
  unregisterPlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found`);
      return;
    }

    // 如果插件已安装，先卸载
    if (plugin.installed) {
      this.uninstallPlugin(pluginId);
    }

    this.plugins.delete(pluginId);
    console.log(`Plugin ${pluginId} unregistered successfully`);
  }

  /**
   * 获取所有插件
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 获取已安装的插件
   */
  getInstalledPlugins(): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.installed);
  }

  /**
   * 获取启用的插件
   */
  getEnabledPlugins(): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.enabled);
  }

  /**
   * 安装插件
   */
  installPlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found`);
      return;
    }

    if (plugin.installed) {
      console.warn(`Plugin ${pluginId} is already installed`);
      return;
    }

    plugin.installed = true;
    this.emitEvent('plugin-installed', pluginId, plugin);
    console.log(`Plugin ${pluginId} installed successfully`);
  }

  /**
   * 卸载插件
   */
  uninstallPlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found`);
      return;
    }

    if (!plugin.installed) {
      console.warn(`Plugin ${pluginId} is not installed`);
      return;
    }

    // 如果插件已启用，先禁用
    if (plugin.enabled) {
      this.disablePlugin(pluginId);
    }

    plugin.installed = false;
    this.emitEvent('plugin-uninstalled', pluginId, plugin);
    console.log(`Plugin ${pluginId} uninstalled successfully`);
  }

  /**
   * 启用插件
   */
  enablePlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found`);
      return;
    }

    if (!plugin.installed) {
      console.warn(`Plugin ${pluginId} is not installed`);
      return;
    }

    if (plugin.enabled) {
      console.warn(`Plugin ${pluginId} is already enabled`);
      return;
    }

    plugin.enabled = true;
    this.emitEvent('plugin-enabled', pluginId, plugin);
    console.log(`Plugin ${pluginId} enabled successfully`);
  }

  /**
   * 禁用插件
   */
  disablePlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found`);
      return;
    }

    if (!plugin.enabled) {
      console.warn(`Plugin ${pluginId} is already disabled`);
      return;
    }

    plugin.enabled = false;
    this.emitEvent('plugin-disabled', pluginId, plugin);
    console.log(`Plugin ${pluginId} disabled successfully`);
  }

  /**
   * 获取插件
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * 检查插件是否已安装
   */
  isPluginInstalled(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    return plugin ? plugin.installed : false;
  }

  /**
   * 检查插件是否已启用
   */
  isPluginEnabled(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    return plugin ? plugin.enabled : false;
  }

  /**
   * 触发插件事件
   */
  private emitEvent(eventType: PluginEventType, pluginId: string, plugin?: Plugin): void {
    const event: PluginEvent = {
      type: eventType,
      pluginId,
      plugin,
      timestamp: Date.now()
    };

    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in plugin event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * 添加事件监听器
   */
  onEvent(eventType: PluginEventType, callback: (event: PluginEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.add(callback);
    }
  }

  /**
   * 移除事件监听器
   */
  offEvent(eventType: PluginEventType, callback: (event: PluginEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }
}

// 创建全局插件管理器实例
export const pluginManager = new PluginManagerImpl();

/**
 * 插件管理器Hook
 */
export const usePluginManager = (): PluginManager => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginManager must be used within a PluginProvider');
  }
  return context.pluginManager;
};

// 导出类型
export type { PluginManager };
