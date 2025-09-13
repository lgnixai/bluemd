import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Plugin, PluginContext, PluginEvent, PluginEventType } from '../types/plugin';
import { pluginManager } from '../lib/plugin-manager-simple';

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
  const activePluginRef = useRef<Plugin | null>(null);

  // 更新 ref 当 activePlugin 变化时
  useEffect(() => {
    activePluginRef.current = activePlugin;
  }, [activePlugin]);

  // 初始化插件列表
  useEffect(() => {
    setPlugins(pluginManager.getPlugins());
  }, []);

  // 监听插件事件
  useEffect(() => {
    const handlePluginEvent = (event: PluginEvent) => {
      console.log('Plugin event:', event);
      
      // 如果当前激活的插件被禁用或卸载，清除激活状态
      if (activePluginRef.current && event.pluginId === activePluginRef.current.id) {
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
      pluginManager.addEventListener(eventType, handlePluginEvent);
    });

    // 清理函数
    return () => {
      eventTypes.forEach(eventType => {
        pluginManager.removeEventListener(eventType, handlePluginEvent);
      });
    };
  }, []);

  // 插件事件监听器管理
  const onPluginEvent = (eventType: PluginEventType, callback: (event: PluginEvent) => void) => {
    pluginManager.addEventListener(eventType, callback);
  };

  const offPluginEvent = (eventType: PluginEventType, callback: (event: PluginEvent) => void) => {
    pluginManager.removeEventListener(eventType, callback);
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
  const { pluginManager, onPluginEvent, offPluginEvent } = usePlugin();
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    // 初始化时获取所有插件
    setPlugins(pluginManager.getPlugins());

    // 监听所有插件状态变化事件
    const handlePluginEvent = (event: PluginEvent) => {
      if (event.type === 'plugin-installed' || 
          event.type === 'plugin-uninstalled' || 
          event.type === 'plugin-enabled' || 
          event.type === 'plugin-disabled') {
        setPlugins(pluginManager.getPlugins());
      }
    };

    // 注册事件监听器
    onPluginEvent('plugin-installed', handlePluginEvent);
    onPluginEvent('plugin-uninstalled', handlePluginEvent);
    onPluginEvent('plugin-enabled', handlePluginEvent);
    onPluginEvent('plugin-disabled', handlePluginEvent);

    // 清理函数
    return () => {
      offPluginEvent('plugin-installed', handlePluginEvent);
      offPluginEvent('plugin-uninstalled', handlePluginEvent);
      offPluginEvent('plugin-enabled', handlePluginEvent);
      offPluginEvent('plugin-disabled', handlePluginEvent);
    };
  }, [pluginManager, onPluginEvent, offPluginEvent]);

  return plugins;
};

/**
 * 使用已安装插件的钩子
 */
export const useInstalledPlugins = () => {
  const { pluginManager, onPluginEvent, offPluginEvent } = usePlugin();
  const [installedPlugins, setInstalledPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    // 初始化时获取已安装的插件
    setInstalledPlugins(pluginManager.getInstalledPlugins());

    // 监听插件安装/卸载事件
    const handlePluginEvent = (event: PluginEvent) => {
      if (event.type === 'plugin-installed' || event.type === 'plugin-uninstalled') {
        setInstalledPlugins(pluginManager.getInstalledPlugins());
      }
    };

    // 注册事件监听器
    onPluginEvent('plugin-installed', handlePluginEvent);
    onPluginEvent('plugin-uninstalled', handlePluginEvent);

    // 清理函数
    return () => {
      offPluginEvent('plugin-installed', handlePluginEvent);
      offPluginEvent('plugin-uninstalled', handlePluginEvent);
    };
  }, [pluginManager, onPluginEvent, offPluginEvent]);

  return installedPlugins;
};

/**
 * 使用启用插件的钩子
 */
export const useEnabledPlugins = () => {
  const { pluginManager, onPluginEvent, offPluginEvent } = usePlugin();
  const [enabledPlugins, setEnabledPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    // 初始化时获取已启用的插件
    setEnabledPlugins(pluginManager.getEnabledPlugins());

    // 监听插件启用/禁用事件
    const handlePluginEvent = (event: PluginEvent) => {
      if (event.type === 'plugin-enabled' || event.type === 'plugin-disabled') {
        setEnabledPlugins(pluginManager.getEnabledPlugins());
      }
    };

    // 注册事件监听器
    onPluginEvent('plugin-enabled', handlePluginEvent);
    onPluginEvent('plugin-disabled', handlePluginEvent);

    // 清理函数
    return () => {
      offPluginEvent('plugin-enabled', handlePluginEvent);
      offPluginEvent('plugin-disabled', handlePluginEvent);
    };
  }, [pluginManager, onPluginEvent, offPluginEvent]);

  return enabledPlugins;
};

// 导出 PluginContext 实例
export { PluginContextInstance as PluginContext };
