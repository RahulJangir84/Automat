"use client";

import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  LayoutDashboard,
  Activity,
  Settings,
  ChevronsUpDown,
  User,
  LogOut,
  CreditCard,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Monitoring",
      url: "/monitoring",
      icon: Activity,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.05]">
      <SidebarHeader className="border-b border-white/[0.05] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-white/[0.03] transition-colors">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="size-4.5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-black">AutoMat Inc</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "w-full transition-all duration-200 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide",
                      isActive
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/25 hover:text-indigo-400"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      
      <SidebarFooter className="border-t border-white/[0.05] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="w-full data-[state=open]:bg-white/[0.05] hover:bg-white/[0.03] transition-all rounded-xl p-2"
                  />
                }
              >
                <UserButton/>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-bold text-white text-xs">
                    {user?.fullName || "User Account"}
                  </span>
                  <span className="truncate text-[10px] text-zinc-400">
                    {user?.primaryEmailAddress?.emailAddress || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-zinc-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl bg-zinc-950 border border-white/[0.08] text-white shadow-2xl p-1"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}