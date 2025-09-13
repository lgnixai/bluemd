/**
 * 简化的插件管理器
 * 用于 MVP 验证，专注于核心功能
 */

import { Plugin, PluginManager, PluginEventType } from '../types/plugin';

/**
 * 简化的插件管理器实现
 */
class PluginManagerImpl implements PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private eventListeners: Map<PluginEventType, Function[]> = new Map();

  /**
   * 注册插件
   */
  registerPlugin(plugin: Plugin): boolean {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already registered`);
      return false;
    }

    this.plugins.set(plugin.id, plugin);
    console.log(`Plugin ${plugin.id} registered successfully`);
    
    // 触发插件注册事件
    this.emit('plugin-installed', { pluginId: plugin.id, plugin });
    
    return true;
  }

  /**
   * 注销插件
   */
  unregisterPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found`);
      return false;
    }

    this.plugins.delete(pluginId);
    console.log(`Plugin ${pluginId} unregistered successfully`);
    
    // 触发插件注销事件
    this.emit('plugin-uninstalled', { pluginId, plugin });
    
    return true;
  }

  /**
   * 获取所有插件
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 根据ID获取插件
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * 获取已安装的插件
   */
  getInstalledPlugins(): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.config?.enabled);
  }

  /**
   * 获取已启用的插件
   */
  getEnabledPlugins(): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.config?.enabled);
  }

  /**
   * 安装插件
   */
  installPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found`);
      return false;
    }

    try {
      // 执行安装生命周期
      if (plugin.lifecycle?.onInstall) {
        plugin.lifecycle.onInstall();
      }

      // 标记为已安装
      if (!plugin.config) {
        plugin.config = {};
      }
      plugin.config.enabled = true;

      console.log(`Plugin ${pluginId} installed successfully`);
      
      // 触发插件安装事件
      this.emit('plugin-installed', { pluginId, plugin });
      
      return true;
    } catch (error) {
      console.error(`Failed to install plugin ${pluginId}:`, error);
      if (plugin.lifecycle?.onError) {
        plugin.lifecycle.onError(error as Error);
      }
      return false;
    }
  }

  /**
   * 卸载插件
   */
  uninstallPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found`);
      return false;
    }

    try {
      // 执行卸载生命周期
      if (plugin.lifecycle?.onUninstall) {
        plugin.lifecycle.onUninstall();
      }

      // 标记为未安装
      if (plugin.config) {
        plugin.config.enabled = false;
      }

      console.log(`Plugin ${pluginId} uninstalled successfully`);
      
      // 触发插件卸载事件
      this.emit('plugin-uninstalled', { pluginId, plugin });
      
      return true;
    } catch (error) {
      console.error(`Failed to uninstall plugin ${pluginId}:`, error);
      if (plugin.lifecycle?.onError) {
        plugin.lifecycle.onError(error as Error);
      }
      return false;
    }
  }

  /**
   * 启用插件
   */
  enablePlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found`);
      return false;
    }

    try {
      // 执行启用生命周期
      if (plugin.lifecycle?.onEnable) {
        plugin.lifecycle.onEnable();
      }

      // 标记为已启用
      if (!plugin.config) {
        plugin.config = {};
      }
      plugin.config.enabled = true;

      console.log(`Plugin ${pluginId} enabled successfully`);
      
      // 触发插件启用事件
      this.emit('plugin-enabled', { pluginId, plugin });
      
      return true;
    } catch (error) {
      console.error(`Failed to enable plugin ${pluginId}:`, error);
      if (plugin.lifecycle?.onError) {
        plugin.lifecycle.onError(error as Error);
      }
      return false;
    }
  }

  /**
   * 禁用插件
   */
  disablePlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found`);
      return false;
    }

    try {
      // 执行禁用生命周期
      if (plugin.lifecycle?.onDisable) {
        plugin.lifecycle.onDisable();
      }

      // 标记为已禁用
      if (plugin.config) {
        plugin.config.enabled = false;
      }

      console.log(`Plugin ${pluginId} disabled successfully`);
      
      // 触发插件禁用事件
      this.emit('plugin-disabled', { pluginId, plugin });
      
      return true;
    } catch (error) {
      console.error(`Failed to disable plugin ${pluginId}:`, error);
      if (plugin.lifecycle?.onError) {
        plugin.lifecycle.onError(error as Error);
      }
      return false;
    }
  }

  /**
   * 检查插件是否已安装
   */
  isPluginInstalled(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    return plugin ? (plugin.config?.enabled || false) : false;
  }

  /**
   * 检查插件是否已启用
   */
  isPluginEnabled(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    return plugin ? (plugin.config?.enabled || false) : false;
  }

  /**
   * 添加事件监听器
   */
  addEventListener(eventType: PluginEventType, listener: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  /**
   * 移除事件监听器
   */
  removeEventListener(eventType: PluginEventType, listener: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(eventType: PluginEventType, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in plugin event listener for ${eventType}:`, error);
        }
      });
    }
  }
}

// 创建全局插件管理器实例
export const pluginManager = new PluginManagerImpl();

// 导出类型
export type { PluginManager };
