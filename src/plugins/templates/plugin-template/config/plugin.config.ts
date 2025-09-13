import { Plugin } from '@/types/plugin'
import { PluginIcon } from '../assets/plugin-icon'

/**
 * 插件配置
 * 定义插件的基本信息、权限、依赖等
 */
export const pluginConfig: Plugin = {
  id: 'plugin-template',
  name: '插件模板',
  version: '1.0.0',
  description: '这是一个插件模板，用于创建新的插件',
  author: 'Your Name',
  icon: PluginIcon,
  category: 'utility',
  
  // 插件配置
  config: {
    // 是否在导航中显示
    showInNav: true,
    // 导航中的位置（数字越小越靠前）
    position: 0,
    // 是否默认启用
    enabled: true,
    // 插件权限
    permissions: [
      'read:data',
      'write:data'
    ],
    // 插件依赖
    dependencies: [],
    // 插件设置
    settings: {
      theme: 'light',
      language: 'zh-CN'
    }
  },
  
  // 插件生命周期
  lifecycle: {
    onInstall: () => {
      console.log('插件模板已安装')
    },
    onUninstall: () => {
      console.log('插件模板已卸载')
    },
    onEnable: () => {
      console.log('插件模板已启用')
    },
    onDisable: () => {
      console.log('插件模板已禁用')
    }
  },
  
  // 插件路由
  routes: [
    {
      path: '/plugin-template',
      component: 'PluginComponent',
      title: '插件模板'
    }
  ],
  
  // 插件菜单
  menu: [
    {
      id: 'main',
      label: '主功能',
      icon: 'Home',
      action: 'navigate',
      path: '/plugin-template'
    },
    {
      id: 'settings',
      label: '设置',
      icon: 'Settings',
      action: 'navigate',
      path: '/plugin-template/settings'
    }
  ]
}

export default pluginConfig

