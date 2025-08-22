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
  SidebarInset,
} from '@/components/ui/sidebar';
import { BarChart3, LayoutGrid, Sparkles, User, Wand2 } from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'Products', icon: LayoutGrid },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/optimizer', label: 'Optimizer', icon: Wand2 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="inline-flex items-center gap-2 p-2">
            <Sparkles className="size-6 text-primary" />
            <h2 className="font-headline text-lg font-semibold">AffiliateAce</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                  }}
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
        <div className="mt-auto p-2">
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{children: 'Profile'}}>
                <a href="#">
                  <User />
                  <span>Jane Doe</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
