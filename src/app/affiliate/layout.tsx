'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  LayoutDashboard,
  LogOut,
  Rocket,
  Settings,
  User,
  PlusCircle,
  Trophy,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/affiliate/my-clients') return 'My Clients';
    if (pathname === '/affiliate/add-client') return 'Add New Client';
    if (pathname === '/affiliate/700-club') return 'UnlockScore AI 700 Club';
    return 'Affiliate Dashboard';
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link
            href="/affiliate/dashboard"
            className="flex items-center gap-2"
          >
            <Rocket className="size-6 text-primary" />
            <span className="text-lg font-semibold font-headline text-sidebar-foreground">
              UnlockScore AI
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/affiliate/dashboard"
                asChild
                isActive={pathname === '/affiliate/dashboard'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/affiliate/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                href="/affiliate/add-client"
                isActive={pathname === '/affiliate/add-client'}
                tooltip={{ children: 'Add Client' }}>
                <Link href="/affiliate/add-client">
                  <PlusCircle />
                  <span>Add Client</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                href="/affiliate/my-clients"
                isActive={pathname === '/affiliate/my-clients'}
                tooltip={{ children: 'My Clients' }}>
                <Link href="/affiliate/my-clients">
                  <Users />
                  <span>My Clients</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                href="/affiliate/700-club"
                isActive={pathname === '/affiliate/700-club'}
                tooltip={{ children: '700 Club' }}
              >
                <Link href="/affiliate/700-club">
                  <Trophy />
                  <span>700 Club</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{ children: 'Account' }}>
                <User />
                <span>Account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{ children: 'Settings' }}>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-6 sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold font-headline">{getPageTitle()}</h1>
          </div>
          {pathname === '/affiliate/dashboard' && (
              <Button asChild>
                  <Link href="/affiliate/add-client">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
                  </Link>
              </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Affiliate" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
