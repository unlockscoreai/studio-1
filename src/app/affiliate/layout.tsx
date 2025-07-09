'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  LayoutDashboard,
  LogOut,
  Rocket,
  Settings,
  PlusCircle,
  Trophy,
  DollarSign,
  UserCircle,
  BarChart3,
  Mail,
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
    if (pathname === '/affiliate/client-management') return 'Client Management';
    if (pathname === '/affiliate/add-client') return 'Add New Client';
    if (pathname === '/affiliate/700-club') return 'UnlockScore AI 700 Club';
    if (pathname === '/affiliate/payouts') return 'Payouts';
    if (pathname === '/affiliate/reports') return 'Reports';
    if (pathname === '/affiliate/messaging') return 'Messaging';
    return 'Affiliate Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
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
                  href="/affiliate/client-management"
                  isActive={pathname.startsWith('/affiliate/client-management') || pathname === '/affiliate/my-clients'}
                  tooltip={{ children: 'Client Management' }}>
                  <Link href="/affiliate/client-management">
                    <Users />
                    <span>Clients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  href="/affiliate/messaging"
                  isActive={pathname === '/affiliate/messaging'}
                  tooltip={{ children: 'Messaging' }}
                >
                  <Link href="/affiliate/messaging">
                    <Mail />
                    <span>Messaging</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  href="/affiliate/reports"
                  isActive={pathname === '/affiliate/reports'}
                  tooltip={{ children: 'Reports' }}
                >
                  <Link href="/affiliate/reports">
                    <BarChart3 />
                    <span>Reports</span>
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
                <SidebarMenuButton
                  asChild
                  href="/affiliate/payouts"
                  isActive={pathname === '/affiliate/payouts'}
                  tooltip={{ children: 'Payouts' }}
                >
                  <Link href="/affiliate/payouts">
                    <DollarSign />
                    <span>Payouts</span>
                  </Link>
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
                    <SidebarMenuButton tooltip={{ children: 'CreditUp Solutions' }}>
                        <UserCircle />
                        <span>CreditUp Solutions</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Log Out' }}>
                  <Link href="/">
                    <LogOut />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 bg-secondary/30">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-6 sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold font-headline">{getPageTitle()}</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild size="sm">
                  <Link href="/affiliate/add-client">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
                  </Link>
              </Button>
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
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
