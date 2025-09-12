import { Routes, Route } from 'react-router-dom'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import Dashboard from './dashboard/page'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
