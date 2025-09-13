# 插件系统

BlueMD 插件系统是一个强大的扩展框架，允许开发者创建自定义插件来扩展应用功能。

## 目录结构

```
src/plugins/
├── registry/                 # 插件注册表
│   ├── index.ts             # 插件注册表核心
│   └── PluginManager.tsx    # 插件管理界面
├── templates/               # 插件模板
│   ├── plugin-template/     # 基础插件模板
│   ├── create-plugin.ts     # 插件创建工具
│   └── PluginWizard.tsx     # 插件创建向导
├── weather-plugin/          # 示例插件
└── README.md               # 本文档
```

## 快速开始

### 1. 使用插件创建向导

访问插件管理器，点击"创建新插件"按钮，使用可视化向导创建插件。

### 2. 手动创建插件

1. 复制 `templates/plugin-template` 目录
2. 重命名为您的插件名称
3. 修改配置文件
4. 在 `registry/index.ts` 中注册插件

### 3. 插件开发

```typescript
// 1. 定义插件配置
export const myPluginConfig: Plugin = {
  id: 'my-plugin',
  name: '我的插件',
  version: '1.0.0',
  description: '插件描述',
  author: '作者名称',
  icon: MyPluginIcon,
  category: 'utility',
  // ... 其他配置
}

// 2. 创建插件组件
export const MyPluginComponent: React.FC = () => {
  const { plugin, state, actions } = usePlugin()
  
  return (
    <div>
      <h1>{plugin.name}</h1>
      {/* 插件内容 */}
    </div>
  )
}

// 3. 注册插件
pluginRegistry.registerPlugin(myPluginConfig)
```

## 插件架构

### 核心组件

- **PluginRegistry**: 插件注册表，管理所有插件
- **PluginManager**: 插件管理器，提供插件操作API
- **PluginProvider**: React上下文提供者
- **usePlugin**: 插件开发Hook

### 插件生命周期

1. **注册**: 插件被注册到系统中
2. **安装**: 插件被安装，执行初始化逻辑
3. **启用**: 插件被启用，开始提供服务
4. **禁用**: 插件被禁用，停止服务
5. **卸载**: 插件被卸载，清理资源

### 插件配置

```typescript
interface Plugin {
  id: string                    // 插件唯一标识
  name: string                  // 插件显示名称
  version: string               // 插件版本
  description: string           // 插件描述
  author: string                // 插件作者
  icon: React.ComponentType     // 插件图标
  category: string              // 插件分类
  
  config: {
    showInNav: boolean          // 是否在导航中显示
    position: number            // 导航位置
    enabled: boolean            // 是否默认启用
    permissions: string[]       // 插件权限
    dependencies: string[]      // 插件依赖
    settings: any               // 插件设置
  }
  
  lifecycle: {
    onInstall?: () => void      // 安装时执行
    onUninstall?: () => void    // 卸载时执行
    onEnable?: () => void       // 启用时执行
    onDisable?: () => void      // 禁用时执行
  }
  
  routes: PluginRoute[]         // 插件路由
  menu: PluginMenuItem[]        // 插件菜单
}
```

## 开发指南

### 1. 插件目录结构

```
my-plugin/
├── index.ts                   # 插件入口文件
├── config/
│   └── plugin.config.ts      # 插件配置
├── components/
│   └── PluginComponent.tsx   # 插件主组件
├── hooks/
│   └── usePlugin.ts          # 插件Hook
├── types/
│   └── plugin.types.ts       # 类型定义
├── assets/
│   └── plugin-icon.tsx       # 插件图标
├── utils/
│   └── plugin.utils.ts       # 工具函数
└── README.md                 # 插件文档
```

### 2. 插件组件开发

```typescript
import React from 'react'
import { usePlugin } from '../hooks/usePlugin'

export const MyPluginComponent: React.FC = () => {
  const { plugin, state, actions } = usePlugin()
  
  return (
    <div className="my-plugin">
      <h1>{plugin.name}</h1>
      <p>{plugin.description}</p>
      {/* 插件内容 */}
    </div>
  )
}
```

### 3. 插件Hook开发

