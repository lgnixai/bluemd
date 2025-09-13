import { useState, useCallback, useEffect } from 'react'
import { usePluginManager } from '@/lib/plugin-manager'
import { PluginState, PluginActions } from '../types/plugin.types'

/**
 * 插件自定义Hook
 * 提供插件的状态管理和操作方法
 */
export const usePlugin = () => {
  const pluginManager = usePluginManager()
  const [state, setState] = useState<PluginState>({
    enabled: false,
    data: null,
    loading: false,
    error: null
  })

  // 获取当前插件实例
  const plugin = pluginManager.getPlugin('plugin-template')

  // 初始化插件
  const initialize = useCallback(async () => {
    if (!plugin) return
    
    setState(prev => ({ ...prev, loading: true }))
    try {
      // 这里可以添加插件初始化逻辑
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟异步操作
      
      setState(prev => ({
        ...prev,
        enabled: plugin.config?.enabled || false,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '初始化失败'
      }))
    }
  }, [plugin])

  // 执行插件操作
  const performAction = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      // 这里可以添加插件的具体业务逻辑
      await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟异步操作
      
      const mockData = {
        timestamp: new Date().toISOString(),
        action: 'performAction',
        result: 'success'
      }
      
      setState(prev => ({
        ...prev,
        data: mockData,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '操作失败'
      }))
    }
  }, [])

  // 切换插件状态
  const toggle = useCallback(() => {
    if (!plugin) return
    
    const newState = !state.enabled
    setState(prev => ({ ...prev, enabled: newState }))
    
    // 通知插件管理器状态变化
    if (newState) {
      pluginManager.enablePlugin(plugin.id)
    } else {
      pluginManager.disablePlugin(plugin.id)
    }
  }, [plugin, state.enabled, pluginManager])

  // 重置插件状态
  const reset = useCallback(() => {
    setState({
      enabled: false,
      data: null,
      loading: false,
      error: null
    })
  }, [])

  // 更新插件数据
  const updateData = useCallback((newData: any) => {
    setState(prev => ({ ...prev, data: newData }))
  }, [])

  // 设置错误状态
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  // 监听插件状态变化
  useEffect(() => {
    if (!plugin) return

    const handlePluginStateChange = (pluginId: string, newState: any) => {
      if (pluginId === plugin.id) {
        setState(prev => ({ ...prev, ...newState }))
      }
    }

    // 注册事件监听器
    pluginManager.addEventListener('plugin-state-changed', handlePluginStateChange)

    return () => {
      pluginManager.removeEventListener('plugin-state-changed', handlePluginStateChange)
    }
  }, [plugin, pluginManager])

  const actions: PluginActions = {
    initialize,
    performAction,
    toggle,
    reset,
    updateData,
    setError
  }

  return {
    plugin,
    state,
    actions
  }
}

export default usePlugin

