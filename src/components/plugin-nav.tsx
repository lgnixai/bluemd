import React from 'react';
import { useEnabledPlugins, useActivePlugin } from '@/contexts/plugin-context';
import { Plugin } from '@/types/plugin';

interface PluginNavProps {
  className?: string;
}

/**
 * 插件导航组件
 * 显示已启用插件的图标，点击时激活插件
 */
export const PluginNav: React.FC<PluginNavProps> = ({ className = '' }) => {
  const enabledPlugins = useEnabledPlugins();
  const { activePlugin, setActivePlugin } = useActivePlugin();

  /**
   * 处理插件点击
   */
  const handlePluginClick = (plugin: Plugin) => {
    if (activePlugin?.id === plugin.id) {
      // 如果点击的是当前激活的插件，则取消激活
      setActivePlugin(null);
    } else {
      // 否则激活该插件
      setActivePlugin(plugin);
    }
  };

  /**
   * 检查插件是否激活
   */
  const isPluginActive = (plugin: Plugin) => {
    return activePlugin?.id === plugin.id;
  };

  return (
    <div className={`plugin-nav ${className}`}>
      {enabledPlugins
        .filter(plugin => plugin.config?.showInNav !== false)
        .sort((a, b) => (a.config?.position || 0) - (b.config?.position || 0))
        .map(plugin => (
          <button
            key={plugin.id}
            onClick={() => handlePluginClick(plugin)}
            className={`
              plugin-nav-item
              ${isPluginActive(plugin) ? 'active' : ''}
              ${plugin.config?.styles?.className || ''}
            `}
            title={plugin.description || plugin.name}
            aria-label={plugin.name}
          >
            <div className="plugin-nav-icon">
              {plugin.icon}
            </div>
            <span className="plugin-nav-name">
              {plugin.name}
            </span>
          </button>
        ))}
    </div>
  );
};

/**
 * 插件导航项组件
 */
interface PluginNavItemProps {
  plugin: Plugin;
  active: boolean;
  onClick: (plugin: Plugin) => void;
}

export const PluginNavItem: React.FC<PluginNavItemProps> = ({ 
  plugin, 
  active, 
  onClick 
}) => {
  return (
    <button
      onClick={() => onClick(plugin)}
      className={`
        plugin-nav-item
        ${active ? 'active' : ''}
        ${plugin.config?.styles?.className || ''}
      `}
      title={plugin.description || plugin.name}
      aria-label={plugin.name}
    >
      <div className="plugin-nav-icon">
        {plugin.icon}
      </div>
      <span className="plugin-nav-name">
        {plugin.name}
      </span>
    </button>
  );
};
