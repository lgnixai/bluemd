import { AppSidebar } from "@/components/app-sidebar"

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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl" />
          <div className="bg-muted/50 mx-auto h-[100vh] w-full max-w-3xl rounded-xl" />
        </div>
      </MultiSidebarInset>
      <SidebarRight />
    </MultiSidebarProvider>
  )
}
