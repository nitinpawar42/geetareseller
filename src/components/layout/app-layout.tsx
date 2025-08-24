
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import { BarChart3, LayoutGrid, Sparkles, User, Wand2, Home, ShoppingBag, Users, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/optimizer', label: 'Optimizer', icon: Wand2 },
];
  
const resellerNavItems = [
    { href: '/reseller/products', label: 'Products', icon: LayoutGrid },
];

export default function AppLayout({ children, userType }: { children: React.ReactNode, userType: 'admin' | 'reseller' }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const navItems = userType === 'admin' ? adminNavItems : resellerNavItems;
  const profileName = userType === 'admin' ? 'Admin User' : 'Jane Doe';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while signing out. Please try again.',
      });
    }
  };


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
            <SidebarMenuItem>
                 <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                  tooltip={{
                    children: 'Home',
                  }}
                >
                  <a href="/">
                    <Home />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
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
                  <span>{profileName}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={{children: 'Logout'}}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
