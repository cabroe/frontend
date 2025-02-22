import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/ui/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar/>
        <main className="flex-1">          
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
