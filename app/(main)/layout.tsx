import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

export default async function MainLayout({
    children
}:{
    children:React.ReactNode
})
{
    const {userId} =await auth();
    if(!userId){
        redirect("/sign-in")
    }

    const clerkUser = await currentUser();

    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-[#030014]">
          <AppSidebar />
          <main className="flex-1 flex flex-col overflow-y-auto px-6 py-4">
            <div className="flex items-center h-12 mb-4">
              <SidebarTrigger/>
            </div>
            <div className="flex-1 w-full max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
}