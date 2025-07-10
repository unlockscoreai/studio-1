
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  Rocket,
  Settings,
  User,
  FileText,
  DollarSign,
  Building,
  CalendarCheck,
  Briefcase,
  TrendingUp,
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

export default function BusinessClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/business-client/get-reports')) return 'Get Business Reports';
    if (pathname.startsWith('/business-client/book-consultation')) return 'Book Consultation';
    if (pathname.startsWith('/business-client/vendor-applications')) return 'Vendor Applications';
    if (pathname.startsWith('/business-client/business-growth')) return 'Business Growth';
    if (pathname.startsWith('/business-client/funding')) return 'Funding';
    if (pathname.startsWith('/business-client/account')) return 'My Business';
    return 'Business Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/business-client/dashboard" className="flex items-center gap-2">
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
                  href="/business-client/dashboard"
                  asChild
                  isActive={pathname === '/business-client/dashboard'}
                  tooltip={{ children: 'Dashboard' }}
                >
                  <Link href="/business-client/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/business-client/account"
                  asChild
                  isActive={pathname.startsWith('/business-client/account')}
                  tooltip={{ children: 'My Business' }}
                >
                  <Link href="/business-client/account">
                    <Building />
                    <span>My Business</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/business-client/get-reports"
                  asChild
                  isActive={pathname.startsWith('/business-client/get-reports')}
                  tooltip={{ children: 'Get Reports' }}
                >
                  <Link href="/business-client/get-reports">
                    <FileText />
                    <span>Get Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  href="/business-client/vendor-applications"
                  asChild
                  isActive={pathname.startsWith('/business-client/vendor-applications')}
                  tooltip={{ children: 'Vendor Applications' }}
                >
                  <Link href="/business-client/vendor-applications">
                    <Briefcase />
                    <span>Vendor Applications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  href="/business-client/business-growth"
                  asChild
                  isActive={pathname.startsWith('/business-client/business-growth')}
                  tooltip={{ children: 'Business Growth' }}
                >
                  <Link href="/business-client/business-growth">
                    <TrendingUp />
                    <span>Business Growth</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton
                  href="/business-client/book-consultation"
                  asChild
                  isActive={pathname.startsWith('/business-client/book-consultation')}
                  tooltip={{ children: 'Book Consultation' }}
                >
                  <Link href="/business-client/book-consultation">
                    <CalendarCheck />
                    <span>Book Consultation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: 'Funding' }}
                >
                  <Link href="/business-client/funding">
                    <DollarSign />
                    <span>Funding</span>
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
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704b" alt="Business" />
                      <AvatarFallback>BC</AvatarFallback>
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