```typescript
import { useState, useCallback } from 'react'
import { usePluginManager } from '@/lib/plugin-manager'

export const useMyPlugin = () => {
  const pluginManager = usePluginManager()
  const [state, setState] = useState({})
  
  const actions = {
    // 插件操作
  }
  
  return { state, actions }
}
```

### 4. 插件配置

```typescript
export const myPluginConfig: Plugin = {
  id: 'my-plugin',
  name: '我的插件',
  version: '1.0.0',
  description: '这是一个示例插件',
  author: 'Your Name',
  icon: MyPluginIcon,
  category: 'utility',
  
  config: {
    showInNav: true,
    position: 0,
    enabled: true,
    permissions: ['read:data'],
    dependencies: [],
    settings: {
      theme: 'light'
    }
  },
  
  lifecycle: {
    onInstall: () => {
      console.log('插件已安装')
    },
    onEnable: () => {
      console.log('插件已启用')
    }
  }
}
```

## 插件管理

### 插件注册表操作

```typescript
import { pluginRegistry } from '@/plugins/registry'

// 注册插件
pluginRegistry.registerPlugin(pluginConfig)

// 安装插件
pluginRegistry.installPlugin('my-plugin')

// 启用插件
pluginRegistry.enablePlugin('my-plugin')

// 禁用插件
pluginRegistry.disablePlugin('my-plugin')

// 卸载插件
pluginRegistry.uninstallPlugin('my-plugin')

// 获取插件信息
const plugin = pluginRegistry.getPlugin('my-plugin')
const allPlugins = pluginRegistry.getAllPlugins()
const enabledPlugins = pluginRegistry.getEnabledPlugins()
```

### 插件管理器操作

```typescript
import { pluginManager } from '@/lib/plugin-manager'

// 注册插件
pluginManager.registerPlugin(pluginConfig)

// 启用插件
pluginManager.enablePlugin('my-plugin')

// 禁用插件
pluginManager.disablePlugin('my-plugin')

// 检查插件状态
const isEnabled = pluginManager.isPluginEnabled('my-plugin')

// 获取插件实例
const plugin = pluginManager.getPlugin('my-plugin')
```

## 插件分类

- **utility**: 工具类插件
- **productivity**: 生产力插件
- **entertainment**: 娱乐插件
- **education**: 教育插件
- **business**: 商业插件
- **development**: 开发插件
- **design**: 设计插件
- **communication**: 通信插件
- **security**: 安全插件
- **other**: 其他插件

## 最佳实践

### 1. 命名规范

- 插件ID使用小写字母、数字、连字符和下划线
- 插件名称使用有意义的描述性名称
- 版本号使用语义化版本号 (x.y.z)

### 2. 错误处理

```typescript
try {
  await pluginAction()
} catch (error) {
  console.error('插件操作失败:', error)
  // 处理错误
}
```

### 3. 性能优化

- 使用 React.memo 优化组件渲染
- 使用 useMemo 和 useCallback 优化计算
- 避免在渲染函数中创建新对象

### 4. 类型安全

- 使用 TypeScript 类型定义
- 为所有公共API提供类型
- 使用严格的类型检查

### 5. 测试

- 为插件编写单元测试
- 测试插件生命周期
- 测试错误处理

## 示例插件

### 天气插件

天气插件展示了如何创建一个完整的插件：

- 插件配置和生命周期
- 自定义Hook和状态管理
- 组件开发和UI设计
- 类型定义和工具函数

### 插件模板

插件模板提供了创建新插件的基础结构：

- 标准目录结构
- 基础配置文件
- 示例组件和Hook
- 开发工具和文档

## 故障排除

### 常见问题

1. **插件无法加载**
   - 检查插件配置是否正确
   - 确认插件已正确注册
   - 查看控制台错误信息

2. **插件状态异常**
   - 检查插件生命周期函数
   - 确认插件依赖是否满足
   - 验证插件权限设置

3. **插件UI不显示**
   - 检查组件是否正确导出
   - 确认路由配置是否正确
   - 验证插件是否已启用

### 调试技巧

1. 使用浏览器开发者工具
2. 查看控制台日志
3. 使用 React DevTools
4. 检查网络请求

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 支持

如有问题，请：

1. 查看文档
2. 搜索现有问题
3. 创建新问题
4. 联系维护者

