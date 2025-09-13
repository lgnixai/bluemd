// import React from 'react';
import { Settings, FileText, Search, Calendar } from 'lucide-react';
import { Plugin } from '../types/plugin';
import { healthPlugin } from './health-plugin';
import { moviePlugin } from './movie-plugin';

// 简化的示例插件定义
export const samplePlugins: Plugin[] = [
  // 新增的后端集成插件
  healthPlugin,
  moviePlugin,
  {
    id: 'settings',
    name: '设置',
    description: '应用设置和配置',
    version: '1.0.0',
    author: 'System',
    icon: Settings,
    category: '系统工具',
    config: {
      position: 1,
      showInNav: true,
      enabled: false
    }
  },
  {
    id: 'file-manager',
    name: '文件管理',
    description: '文件上传和管理',
    version: '1.0.0',
    author: 'System',
    icon: FileText,
    category: '工具',
    config: {
      position: 2,
      showInNav: true,
      enabled: false
    }
  },
  {
    id: 'search',
    name: '搜索',
    description: '全局搜索功能',
    version: '1.0.0',
    author: 'System',
    icon: Search,
    category: '工具',
    config: {
      position: 3,
      showInNav: true,
      enabled: false
    }
  },
  {
    id: 'calendar',
    name: '日历',
    description: '日历和事件管理',
    version: '1.0.0',
    author: 'System',
    icon: Calendar,
    category: '工具',
    config: {
      position: 4,
      showInNav: true,
      enabled: false
    }
  }
];
