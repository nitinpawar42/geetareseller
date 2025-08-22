'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Shield, Store } from 'lucide-react';

function LoginForm({ userType }: { userType: 'admin' | 'reseller' }) {
    const dashboardPath = userType === 'admin' ? '/admin/dashboard' : '/reseller';
  
    return (
      <form action={dashboardPath}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${userType}-email`}>Email</Label>
            <Input
              id={`${userType}-email`}
              type="email"
              placeholder="m@example.com"
              required
              defaultValue={userType === 'admin' ? 'admin@example.com' : 'reseller@example.com'}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor={`${userType}-password`}>Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input id={`${userType}-password`} type="password" required defaultValue="password" />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          {userType === 'reseller' && (
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/reseller/register" className="underline">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </form>
    );
  }

export function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center gap-2">
                    <Sparkles className="size-8 text-primary" />
                    <h1 className="font-headline text-4xl font-bold">Welcome to AffiliateAce</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                Your one-stop shop for reselling and affiliate marketing.
                </p>
            </div>
            <Tabs defaultValue="reseller" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reseller"><Store className="mr-2" />Reseller</TabsTrigger>
                    <TabsTrigger value="admin"><Shield className="mr-2" />Admin</TabsTrigger>
                </TabsList>
                <TabsContent value="reseller">
                    <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Reseller Login</CardTitle>
                        <CardDescription>
                        Access your dashboard to find products and track earnings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm userType="reseller" />
                    </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="admin">
                    <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Admin Login</CardTitle>
                        <CardDescription>
                        Manage products, users, and platform settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm userType="admin" />
                    </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
