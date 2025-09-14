import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { MovieSearchResults } from "@/plugins/movie-plugin/components/MovieSearchResults"
import { PluginDetailContent } from "@/components/plugin-detail-content"
import { useNavStore } from "@/stores/nav-store"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SidebarRight } from '@/components/sidebar-right'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  MultiSidebarInset,
  MultiSidebarProvider,
  MultiSidebarTrigger,
} from '@/components/ui/multi-sidebar'

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      retry: 1,
    },
  },
});

function ContentArea({ selectedPlugin }: { selectedPlugin?: any }) {
  const { activeItem } = useNavStore();

  const handleMovieClick = (movie: any) => {
    console.log('点击电影:', movie);
    // 这里可以添加电影详情页面或弹窗
  };

  // 如果激活的是电影插件，显示搜索界面（左侧搜索条件，右侧搜索结果）
  if (activeItem?.id === 'movie-data') {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex h-full">
          {/* 左侧：搜索条件区域 */}
          {/* <div className="w-80 border-r bg-gray-50 overflow-y-auto">
            <MovieSearchSidebar />
          </div>
           */}
        
          <div className="flex-1 overflow-y-auto">
            <MovieSearchResults
              onMovieClick={handleMovieClick}
            />
          </div>
        </div>
      </QueryClientProvider>
    );
  }

  // 如果激活的是插件管理，显示插件详情
  if (activeItem?.id === 'plugin-manager') {
    return (
      <div className="flex-1 overflow-y-auto">
        <PluginDetailContent plugin={selectedPlugin} />
      </div>
    );
  }

  // 默认内容
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="bg-muted/50 mx-auto h-[100vh] w-full max-w-3xl rounded-xl" >内容区</div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedPlugin, setSelectedPlugin] = React.useState<any>(null);

  return (
    <MultiSidebarProvider style={
      {
        "--sidebar-width": "350px",
      } as React.CSSProperties
    }>
      <AppSidebar onSelectedPluginChange={setSelectedPlugin} />
      <MultiSidebarInset>
        <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <MultiSidebarTrigger side="left" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-3">
            <MultiSidebarTrigger side="right" />
          </div>
        </header>
        <ContentArea selectedPlugin={selectedPlugin} />
      </MultiSidebarInset>
      <SidebarRight />
    </MultiSidebarProvider>
  )
}
