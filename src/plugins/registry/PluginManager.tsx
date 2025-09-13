import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Download, Upload, Settings, Play, Pause, Trash2, RefreshCw } from 'lucide-react'
import { pluginRegistry } from './index'

/**
 * 插件管理器组件
 */
export const PluginManager: React.FC = () => {
  const [plugins, setPlugins] = useState(pluginRegistry.getAllPlugins())
  const [installedPlugins, setInstalledPlugins] = useState(pluginRegistry.getInstalledPlugins())
  const [enabledPlugins, setEnabledPlugins] = useState(pluginRegistry.getEnabledPlugins())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  // 刷新插件列表
  const refreshPlugins = () => {
    setPlugins(pluginRegistry.getAllPlugins())
    setInstalledPlugins(pluginRegistry.getInstalledPlugins())
    setEnabledPlugins(pluginRegistry.getEnabledPlugins())
  }

  // 安装插件
  const installPlugin = async (pluginId: string) => {
    setLoading(true)
    try {
      const success = pluginRegistry.installPlugin(pluginId)
      if (success) {
        refreshPlugins()
      }
    } catch (error) {
      console.error('安装插件失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 卸载插件
  const uninstallPlugin = async (pluginId: string) => {
    setLoading(true)
    try {
      const success = pluginRegistry.uninstallPlugin(pluginId)
      if (success) {
        refreshPlugins()
      }
    } catch (error) {
      console.error('卸载插件失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 启用插件
  const enablePlugin = async (pluginId: string) => {
    setLoading(true)
    try {
      const success = pluginRegistry.enablePlugin(pluginId)
      if (success) {
        refreshPlugins()
      }
    } catch (error) {
      console.error('启用插件失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 禁用插件
  const disablePlugin = async (pluginId: string) => {
    setLoading(true)
    try {
      const success = pluginRegistry.disablePlugin(pluginId)
      if (success) {
        refreshPlugins()
      }
    } catch (error) {
      console.error('禁用插件失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 搜索插件
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 获取插件统计
  const stats = pluginRegistry.getPluginStats()

  return (
    <div className="plugin-manager p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">插件管理器</h1>
          <p className="text-muted-foreground">管理您的插件和扩展</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshPlugins}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导入插件
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            导出配置
          </Button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">总插件数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.installed}</div>
            <div className="text-sm text-muted-foreground">已安装</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.enabled}</div>
            <div className="text-sm text-muted-foreground">已启用</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.disabled}</div>
            <div className="text-sm text-muted-foreground">已禁用</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜索插件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分类</SelectItem>
            <SelectItem value="utility">工具类</SelectItem>
            <SelectItem value="productivity">生产力</SelectItem>
            <SelectItem value="entertainment">娱乐</SelectItem>
            <SelectItem value="education">教育</SelectItem>
            <SelectItem value="business">商业</SelectItem>
            <SelectItem value="development">开发</SelectItem>
            <SelectItem value="design">设计</SelectItem>
            <SelectItem value="communication">通信</SelectItem>
            <SelectItem value="security">安全</SelectItem>
            <SelectItem value="other">其他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 插件列表 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">所有插件 ({plugins.length})</TabsTrigger>
          <TabsTrigger value="installed">已安装 ({installedPlugins.length})</TabsTrigger>
          <TabsTrigger value="enabled">已启用 ({enabledPlugins.length})</TabsTrigger>
          <TabsTrigger value="disabled">已禁用 ({stats.disabled})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                isInstalled={pluginRegistry.isPluginInstalled(plugin.id)}
                isEnabled={pluginRegistry.isPluginEnabled(plugin.id)}
                onInstall={() => installPlugin(plugin.id)}
                onUninstall={() => uninstallPlugin(plugin.id)}
                onEnable={() => enablePlugin(plugin.id)}
                onDisable={() => disablePlugin(plugin.id)}
                loading={loading}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {installedPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                isInstalled={true}
                isEnabled={pluginRegistry.isPluginEnabled(plugin.id)}
                onInstall={() => installPlugin(plugin.id)}
                onUninstall={() => uninstallPlugin(plugin.id)}
                onEnable={() => enablePlugin(plugin.id)}
                onDisable={() => disablePlugin(plugin.id)}
                loading={loading}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enabled" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enabledPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                isInstalled={true}
                isEnabled={true}
                onInstall={() => installPlugin(plugin.id)}
                onUninstall={() => uninstallPlugin(plugin.id)}
                onEnable={() => enablePlugin(plugin.id)}
                onDisable={() => disablePlugin(plugin.id)}
                loading={loading}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disabled" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {installedPlugins
              .filter(plugin => !pluginRegistry.isPluginEnabled(plugin.id))
              .map((plugin) => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  isInstalled={true}
                  isEnabled={false}
                  onInstall={() => installPlugin(plugin.id)}
                  onUninstall={() => uninstallPlugin(plugin.id)}
                  onEnable={() => enablePlugin(plugin.id)}
                  onDisable={() => disablePlugin(plugin.id)}
                  loading={loading}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// 插件卡片组件
interface PluginCardProps {
  plugin: any
  isInstalled: boolean
  isEnabled: boolean
  onInstall: () => void
  onUninstall: () => void
  onEnable: () => void
  onDisable: () => void
  loading: boolean
}

const PluginCard: React.FC<PluginCardProps> = ({
  plugin,
  isInstalled,
  isEnabled,
  onInstall,
  onUninstall,
  onEnable,
  onDisable,
  loading
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <plugin.icon className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-lg">{plugin.name}</CardTitle>
              <CardDescription className="text-sm">
                v{plugin.version} • {plugin.author}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            <Badge variant={isEnabled ? 'default' : 'secondary'}>
              {isEnabled ? '已启用' : isInstalled ? '已禁用' : '未安装'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {plugin.description}
        </p>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {plugin.category}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {!isInstalled ? (
            <Button size="sm" onClick={onInstall} disabled={loading}>
              <Download className="w-3 h-3 mr-1" />
              安装
            </Button>
          ) : (
            <>
              {isEnabled ? (
                <Button size="sm" variant="outline" onClick={onDisable} disabled={loading}>
                  <Pause className="w-3 h-3 mr-1" />
                  禁用
                </Button>
              ) : (
                <Button size="sm" onClick={onEnable} disabled={loading}>
                  <Play className="w-3 h-3 mr-1" />
                  启用
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={onUninstall} disabled={loading}>
                <Trash2 className="w-3 h-3 mr-1" />
                卸载
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PluginManager
