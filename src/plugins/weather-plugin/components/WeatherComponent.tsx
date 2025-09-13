import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
// import { WeatherData, WeatherState } from '../types/weather.types'

/**
 * 天气插件主组件
 */
export const WeatherComponent: React.FC = () => {
  const { weather, state, actions } = useWeather()
  const [city, setCity] = useState('北京')
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius')

  useEffect(() => {
    actions.fetchWeather(city)
  }, [city])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />
      case 'cloudy':
      case 'overcast':
        return <Cloud className="w-8 h-8 text-gray-500" />
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-200" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  const formatTemperature = (temp: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`
    }
    return `${Math.round(temp)}°C`
  }

  return (
    <div className="weather-plugin p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {weather && <weather.icon className="w-6 h-6" />}
              <CardTitle>{weather?.name || '天气插件'}</CardTitle>
            </div>
            <Badge variant={state.enabled ? 'default' : 'secondary'}>
              {state.enabled ? '已启用' : '已禁用'}
            </Badge>
          </div>
          <CardDescription>
            {weather?.description || '提供实时天气信息'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 城市选择和单位设置 */}
          <div className="flex gap-2">
            <Input
              placeholder="输入城市名称"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1"
            />
            <Select value={unit} onValueChange={(value: 'celsius' | 'fahrenheit') => setUnit(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">°C</SelectItem>
                <SelectItem value="fahrenheit">°F</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => actions.fetchWeather(city)} disabled={state.loading}>
              {state.loading ? '获取中...' : '刷新'}
            </Button>
          </div>

          {/* 天气信息显示 */}
          {state.weatherData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 当前天气 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">当前天气</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(state.weatherData.condition)}
                      <div>
                        <div className="text-2xl font-bold">
                          {formatTemperature(state.weatherData.temperature)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {state.weatherData.condition}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{state.weatherData.location}</div>
                      <div>{new Date(state.weatherData.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 详细信息 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">详细信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">体感温度</div>
                        <div>{formatTemperature(state.weatherData.feelsLike)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">湿度</div>
                        <div>{state.weatherData.humidity}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">风速</div>
                        <div>{state.weatherData.windSpeed} km/h</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">能见度</div>
                        <div>{state.weatherData.visibility} km</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {state.loading ? '正在获取天气信息...' : '暂无天气数据'}
            </div>
          )}

          {/* 错误信息 */}
          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">
                错误: {state.error}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button 
              onClick={() => actions.toggle()}
              variant="outline"
            >
              {state.enabled ? '禁用插件' : '启用插件'}
            </Button>
            <Button 
              onClick={() => actions.refresh()}
              variant="outline"
            >
              刷新数据
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WeatherComponent
