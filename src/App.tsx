import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { PluginProvider, usePluginManager } from './contexts/plugin-context'
import { moviePlugin } from './plugins/movie-plugin'
import { rssPlugin } from './plugins/rss-plugin'
import { useNavStore } from './stores/nav-store'
import Dashboard from './dashboard/page'
import { useEffect } from 'react'

// 插件初始化组件
function PluginInitializer() {
  const pluginManager = usePluginManager()
  const { initializeNavFromPlugins } = useNavStore()
  
  useEffect(() => {
    // 注册插件
    pluginManager.registerPlugin(moviePlugin)
    pluginManager.registerPlugin(rssPlugin)
    
    // 延迟初始化导航，确保所有插件都已注册
    setTimeout(() => {
      initializeNavFromPlugins()
    }, 100)
  }, [pluginManager, initializeNavFromPlugins])
  
  return null
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <PluginProvider>
        <PluginInitializer />
        <div className="font-sans">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </PluginProvider>
    </ThemeProvider>
  )
}

export default App
