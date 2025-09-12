import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ArchiveX, File, Inbox, Send, Trash2 } from 'lucide-react'

// 导航项类型定义
export interface NavItem {
  title: string
  url: string
  icon: any
  isActive: boolean
}

// 导航状态类型
interface NavState {
  navMain: NavItem[]
  activeItem: NavItem | null
  
  // Actions
  setActiveItem: (item: NavItem) => void
  setActiveItemByTitle: (title: string) => void
}

export const useNavStore = create<NavState>()(
  devtools(
    (set, get) => ({
      // 初始导航数据
      navMain: [
        {
          title: "Inbox",
          url: "#",
          icon: Inbox,
          isActive: true,
        },
        {
          title: "Drafts",
          url: "#",
          icon: File,
          isActive: false,
        },
        {
          title: "Sent",
          url: "#",
          icon: Send,
          isActive: false,
        },
        {
          title: "Junk",
          url: "#",
          icon: ArchiveX,
          isActive: false,
        },
        {
          title: "Trash",
          url: "#",
          icon: Trash2,
          isActive: false,
        },
      ],
      activeItem: null,

      // Actions
      setActiveItem: (item: NavItem) => 
        set((state) => ({
          navMain: state.navMain.map(navItem => ({
            ...navItem,
            isActive: navItem.title === item.title
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
        }, false, 'setActiveItemByTitle')
    }),
    {
      name: 'nav-store', // 用于 Redux DevTools
    }
  )
)

// 选择器 hooks
export const useNavMain = () => useNavStore((state) => state.navMain)
export const useActiveNavItem = () => useNavStore((state) => state.activeItem)
