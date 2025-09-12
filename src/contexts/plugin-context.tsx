import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plugin, PluginContext, PluginEvent, PluginEventType } from '@/types/plugin';
import { pluginManager } from '@/lib/plugin-manager';

const PluginContextInstance = createContext<PluginContext | null>(null);

interface PluginProviderProps {
  children: ReactNode;
}

/**
 * 插件上下文提供者
 */
export const PluginProvider: React.FC<PluginProviderProps> = ({ children }) => {
  const [activePlugin, setActivePlugin] = useState<Plugin | null>(null);
  const [, setPlugins] = useState<Plugin[]>([]);

  // 初始化插件列表
  useEffect(() => {
    setPlugins(pluginManager.getPlugins());
  }, []);

  // 监听插件事件
  useEffect(() => {
    const handlePluginEvent = (event: PluginEvent) => {
      console.log('Plugin event:', event);
      
      // 如果当前激活的插件被禁用或卸载，清除激活状态
      if (activePlugin && event.pluginId === activePlugin.id) {
        if (event.type === 'plugin-disabled' || event.type === 'plugin-uninstalled') {
          setActivePlugin(null);
        }
      }

      // 更新插件列表
      setPlugins(pluginManager.getPlugins());
    };

    // 注册所有事件类型的监听器
    const eventTypes: PluginEventType[] = [
      'plugin-installed',
      'plugin-uninstalled',
      'plugin-enabled',
      'plugin-disabled',
      'plugin-activated',
      'plugin-deactivated'
    ];

    eventTypes.forEach(eventType => {
      pluginManager.onEvent(eventType, handlePluginEvent);
    });

    // 清理函数
    return () => {
      eventTypes.forEach(eventType => {
        pluginManager.offEvent(eventType, handlePluginEvent);
      });
    };
  }, [activePlugin]);

  // 插件事件监听器管理
  const onPluginEvent = (eventType: PluginEventType, callback: (event: PluginEvent) => void) => {
    pluginManager.onEvent(eventType, callback);
  };

  const offPluginEvent = (eventType: PluginEventType, callback: (event: PluginEvent) => void) => {
    pluginManager.offEvent(eventType, callback);
  };

  const contextValue: PluginContext = {
    pluginManager,
    activePlugin,
    setActivePlugin,
    onPluginEvent,
    offPluginEvent
  };

  return (
    <PluginContextInstance.Provider value={contextValue}>
      {children}
    </PluginContextInstance.Provider>
  );
};

/**
 * 使用插件上下文的钩子
 */
export const usePlugin = (): PluginContext => {
  const context = useContext(PluginContextInstance);
  if (!context) {
    throw new Error('usePlugin must be used within a PluginProvider');
  }
  return context;
};

/**
 * 使用插件管理器的钩子
 */
export const usePluginManager = () => {
  const { pluginManager } = usePlugin();
  return pluginManager;
};

/**
 * 使用当前激活插件的钩子
 */
export const useActivePlugin = () => {
  const { activePlugin, setActivePlugin } = usePlugin();
  return { activePlugin, setActivePlugin };
};

/**
 * 使用插件列表的钩子
 */
export const usePlugins = () => {
  const { pluginManager } = usePlugin();
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    setPlugins(pluginManager.getPlugins());
  }, []);

  return plugins;
};

/**
 * 使用已安装插件的钩子
 */
export const useInstalledPlugins = () => {
  const { pluginManager } = usePlugin();
  const [installedPlugins, setInstalledPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    setInstalledPlugins(pluginManager.getInstalledPlugins());
  }, []);

  return installedPlugins;
};

/**
 * 使用启用插件的钩子
 */
export const useEnabledPlugins = () => {
  const { pluginManager } = usePlugin();
  const [enabledPlugins, setEnabledPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    setEnabledPlugins(pluginManager.getEnabledPlugins());
  }, []);

  return enabledPlugins;
};
