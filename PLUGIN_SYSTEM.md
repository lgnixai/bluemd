# BlueMD 插件系统

## 概述

BlueMD 插件系统是一个完整的插件开发框架，提供了插件创建、管理、注册和使用的完整解决方案。

## 系统架构

### 核心组件

1. **插件注册表** (`src/plugins/registry/`)
   - 管理所有插件的注册、安装、启用/禁用
   - 提供插件搜索、分类、统计功能

2. **插件管理器** (`src/lib/plugin-manager.ts`)
   - 插件生命周期管理
   - 事件系统
   - 插件状态管理

3. **插件模板** (`src/plugins/templates/`)
   - 标准插件模板
   - 插件创建工具
   - 插件创建向导

4. **示例插件** (`src/plugins/weather-plugin/`)
   - 完整的天气插件示例
   - 展示插件开发最佳实践

## 插件结构

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

## 快速开始

### 1. 创建新插件

使用插件创建向导：

```typescript
import { PluginWizard } from '@/plugins/templates/PluginWizard'

// 在组件中使用
<PluginWizard />
```

### 2. 手动创建插件

1. 复制 `templates/plugin-template` 目录
2. 重命名为您的插件名称
3. 修改配置文件
4. 在 `registry/index.ts` 中注册插件

### 3. 插件配置示例

```typescript
export const myPluginConfig: Plugin = {
  id: 'my-plugin',
  name: '我的插件',
  version: '1.0.0',
  description: '插件描述',
  author: '作者名称',
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
    onInstall: () => console.log('插件已安装'),
    onEnable: () => console.log('插件已启用')
  }
}
```

## 插件开发

### 1. 插件组件

```typescript
import React from 'react'
import { usePlugin } from '../hooks/usePlugin'

export const MyPluginComponent: React.FC = () => {
  const { plugin, state, actions } = usePlugin()
  
  return (
    <div>
      <h1>{plugin?.name}</h1>
      <p>{plugin?.description}</p>
      {/* 插件内容 */}
    </div>
  )
}
```

### 2. 插件Hook

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

// 获取插件信息
const plugin = pluginRegistry.getPlugin('my-plugin')
const allPlugins = pluginRegistry.getAllPlugins()
```

### 插件管理器操作

```typescript
import { pluginManager } from '@/lib/plugin-manager'

// 注册插件
pluginManager.registerPlugin(pluginConfig)

// 启用插件
pluginManager.enablePlugin('my-plugin')

// 检查插件状态
const isEnabled = pluginManager.isPluginEnabled('my-plugin')
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

1. **命名规范**: 使用有意义的插件ID和名称
2. **错误处理**: 实现完善的错误处理机制
3. **性能优化**: 使用 React.memo 和 useMemo
4. **类型安全**: 充分利用 TypeScript 类型系统
5. **文档完善**: 为所有公共API提供文档注释

## 示例插件

### 天气插件

天气插件展示了完整的插件开发流程：

- 插件配置和生命周期管理
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

1. **插件无法加载**: 检查插件配置和注册
2. **插件状态异常**: 检查生命周期函数
3. **插件UI不显示**: 检查组件导出和路由配置

### 调试技巧

1. 使用浏览器开发者工具
2. 查看控制台日志
3. 使用 React DevTools
4. 检查网络请求

## 总结

BlueMD 插件系统提供了：

✅ **完整的插件开发框架**
✅ **标准化的插件模板**
✅ **可视化的插件创建向导**
✅ **强大的插件管理功能**
✅ **丰富的示例和文档**
✅ **类型安全的开发体验**

这个插件系统为 BlueMD 提供了强大的扩展能力，让开发者可以轻松创建和管理各种功能插件。

