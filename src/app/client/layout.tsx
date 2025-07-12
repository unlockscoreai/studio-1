'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  Rocket,
  Settings,
  User,
  ShieldAlert,
  Mail,
  Send,
  Gavel,
  ClipboardCheck,
  FileHeart,
  FileText,
  Briefcase,
  Lightbulb,
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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/client/disputes')) return 'My Disputes';
    if (pathname.startsWith('/client/letters')) return 'My Letters';
    if (pathname.startsWith('/client/mailing-instructions')) return 'Mailing Instructions';
    if (pathname.startsWith('/client/cfpb-guide')) return 'CFPB Complaint Guide';
    if (pathname.startsWith('/client/business-ai')) return 'Unlock Business AI';
    if (pathname.startsWith('/client/account')) return 'My Account';
    if (pathname.startsWith('/client/onboarding')) return 'Complete Your Onboarding';
    if (pathname.startsWith('/client/credit-analysis')) return 'Credit Analysis';
    if (pathname.startsWith('/client/get-credit-reports')) return 'Get Credit Reports';
    if (pathname.startsWith('/client/tradeline-strategy')) return 'Tradeline Strategy';
    if (pathname.startsWith('/client/credit-boosters')) return 'Credit Boosters';
    return 'Client Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/client/dashboard" className="flex items-center gap-2">
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
                  href="/client/dashboard"
                  asChild
                  isActive={pathname === '/client/dashboard'}
                  tooltip={{ children: 'Dashboard' }}
                >
                  <Link href="/client/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/onboarding"
                  asChild
                  isActive={pathname.startsWith('/client/onboarding')}
                  tooltip={{ children: 'Onboarding' }}
                >
                  <Link href="/client/onboarding">
                    <ClipboardCheck />
                    <span>Onboarding</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/credit-analysis"
                  asChild
                  isActive={pathname.startsWith('/client/credit-analysis')}
                  tooltip={{ children: 'Credit Analysis' }}
                >
                  <Link href="/client/credit-analysis">
                    <FileHeart />
                    <span>Credit Analysis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/get-credit-reports"
                  asChild
                  isActive={pathname.startsWith('/client/get-credit-reports')}
                  tooltip={{ children: 'Get Credit Reports' }}
                >
                  <Link href="/client/get-credit-reports">
                    <FileText />
                    <span>Get Credit Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/disputes"
                  asChild
                  isActive={pathname.startsWith('/client/disputes')}
                  tooltip={{ children: 'My Disputes' }}
                >
                  <Link href="/client/disputes">
                    <ShieldAlert />
                    <span>My Disputes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/letters"
                  asChild
                  isActive={pathname.startsWith('/client/letters')}
                  tooltip={{ children: 'My Letters' }}
                >
                  <Link href="/client/letters">
                    <Mail />
                    <span>My Letters</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/tradeline-strategy"
                  asChild
                  isActive={pathname.startsWith('/client/tradeline-strategy')}
                  tooltip={{ children: 'Tradeline Strategy' }}
                >
                  <Link href="/client/tradeline-strategy">
                    <Lightbulb />
                    <span>Tradeline Strategy</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/credit-boosters"
                  asChild
                  isActive={pathname.startsWith('/client/credit-boosters')}
                  tooltip={{ children: 'Credit Boosters' }}
                >
                  <Link href="/client/credit-boosters">
                    <TrendingUp />
                    <span>Credit Boosters</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/mailing-instructions"
                  asChild
                  isActive={pathname.startsWith('/client/mailing-instructions')}
                  tooltip={{ children: 'Mailing Instructions' }}
                >
                  <Link href="/client/mailing-instructions">
                    <Send />
                    <span>Mailing Instructions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/cfpb-guide"
                  asChild
                  isActive={pathname.startsWith('/client/cfpb-guide')}
                  tooltip={{ children: 'CFPB Guide' }}
                >
                  <Link href="/client/cfpb-guide">
                    <Gavel />
                    <span>CFPB Guide</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/business-ai"
                  asChild
                  isActive={pathname.startsWith('/client/business-ai')}
                  tooltip={{ children: 'Business AI' }}
                >
                  <Link href="/client/business-ai">
                    <Briefcase />
                    <span>Business AI</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/client/account"
                  asChild
                  isActive={pathname.startsWith('/client/account')}
                  tooltip={{ children: 'My Account' }}
                >
                  <Link href="/client/account">
                    <User />
                    <span>My Account</span>
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
                      <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Client" />
                      <AvatarFallback>SL</AvatarFallback>
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
