import { AppSidebar } from "@/components/app-sidebar"
import { MovieSearchResults } from "@/plugins/movie-plugin/components/MovieSearchResults"
import { useMovieSearchStore } from "@/stores/movie-search-store"
import { useNavStore } from "@/stores/nav-store"

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

function ContentArea() {
  const { activeItem } = useNavStore();
  const { movies, loading, total, currentPage, totalPages, setCurrentPage, filters } = useMovieSearchStore();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 触发新的搜索
    if (activeItem?.id === 'movie-data') {
      // 这里需要调用搜索函数，但我们需要从MovieSearchSidebar获取搜索函数
      // 暂时通过事件系统来处理
      window.dispatchEvent(new CustomEvent('movie-search', { 
        detail: { filters, page } 
      }));
    }
  };

  const handleMovieClick = (movie: any) => {
    console.log('点击电影:', movie);
    // 这里可以添加电影详情页面或弹窗
  };

  // 如果激活的是电影插件，显示搜索结果
  if (activeItem?.id === 'movie-data') {
    return (
      <MovieSearchResults
        movies={movies}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onMovieClick={handleMovieClick}
      />
    );
  }

  // 默认内容
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl" />
      <div className="bg-muted/50 mx-auto h-[100vh] w-full max-w-3xl rounded-xl" />
    </div>
  );
}

export default function Dashboard() {
  return (
    <MultiSidebarProvider style={
      {
        "--sidebar-width": "350px",
      } as React.CSSProperties
    }>
      <AppSidebar />
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
        <ContentArea />
      </MultiSidebarInset>
      <SidebarRight />
    </MultiSidebarProvider>
  )
}
