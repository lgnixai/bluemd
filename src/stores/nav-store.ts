import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { samplePlugins } from '../plugin-system/plugins/sample-plugins'

// 导航项类型定义
export interface NavItem {
  id: string
  title: string
  description?: string
  icon: any
  isActive: boolean
  url?: string
}

// 导航状态类型
interface NavState {
  navMain: NavItem[]
  activeItem: NavItem | null
  
  // Actions
  setActiveItem: (item: NavItem | null) => void
  setActiveItemByTitle: (title: string) => void
  setActiveItemById: (id: string) => void
  updateNavMain: (plugins: any[]) => void
}

export const useNavStore = create<NavState>()(
  devtools(
    (set) => ({
      // 初始导航数据 - 使用插件数据
      navMain: samplePlugins
        .filter(plugin => plugin.config?.showInNav !== false)
        .sort((a, b) => (a.config?.position || 0) - (b.config?.position || 0))
        .map((plugin, index) => ({
          id: plugin.id,
          title: plugin.name,
          description: plugin.description,
          icon: plugin.icon,
          isActive: index === 0, // 第一个插件默认激活
          url: "#"
        })),
      activeItem: null,

      // Actions
      setActiveItem: (item: NavItem | null) => 
        set((state) => ({
          navMain: state.navMain.map(navItem => ({
            ...navItem,
            isActive: item ? navItem.id === item.id : false
          })),
          activeItem: item
        }), false, 'setActiveItem'),
      
      setActiveItemByTitle: (title: string) => 
        set((state) => {
          const item = state.navMain.find(navItem => navItem.title === title)
          if (item) {
            return {
              navMain: state.navMain.map(navItem => ({
                ...navItem,
                isActive: navItem.title === title
              })),
              activeItem: item
            }
          }
          return state
        }, false, 'setActiveItemByTitle'),
      
      setActiveItemById: (id: string) => 
        set((state) => {
          const item = state.navMain.find(navItem => navItem.id === id)
          if (item) {
            return {
              navMain: state.navMain.map(navItem => ({
                ...navItem,
                isActive: navItem.id === id
              })),
              activeItem: item
            }
          }
          return state
        }, false, 'setActiveItemById'),
      
      updateNavMain: (plugins: any[]) => 
        set(() => ({
          navMain: plugins
            .filter(plugin => plugin.config?.showInNav !== false && plugin.installed)
            .sort((a, b) => (a.config?.position || 0) - (b.config?.position || 0))
            .map((plugin) => ({
              id: plugin.id,
              title: plugin.name,
              description: plugin.description,
              icon: plugin.icon,
              isActive: false,
              url: "#"
            }))
        }), false, 'updateNavMain')
    }),
    {
      name: 'nav-store', // 用于 Redux DevTools
    }
  )
)

// 选择器 hooks
export const useNavMain = () => useNavStore((state) => state.navMain)
export const useActiveNavItem = () => useNavStore((state) => state.activeItem)
