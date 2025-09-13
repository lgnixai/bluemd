import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePlugin } from '../hooks/usePlugin'
import { PluginState } from '../types/plugin.types'

/**
 * 插件主组件
 * 这是插件的核心UI组件
 */
export const PluginComponent: React.FC = () => {
  const { plugin, state, actions } = usePlugin()
  const [localState, setLocalState] = useState<PluginState>({
    enabled: false,
    data: null,
    loading: false,
    error: null
  })

  useEffect(() => {
    // 插件初始化逻辑
    actions.initialize()
  }, [])

  const handleAction = async () => {
    setLocalState(prev => ({ ...prev, loading: true }))
    try {
      await actions.performAction()
      setLocalState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      setLocalState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '未知错误'
      }))
    }
  }

  return (
    <div className="plugin-container p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {plugin && <plugin.icon className="w-6 h-6" />}
              <CardTitle>{plugin?.name || '未知插件'}</CardTitle>
            </div>
            <Badge variant={state.enabled ? 'default' : 'secondary'}>
              {state.enabled ? '已启用' : '已禁用'}
            </Badge>
          </div>
          <CardDescription>
            {plugin?.description || '暂无描述'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 插件状态显示 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">插件信息</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>版本: {plugin?.version || '未知'}</p>
                <p>作者: {plugin?.author || '未知'}</p>
                <p>分类: {plugin?.category || '未知'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">状态</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>状态: {state.enabled ? '运行中' : '已停止'}</p>
                <p>数据: {localState.data ? '已加载' : '未加载'}</p>
                <p>错误: {localState.error || '无'}</p>
              </div>
            </div>
          </div>

          {/* 插件功能区域 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">插件功能</h4>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleAction}
                disabled={localState.loading}
                variant="default"
              >
                {localState.loading ? '执行中...' : '执行操作'}
              </Button>
              
              <Button 
                onClick={() => actions.toggle()}
                variant="outline"
              >
                {state.enabled ? '禁用' : '启用'}
              </Button>
            </div>

            {/* 插件内容区域 */}
            <div className="min-h-[200px] border rounded-lg p-4 bg-muted/50">
              <h5 className="text-sm font-medium mb-2">插件内容区域</h5>
              <p className="text-sm text-muted-foreground">
                这里可以放置插件的具体功能内容
              </p>
              
              {localState.data && (
                <div className="mt-4 p-3 bg-background rounded border">
                  <h6 className="text-xs font-medium mb-2">数据预览</h6>
                  <pre className="text-xs text-muted-foreground overflow-auto">
                    {JSON.stringify(localState.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PluginComponent
