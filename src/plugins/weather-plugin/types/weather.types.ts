/**
 * 天气插件类型定义
 */

// 天气数据接口
export interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  timestamp: string
}

// 天气预报数据接口
export interface ForecastData {
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
}

// 天气状态接口
export interface WeatherState {
  enabled: boolean
  weatherData: WeatherData | null
  loading: boolean
  error: string | null
  lastUpdate: Date | null
}

// 天气操作接口
export interface WeatherActions {
  fetchWeather: (city: string) => Promise<void>
  refresh: () => void
  toggle: () => void
  setCity: (city: string) => void
  updateSettings: (settings: any) => void
  getForecast: (city: string, days?: number) => Promise<ForecastData[]>
  clearError: () => void
}

// 天气设置接口
export interface WeatherSettings {
  city: string
  unit: 'celsius' | 'fahrenheit'
  language: 'zh-CN' | 'en-US'
  autoRefresh: boolean
  refreshInterval: number
  showForecast: boolean
  forecastDays: number
}

// 天气API响应接口
export interface WeatherAPIResponse {
  success: boolean
  data?: WeatherData
  error?: string
  timestamp: string
}

// 天气条件枚举
export enum WeatherCondition {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  STORMY = 'stormy',
  FOGGY = 'foggy',
  WINDY = 'windy'
}

// 温度单位枚举
export enum TemperatureUnit {
  CELSIUS = 'celsius',
  FAHRENHEIT = 'fahrenheit',
  KELVIN = 'kelvin'
}

// 风速单位枚举
export enum WindSpeedUnit {
  KMH = 'kmh',
  MPH = 'mph',
  MS = 'ms'
}

// 天气插件配置接口
export interface WeatherPluginConfig {
  apiKey?: string
  defaultCity: string
  defaultUnit: TemperatureUnit
  defaultLanguage: string
  autoRefresh: boolean
  refreshInterval: number
  showForecast: boolean
  forecastDays: number
  showAlerts: boolean
  theme: 'light' | 'dark' | 'auto'
}

// 天气警报接口
export interface WeatherAlert {
  id: string
  type: 'warning' | 'watch' | 'advisory'
  title: string
  description: string
  severity: 'low' | 'moderate' | 'high' | 'extreme'
  startTime: string
  endTime: string
  areas: string[]
}

// 天气统计接口
export interface WeatherStats {
  averageTemperature: number
  maxTemperature: number
  minTemperature: number
  averageHumidity: number
  totalPrecipitation: number
  averageWindSpeed: number
  sunnyDays: number
  rainyDays: number
  cloudyDays: number
}

// 地理位置接口
export interface Location {
  name: string
  country: string
  region: string
  latitude: number
  longitude: number
  timezone: string
}

// 天气图标映射接口
export interface WeatherIconMap {
  [key: string]: {
    icon: string
    color: string
    description: string
  }
}

// 天气插件事件接口
export interface WeatherEvent {
  type: 'weather-updated' | 'forecast-updated' | 'alert-received' | 'error-occurred'
  data: any
  timestamp: string
}

// 天气插件API接口
export interface WeatherAPI {
  // 基础天气数据
  getCurrentWeather: (city: string) => Promise<WeatherData>
  getForecast: (city: string, days: number) => Promise<ForecastData[]>
  
  // 地理位置
  getLocation: (query: string) => Promise<Location[]>
  getCurrentLocation: () => Promise<Location>
  
  // 天气警报
  getAlerts: (city: string) => Promise<WeatherAlert[]>
  
  // 天气统计
  getWeatherStats: (city: string, period: string) => Promise<WeatherStats>
  
  // 设置管理
  updateSettings: (settings: WeatherSettings) => Promise<void>
  getSettings: () => Promise<WeatherSettings>
}

// 天气插件工具函数接口
export interface WeatherUtils {
  // 单位转换
  celsiusToFahrenheit: (celsius: number) => number
  fahrenheitToCelsius: (fahrenheit: number) => number
  kmhToMph: (kmh: number) => number
  mphToKmh: (mph: number) => number
  
  // 格式化
  formatTemperature: (temp: number, unit: TemperatureUnit) => string
  formatWindSpeed: (speed: number, unit: WindSpeedUnit) => string
  formatHumidity: (humidity: number) => string
  formatVisibility: (visibility: number) => string
  
  // 图标和颜色
  getWeatherIcon: (condition: string) => string
  getWeatherColor: (condition: string) => string
  getConditionDescription: (condition: string) => string
}

