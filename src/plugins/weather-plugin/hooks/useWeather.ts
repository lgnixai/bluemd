import { useState, useCallback, useEffect } from 'react'
import { usePluginManager } from '@/lib/plugin-manager'
import { WeatherState, WeatherActions, WeatherData } from '../types/weather.types'

/**
 * 天气插件自定义Hook
 */
export const useWeather = () => {
  const pluginManager = usePluginManager()
  const [state, setState] = useState<WeatherState>({
    enabled: false,
    weatherData: null,
    loading: false,
    error: null,
    lastUpdate: null
  })

  // 获取当前插件实例
  const weather = pluginManager.getPlugin('weather-plugin')

  // 模拟天气数据
  const mockWeatherData: WeatherData = {
    location: '北京',
    temperature: 22,
    feelsLike: 24,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    timestamp: new Date().toISOString()
  }

  // 获取天气数据
  const fetchWeather = useCallback(async (city: string) => {
    if (!weather) return
    
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟天气数据
      const weatherData: WeatherData = {
        ...mockWeatherData,
        location: city,
        temperature: Math.floor(Math.random() * 30) + 5, // 5-35度
        feelsLike: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        visibility: Math.floor(Math.random() * 15) + 5, // 5-20 km
        timestamp: new Date().toISOString()
      }
      
      setState(prev => ({
        ...prev,
        weatherData,
        loading: false,
        lastUpdate: new Date()
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取天气数据失败'
      }))
    }
  }, [weather])

  // 刷新天气数据
  const refresh = useCallback(() => {
    if (state.weatherData) {
      fetchWeather(state.weatherData.location)
    }
  }, [state.weatherData, fetchWeather])

  // 切换插件状态
  const toggle = useCallback(() => {
    if (!weather) return
    
    const newState = !state.enabled
    setState(prev => ({ ...prev, enabled: newState }))
    
    // 通知插件管理器状态变化
    if (newState) {
      pluginManager.enablePlugin(weather.id)
    } else {
      pluginManager.disablePlugin(weather.id)
    }
  }, [weather, state.enabled, pluginManager])

  // 设置城市
  const setCity = useCallback((city: string) => {
    fetchWeather(city)
  }, [fetchWeather])

  // 更新设置
  const updateSettings = useCallback((settings: any) => {
    if (!weather) return
    
    // 这里可以更新插件的设置
    console.log('更新天气插件设置:', settings)
  }, [weather])

  // 获取天气预报
  const getForecast = useCallback(async (_city: string, days: number = 5) => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      // 模拟获取天气预报
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const forecast = Array.from({ length: days }, (_, index) => ({
        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString(),
        high: Math.floor(Math.random() * 10) + 20,
        low: Math.floor(Math.random() * 10) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
        precipitation: Math.floor(Math.random() * 30)
      }))
      
      setState(prev => ({ ...prev, loading: false }))
      return forecast
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取天气预报失败'
      }))
      return []
    }
  }, [])

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // 初始化插件
  useEffect(() => {
    if (!weather) return
    
    setState(prev => ({
      ...prev,
      enabled: weather.config?.enabled || false
    }))
    
    // 自动获取默认城市天气
    const defaultCity = weather.config?.settings?.city || '北京'
    fetchWeather(defaultCity)
  }, [weather, fetchWeather])

  // 监听插件状态变化
  useEffect(() => {
    if (!weather) return

    const handlePluginStateChange = (pluginId: string, newState: any) => {
      if (pluginId === weather.id) {
        setState(prev => ({ ...prev, ...newState }))
      }
    }

    // 注册事件监听器
    pluginManager.addEventListener('plugin-state-changed', handlePluginStateChange)

    return () => {
      pluginManager.removeEventListener('plugin-state-changed', handlePluginStateChange)
    }
  }, [weather, pluginManager])

  const actions: WeatherActions = {
    fetchWeather,
    refresh,
    toggle,
    setCity,
    updateSettings,
    getForecast,
    clearError
  }

  return {
    weather,
    state,
    actions
  }
}

export default useWeather
