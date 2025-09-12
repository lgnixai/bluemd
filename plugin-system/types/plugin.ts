import { ReactNode } from 'react';

/**
 * 插件接口定义
 */
export interface Plugin {
  /** 插件唯一标识符 */
  id: string;
  /** 插件名称 */
  name: string;
  /** 插件描述 */
  description?: string;
  /** 插件版本 */
  version: string;
  /** 插件作者 */
  author?: string;
  /** 插件图标组件 */
  icon: ReactNode;
  /** 插件是否已安装 */
  installed: boolean;
  /** 插件是否启用 */
  enabled: boolean;
  /** 插件配置 */
  config?: PluginConfig;
  /** 插件内容组件 */
  content: React.ComponentType<PluginContentProps>;
  /** 插件初始化函数 */
  initialize?: () => void | Promise<void>;
  /** 插件清理函数 */
  cleanup?: () => void | Promise<void>;
}

/**
 * 插件配置接口
 */
export interface PluginConfig {
  /** 插件在导航栏中的位置 */
  position?: number;
  /** 插件是否显示在导航栏中 */
  showInNav?: boolean;
  /** 插件自定义样式 */
  styles?: Record<string, any>;
  /** 插件权限 */
  permissions?: string[];
}

/**
 * 插件内容组件属性
 */
export interface PluginContentProps {
  /** 插件实例 */
  plugin: Plugin;
  /** 是否激活状态 */
  active: boolean;
  /** 关闭插件内容 */
  onClose: () => void;
}

/**
 * 插件管理器接口
 */
export interface PluginManager {
  /** 注册插件 */
  registerPlugin: (plugin: Plugin) => void;
  /** 卸载插件 */
  unregisterPlugin: (pluginId: string) => void;
  /** 获取所有插件 */
  getPlugins: () => Plugin[];
  /** 获取已安装的插件 */
  getInstalledPlugins: () => Plugin[];
  /** 获取启用的插件 */
  getEnabledPlugins: () => Plugin[];
  /** 安装插件 */
  installPlugin: (pluginId: string) => void;
  /** 卸载插件 */
  uninstallPlugin: (pluginId: string) => void;
  /** 启用插件 */
  enablePlugin: (pluginId: string) => void;
  /** 禁用插件 */
  disablePlugin: (pluginId: string) => void;
  /** 获取插件 */
  getPlugin: (pluginId: string) => Plugin | undefined;
  /** 检查插件是否已安装 */
  isPluginInstalled: (pluginId: string) => boolean;
  /** 检查插件是否已启用 */
  isPluginEnabled: (pluginId: string) => boolean;
}

/**
 * 插件事件类型
 */
export type PluginEventType = 
  | 'plugin-installed'
  | 'plugin-uninstalled'
  | 'plugin-enabled'
  | 'plugin-disabled'
  | 'plugin-activated'
  | 'plugin-deactivated';

/**
 * 插件事件
 */
export interface PluginEvent {
  type: PluginEventType;
  pluginId: string;
  plugin?: Plugin;
  timestamp: number;
}

/**
 * 插件上下文接口
 */
export interface PluginContext {
  /** 插件管理器 */
  pluginManager: PluginManager;
  /** 当前激活的插件 */
  activePlugin: Plugin | null;
  /** 设置激活的插件 */
  setActivePlugin: (plugin: Plugin | null) => void;
  /** 插件事件监听器 */
  onPluginEvent: (eventType: PluginEventType, callback: (event: PluginEvent) => void) => void;
  /** 移除插件事件监听器 */
  offPluginEvent: (eventType: PluginEventType, callback: (event: PluginEvent) => void) => void;
}
