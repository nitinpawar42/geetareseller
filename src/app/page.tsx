import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Store, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2">
            <Sparkles className="size-8 text-primary" />
            <h1 className="font-headline text-4xl font-bold">Welcome to AffiliateAce</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your one-stop shop for reselling and affiliate marketing.
        </p>
      </div>
      <div className="mx-auto max-w-2xl text-center mb-10">
        <h2 className="text-2xl font-semibold mb-4 font-headline">Choose Your Role</h2>
        <p className="text-muted-foreground">
          Select your role to access the appropriate dashboard and tools. Are you an administrator managing the platform, or a reseller looking to promote products?
        </p>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-8 md:grid-cols-2">
        <Link href="/admin/dashboard">
          <Card className="flex h-full transform flex-col text-center transition-all hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="size-8" />
              </div>
              <CardTitle className="font-headline text-2xl">Administrator</CardTitle>
              <CardDescription>
                Manage products, view analytics, and configure platform settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <div className="p-6 pt-0">
                <Button className="w-full">Admin Dashboard</Button>
            </div>
          </Card>
        </Link>
        <Link href="/reseller">
          <Card className="flex h-full transform flex-col text-center transition-all hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
               <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store className="size-8" />
              </div>
              <CardTitle className="font-headline text-2xl">Reseller</CardTitle>
              <CardDescription>
                Discover products, generate affiliate links, and track your earnings.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <div className="p-6 pt-0">
                <Button className="w-full">Reseller Portal</Button>
            </div>
          </Card>
        </Link>
      </div>
       <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AffiliateAce. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
