
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
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
  LayoutDashboard,
  Beer,
  Boxes,
  Users,
  FileText,
  BarChart3,
  Settings,
  ClipboardList,
  ShoppingCart,
} from 'lucide-react';
import { Logo } from './logo';
import { UserNav } from './user-nav';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/sales', label: 'Sales', icon: ShoppingCart },
  { href: '/products', label: 'Products', icon: Beer },
  { href: '/stock', label: 'Stock', icon: Boxes },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/expenses', label: 'Expenses', icon: FileText },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

function ClientOnlySidebar({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/settings'}>
                  <a href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      )}
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="ml-auto">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <ClientOnlySidebar pathname={pathname}>
        {children}
      </ClientOnlySidebar>
    </SidebarProvider>
  );
}
