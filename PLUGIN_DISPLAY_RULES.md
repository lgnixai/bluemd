# 插件展示规则

## 概述

本系统采用固定的两区域布局模式来展示插件内容，确保界面的一致性和用户体验的统一性。

## 插件展示区域规范

### 区域定义

插件内容必须且只能在以下两个区域中展示：

#### 第一个区域：插件控制面板（左侧）
- **位置**：左侧插件选择面板区域
- **用途**：显示插件的控制界面、搜索条件、筛选选项等交互元素
- **实现方式**：通过修改 `src/components/app-sidebar.tsx` 中的插件内容渲染逻辑
- **代码位置**：`src/components/app-sidebar.tsx` 第231-255行

#### 第二个区域：主内容显示区（右侧）
- **位置**：主内容区域
- **用途**：显示插件的核心内容、搜索结果、数据展示等
- **实现方式**：通过修改 `src/dashboard/page.tsx` 中的ContentArea组件
- **代码位置**：`src/dashboard/page.tsx` 第39-58行

## 插件开发规范

### 1. 插件结构要求

每个插件必须包含以下组件：

```typescript
// 插件控制组件（用于第一个区域）
interface PluginControlComponent {
  // 搜索条件、筛选选项、控制按钮等
}

// 插件内容组件（用于第二个区域）
interface PluginContentComponent {
  // 数据展示、结果列表、详情页面等
}
```

### 2. 区域分配原则

#### 第一个区域（插件控制面板）
- ✅ 搜索输入框
- ✅ 筛选条件按钮
- ✅ 排序选项
- ✅ 控制按钮（清除、重置等）
- ✅ 插件状态信息
- ❌ 大量数据展示
- ❌ 复杂的内容渲染

#### 第二个区域（主内容显示区）
- ✅ 数据列表展示
- ✅ 搜索结果
- ✅ 详情页面
- ✅ 图表和可视化
- ✅ 复杂的内容渲染
- ❌ 控制按钮和输入框

### 3. 实现示例

#### 电影插件实现

**第一个区域（AppSidebar）**：
```typescript
{activePlugin.id === 'movie-data' ? (
  // 电影插件显示搜索条件
  <MovieSearchSidebar />
) : (
  // 其他插件的处理逻辑
)}
```

**第二个区域（Dashboard）**：
```typescript
if (activeItem?.id === 'movie-data') {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full">
        <div className="h-full overflow-y-auto">
          <MovieSearchResults onMovieClick={handleMovieClick} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
```

## 技术实现规范

### 1. 状态管理

- 使用 `useNavStore` 管理插件激活状态
- 使用插件特定的store管理插件内部状态
- 两个区域通过共享状态进行数据通信

### 2. 组件通信

```typescript
// 第一个区域更新状态
const handleFilterChange = (filters) => {
  setFilters(filters);
  // 触发第二个区域的更新
};

// 第二个区域监听状态变化
const { filters } = useMovieSearchStore();
// 自动响应状态变化并重新渲染
```

### 3. 样式规范

#### 第一个区域样式
```css
.plugin-control-panel {
  width: 320px; /* 固定宽度 */
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
}
```

#### 第二个区域样式
```css
.plugin-content-area {
  flex: 1; /* 占满剩余空间 */
  overflow-y: auto;
  background: white;
}
```

## 插件注册规范

### 1. 插件定义

```typescript
interface Plugin {
  id: string;
  title: string;
  description: string;
  controlComponent: React.ComponentType; // 第一个区域组件
  contentComponent: React.ComponentType; // 第二个区域组件
}
```

### 2. 注册流程

1. 在 `src/plugins/` 目录下创建插件文件夹
2. 实现控制组件和内容组件
3. 在 `src/plugins/registry/index.ts` 中注册插件
4. 在 `src/components/app-sidebar.tsx` 中添加控制组件渲染逻辑
5. 在 `src/dashboard/page.tsx` 中添加内容组件渲染逻辑

## 禁止事项

### ❌ 不允许的布局方式

1. **单区域展示**：插件内容不能只在一个区域中展示
2. **跨区域组件**：组件不能跨越两个区域
3. **动态区域调整**：不能动态改变区域大小或位置
4. **额外区域**：不能创建第三个或更多展示区域
5. **全屏展示**：插件内容不能覆盖整个屏幕

### ❌ 不允许的组件放置

1. 在第一个区域放置大量数据展示
2. 在第二个区域放置控制按钮和输入框
3. 创建独立的弹窗或模态框（除非必要）
4. 使用侧边栏或抽屉组件

## 维护和更新

### 1. 新增插件

1. 按照本规范创建插件组件
2. 在两个区域中正确注册组件
3. 测试两个区域的交互功能
4. 更新本文档的示例

### 2. 修改现有插件

1. 确保修改不违反区域分配原则
2. 保持两个区域的职责分离
3. 测试修改后的交互功能
4. 更新相关文档

## 总结

本规范确保了插件系统的一致性和可维护性。所有插件必须遵循两区域布局模式，第一个区域负责控制和交互，第二个区域负责内容展示。这种设计模式提供了清晰的用户界面结构，便于用户理解和操作。

---

**最后更新时间**：2025年1月15日  
**版本**：1.0  
**维护者**：开发团队
