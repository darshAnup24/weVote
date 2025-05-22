
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Vote, MessageSquare, Settings, PanelLeft, Shield, PlusCircle, LogOut, UserCircle } from "lucide-react";
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
import { mockCurrentUser } from "@/lib/mock-data"; // For simulated auth
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const UserNav = () => {
  // In a real app, you'd get user from AuthContext
  const user = mockCurrentUser;

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link href="/login"> {/* Placeholder for actual login page */}
          Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            {/* <AvatarImage src={user.avatarUrl} alt={user.name || user.email} /> */}
            <AvatarFallback>
              {user.name ? user.name.charAt(0).toUpperCase() : <UserCircle className="h-6 w-6"/>}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled> {/* Placeholder for actual logout */}
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const AppHeader = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  
  let pageTitle = "Dashboard";
  if (pathname.startsWith("/voting")) pageTitle = "Secure Voting";
  else if (pathname.startsWith("/elections/create")) pageTitle = "Create Election";
  // Removed global discussions title

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}
       <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
       <div className="ml-auto">
        <UserNav />
      </div>
    </header>
  );
};

export function MainAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems: NavItem[] = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/voting", label: "Voting", icon: Vote },
    { href: "/elections/create", label: "Create Election", icon: PlusCircle },
    // Removed global discussions link
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
