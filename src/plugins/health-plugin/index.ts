import { Plugin } from '../../types/plugin'
import { HealthIcon } from './assets/health-icon'
import { HealthComponent } from './components/HealthComponent'

export const healthPlugin: Plugin = {
  id: 'health-check',
  name: '健康检查',
  description: '检查后端服务状态和连接性',
  version: '1.0.0',
  author: 'BlueMD Team',
  icon: HealthIcon,
  category: '系统工具',
  config: {
    position: 1,
    showInNav: true,
    enabled: true
  },
  lifecycle: {
    onInstall: () => {
      console.log('健康检查插件已安装')
    },
    onEnable: () => {
      console.log('健康检查插件已启用')
    },
    onDisable: () => {
      console.log('健康检查插件已禁用')
    }
  },
  routes: [
    {
      path: '/health',
      component: HealthComponent,
      title: '健康检查'
    }
  ],
  menu: [
    {
      id: 'health-check',
      label: '健康检查',
      path: '/health',
      icon: HealthIcon,
      action: 'navigate'
    }
  ]
}

export default healthPlugin
