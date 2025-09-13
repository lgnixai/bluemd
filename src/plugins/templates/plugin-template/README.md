# 插件模板

这是一个插件开发模板，用于快速创建新的插件。

## 目录结构

```
plugin-template/
├── index.ts                 # 插件入口文件
├── config/
│   └── plugin.config.ts     # 插件配置文件
├── components/
│   └── PluginComponent.tsx  # 插件主组件
├── hooks/
│   └── usePlugin.ts         # 插件自定义Hook
├── types/
│   └── plugin.types.ts      # 插件类型定义
├── assets/
│   └── plugin-icon.tsx      # 插件图标
├── utils/
│   └── plugin.utils.ts      # 插件工具函数
└── README.md                # 插件说明文档
```

## 使用方法

### 1. 复制模板

将 `plugin-template` 文件夹复制到 `src/plugins/` 目录下，并重命名为你的插件名称。

### 2. 修改配置

编辑 `config/plugin.config.ts` 文件，修改以下内容：

- `id`: 插件的唯一标识符
- `name`: 插件显示名称
- `version`: 插件版本
- `description`: 插件描述
- `author`: 插件作者
- `category`: 插件分类

### 3. 自定义组件

编辑 `components/PluginComponent.tsx` 文件，实现你的插件UI。

### 4. 添加业务逻辑

在 `hooks/usePlugin.ts` 中添加你的插件业务逻辑。

### 5. 注册插件

在 `src/plugins/registry/index.ts` 中注册你的插件。

## 插件配置说明

### 基本配置

```typescript
export const pluginConfig: Plugin = {
  id: 'your-plugin-id',        // 插件唯一ID
  name: '你的插件名称',         // 插件显示名称
  version: '1.0.0',            // 插件版本
  description: '插件描述',      // 插件描述
  author: '作者名称',           // 插件作者
  icon: YourPluginIcon,        // 插件图标组件
  category: 'utility',         // 插件分类
}
```

### 功能配置

```typescript
config: {
  showInNav: true,             // 是否在导航中显示
  position: 0,                 // 导航位置
  enabled: true,               // 是否默认启用
  permissions: [               // 插件权限
    'read:data',
    'write:data'
  ],
  dependencies: [],            // 插件依赖
  settings: {                  // 插件设置
    theme: 'light',
    language: 'zh-CN'
  }
}
```

### 生命周期

```typescript
lifecycle: {
  onInstall: () => {           // 安装时执行
    console.log('插件已安装')
  },
  onUninstall: () => {         // 卸载时执行
    console.log('插件已卸载')
  },
  onEnable: () => {            // 启用时执行
    console.log('插件已启用')
  },
  onDisable: () => {           // 禁用时执行
    console.log('插件已禁用')
  }
}
```

## 开发指南

### 1. 组件开发

- 使用 React 函数组件
- 遵循 TypeScript 类型定义
- 使用提供的 UI 组件库
- 实现响应式设计

### 2. 状态管理

- 使用 `usePlugin` Hook 管理插件状态
- 利用 `PluginStateManager` 进行复杂状态管理
- 遵循单向数据流原则

### 3. 事件处理

- 使用 `EventEmitter` 进行事件通信
- 监听插件管理器事件
- 实现错误处理机制

### 4. 样式规范

- 使用 Tailwind CSS 类名
- 遵循设计系统规范
- 支持主题切换

## 最佳实践

1. **命名规范**: 使用有意义的变量和函数名
2. **错误处理**: 实现完善的错误处理机制
3. **性能优化**: 使用 React.memo 和 useMemo 优化性能
4. **类型安全**: 充分利用 TypeScript 类型系统
5. **文档完善**: 为所有公共API提供文档注释

## 调试技巧

1. 使用浏览器开发者工具
2. 利用 React DevTools
3. 添加 console.log 进行调试
4. 使用断点调试

## 发布流程

1. 完善插件功能
2. 编写测试用例
3. 更新文档
4. 版本号管理
5. 提交到插件注册表

## 常见问题

### Q: 如何添加新的依赖？

A: 在 `package.json` 中添加依赖，然后在插件配置中声明。

### Q: 如何处理异步操作？

A: 使用 async/await 语法，并在组件中处理加载状态。

### Q: 如何与其他插件通信？

A: 使用事件系统或插件管理器提供的API。

### Q: 如何自定义插件图标？

A: 编辑 `assets/plugin-icon.tsx` 文件，使用 SVG 或图标库。

## 技术支持

如有问题，请参考：
- 插件开发文档
- API 参考手册
- 示例插件代码
- 社区论坛

