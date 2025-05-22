"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Vote, MessageSquare, Settings, PanelLeft, Shield } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const Logo = () => (
  <div className="flex items-center gap-2 px-4 py-6">
    <Shield className="h-8 w-8 text-primary" />
    <span className="text-2xl font-bold text-primary">VoteWise</span>
  </div>
);

const AppHeader = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  
  let pageTitle = "Dashboard";
  if (pathname.startsWith("/voting")) pageTitle = "Secure Voting";
  else if (pathname.startsWith("/discussions")) pageTitle = "Anonymous Discussions";


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}
       <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
    </header>
  );
};

export function MainAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems: NavItem[] = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/voting", label: "Voting", icon: Vote },
    { href: "/discussions", label: "Discussions", icon: MessageSquare },
  ];

  return (
    <SidebarProvider defaultOpen collapsible="icon">
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                    tooltip={{ children: item.label, side: "right", align: "center" }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* Optional: Settings or Logout links can be added here */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
