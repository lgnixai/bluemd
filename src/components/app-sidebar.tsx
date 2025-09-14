"use client"

import * as React from "react"
import { Command, Settings } from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
    MultiSidebar,
    useLeftSidebar,
} from "@/components/ui/multi-sidebar"
import { useNavMain, useNavStore } from "@/stores/nav-store"
import { PluginManagerModal } from "./plugin-manager-modal"
import { MovieSearchSidebar } from "@/plugins/movie-plugin/components/MovieSearchSidebar"

// This is sample data
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    mails: [
        {
            name: "William Smith",
            email: "williamsmith@example.com",
            subject: "Meeting Tomorrow",
            date: "09:34 AM",
            teaser:
                "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
        },
        {
            name: "Alice Smith",
            email: "alicesmith@example.com",
            subject: "Re: Project Update",
            date: "Yesterday",
            teaser:
                "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
        },
        {
            name: "Bob Johnson",
            email: "bobjohnson@example.com",
            subject: "Weekend Plans",
            date: "2 days ago",
            teaser:
                "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
        },
        {
            name: "Emily Davis",
            email: "emilydavis@example.com",
            subject: "Re: Question about Budget",
            date: "2 days ago",
            teaser:
                "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
        },
        {
            name: "Michael Wilson",
            email: "michaelwilson@example.com",
            subject: "Important Announcement",
            date: "1 week ago",
            teaser:
                "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
        },
        {
            name: "Sarah Brown",
            email: "sarahbrown@example.com",
            subject: "Re: Feedback on Proposal",
            date: "1 week ago",
            teaser:
                "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
        },
        {
            name: "David Lee",
            email: "davidlee@example.com",
            subject: "New Project Idea",
            date: "1 week ago",
            teaser:
                "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
        },
        {
            name: "Olivia Wilson",
            email: "oliviawilson@example.com",
            subject: "Vacation Plans",
            date: "1 week ago",
            teaser:
                "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
        },
        {
            name: "James Martin",
            email: "jamesmartin@example.com",
            subject: "Re: Conference Registration",
            date: "1 week ago",
            teaser:
                "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
        },
        {
            name: "Sophia White",
            email: "sophiawhite@example.com",
            subject: "Team Dinner",
            date: "1 week ago",
            teaser:
                "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof MultiSidebar>) {
    const navMain = useNavMain()
    const { setActiveItem } = useNavStore()
    const [activePlugin, setActivePlugin] = React.useState<any>(null)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false)
    const { toggleSidebar } = useLeftSidebar()

    // 处理插件点击
    const handlePluginClick = (item: any) => {
        if (activePlugin?.id === item.id) {
            // 如果点击的是当前激活的插件，关闭插件内容并切换侧边栏
            
            //toggleSidebar() // 切换显示/隐藏
            //setActivePlugin(null)
            setActiveItem(null)
           /// if (useLeftSidebar().expanded) {
                toggleSidebar() // 切换显示/隐藏
           // } 
            //toggleSidebar() // 切换显示/隐藏
        } else {
            // if (!useLeftSidebar().expanded) {
            //     toggleSidebar() // 切换显示/隐藏
            // }

            // 如果点击的是其他插件，激活该插件
            setActivePlugin(item)
            setActiveItem(item)
        }
    }

    return (
        <MultiSidebar
            side="left"
            collapsible="icon"
            {...props}
        >
            <div className="flex h-full w-full">
                {/* This is the first sidebar - icon sidebar */}
                <div className="w-[calc(var(--sidebar-width-icon)+1px)] border-r bg-sidebar text-sidebar-foreground flex flex-col">
                    <div className="flex flex-col gap-2 p-2">
                        <div className="flex items-center gap-2 p-2">
                            <a href="#" className="flex items-center gap-2">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Acme Inc</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
                        <div className="relative flex w-full min-w-0 flex-col p-2">
                            <div className="w-full text-sm">
                                <ul className="flex w-full min-w-0 flex-col gap-1">
                                    {navMain.map((item) => (
                                        <li key={item.title} className="group/menu-item relative">
                                            <button
                                                onClick={() => handlePluginClick(item)}
                                                className={`peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 ${activePlugin?.id === item.id ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground' : ''} px-2.5 md:px-2`}
                                            >
                                                <item.icon className="size-4 shrink-0" />
                                                <span className="truncate">{item.title}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 p-2">
                        <NavUser user={data.user} />
                        {/* 设置按钮 */}
                        <button
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 px-2.5 md:px-2"
                            title="插件设置"
                        >
                            <Settings className="size-4 shrink-0" />
                            <span className="truncate">插件设置</span>
                        </button>
                    </div>
                </div>

                {/* This is the second sidebar - plugin content sidebar */}
                <div className="hidden flex-1 md:flex flex-col bg-sidebar text-sidebar-foreground">
                    {activePlugin ? (
                        <>
                            <div className="flex flex-col gap-2 p-4 border-b">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <activePlugin.icon className="size-4" />
                                        </div>
                                        <div>
                                            <div className="text-foreground text-base font-medium">
                                                {activePlugin.title}
                                            </div>
                                            {activePlugin.description && (
                                                <div className="text-muted-foreground text-sm">
                                                    {activePlugin.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActivePlugin(null)
                                        }}
                                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground"
                                        title="关闭插件"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
                                <div className="relative flex w-full min-w-0 flex-col p-4">
                                    <div className="w-full text-sm">
                                        {/* 这里显示插件内容 */}
                                        <div className="plugin-content">
                                            {activePlugin.id === 'movie-data' ? (
                                                // 电影插件显示搜索条件
                                                <MovieSearchSidebar />
                                            ) : activePlugin.component ? (
                                                // 渲染插件的component属性
                                                React.createElement(activePlugin.component)
                                            ) : activePlugin.routes && activePlugin.routes.length > 0 ? (
                                                // 渲染插件的实际组件
                                                React.createElement(activePlugin.routes[0].component)
                                            ) : (
                                                // 显示默认的插件信息
                                                <>
                                                    <h3 className="text-lg font-semibold mb-4">{activePlugin.title}</h3>
                                                    <div className="space-y-3">
                                                        <div className="p-3 bg-blue-50 rounded-lg">
                                                            <p className="text-sm text-blue-800">插件功能</p>
                                                            <p className="text-xs text-blue-600">{activePlugin.description}</p>
                                                        </div>
                                                        <div className="p-3 bg-green-50 rounded-lg">
                                                            <p className="text-sm text-green-800">状态</p>
                                                            <p className="text-xs text-green-600">已激活</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
                            <div className="relative flex w-full min-w-0 flex-col p-4">
                                <div className="w-full text-sm">
                                    {/* 默认状态：没有激活插件时显示 */}
                                    <div className="plugin-content">
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">选择插件</h3>
                                            <p className="text-muted-foreground text-sm">
                                                点击左侧的插件图标来查看详细信息
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* 插件管理模态框 */}
            <PluginManagerModal 
                open={isSettingsModalOpen}
                onOpenChange={setIsSettingsModalOpen}
            />
        </MultiSidebar>
    )
}
