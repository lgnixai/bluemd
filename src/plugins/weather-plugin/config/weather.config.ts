import { Plugin } from '@/types/plugin'
import { WeatherIcon } from '../assets/weather-icon'

/**
 * 天气插件配置
 */
export const weatherConfig: Plugin = {
  id: 'weather-plugin',
  name: '天气插件',
  version: '1.0.0',
  description: '提供实时天气信息和天气预报功能',
  author: 'BlueMD Team',
  icon: WeatherIcon,
  category: 'utility',
  
  config: {
    showInNav: true,
    position: 1,
    enabled: true,
    permissions: [
      'read:location',
      'read:weather'
    ],
    dependencies: [],
    settings: {
      city: '北京',
      unit: 'celsius',
      language: 'zh-CN',
      autoRefresh: true,
      refreshInterval: 30
    }
  },
  
  lifecycle: {
    onInstall: () => {
      console.log('天气插件已安装')
    },
    onUninstall: () => {
      console.log('天气插件已卸载')
    },
    onEnable: () => {
      console.log('天气插件已启用')
    },
    onDisable: () => {
      console.log('天气插件已禁用')
    }
  },
  
  routes: [
    {
      path: '/weather',
      component: 'WeatherComponent',
      title: '天气信息'
    }
  ],
  
  menu: [
    {
      id: 'current',
      label: '当前天气',
      icon: 'Sun',
      action: 'navigate',
      path: '/weather'
    },
    {
      id: 'forecast',
      label: '天气预报',
      icon: 'Calendar',
      action: 'navigate',
      path: '/weather/forecast'
    },
    {
      id: 'settings',
      label: '设置',
      icon: 'Settings',
      action: 'navigate',
      path: '/weather/settings'
    }
  ]
}

export default weatherConfig

