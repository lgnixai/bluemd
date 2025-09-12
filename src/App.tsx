import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { PluginProvider } from './plugin-system'
import Dashboard from './dashboard/page'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <PluginProvider>
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
