//? AUTH
import { auth } from "@/auth";
import type { Session } from "next-auth";
//? SHADCN
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(ui)/dashboard/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  //* Await result of auth function, which retrieves current session
  const session: Session | null = await auth();

  if (!session) return <div className="mt-5 text-center">Access Denied</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative">
        {children}
        <SidebarTrigger style={{
          position: 'fixed',
          bottom: '0',
          right: '0',
          width: '50px',
          height: '50px',
          zIndex: 10,
          borderRadius: '50%',
        }} />
      </main>
    </SidebarProvider>
  );
}
