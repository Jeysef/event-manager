import { AppSidebar } from "@/components/compositions/app-sidebar";
import { SiteHeader } from "@/components/compositions/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
