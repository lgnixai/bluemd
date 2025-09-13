import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { PluginProvider, usePluginManager } from './contexts/plugin-context'
import { samplePlugins } from './plugins/sample-plugins-simple'
import Dashboard from './dashboard/page'
import { useEffect } from 'react'

// 插件初始化组件
function PluginInitializer() {
  const pluginManager = usePluginManager()
  
  useEffect(() => {
    // 注册示例插件
    samplePlugins.forEach(plugin => {
      pluginManager.registerPlugin(plugin)
    })
  }, [pluginManager])
  
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
