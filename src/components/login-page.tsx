
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
import { Sparkles, Shield, Store, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getUser, registerAdmin } from '@/services/user-service';

function LoginForm({ userType }: { userType: 'admin' | 'reseller' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userData = await getUser(firebaseUser.uid);

      if (!userData) {
        throw new Error("Could not find user data. Please contact support.");
      }

      // Admin Login
      if (userType === 'admin') {
        if (userData.role !== 'admin') {
          throw new Error("You do not have administrative privileges.");
        }
        router.push('/admin/dashboard');
      } 
      // Reseller Login
      else {
        if (userData.role !== 'reseller') {
            throw new Error("This account is not a reseller account.");
        }
        switch(userData.status) {
            case 'Active':
                router.push('/reseller/products');
                break;
            case 'Pending':
                throw new Error("Your account is pending approval. You'll be notified via email once it's reviewed.");
            case 'Suspended':
                 throw new Error("Your account has been suspended. Please contact support.");
            case 'Inactive':
                throw new Error("Your account is inactive. Please contact support.");
            default:
                throw new Error("Unknown account status. Please contact support.");
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : error.message || 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${userType}-email`}>Email</Label>
          <Input
            id={`${userType}-email`}
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            defaultValue={userType === 'admin' ? 'nitinpawar41@gmail.com' : 'reseller@example.com'}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor={`${userType}-password`}>Password</Label>
            {userType === 'reseller' && (
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            )}
          </div>
          <Input id={`${userType}-password`} name="password" type="password" required defaultValue="Nirved@12345" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

function AdminRegistrationForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        try {
            await registerAdmin(email, password, fullName);
            toast({
                title: 'Admin Registered',
                description: 'You can now log in with these credentials.',
            });
            // You might want to switch tabs or just let the user log in.
            // For now, we'll just show the toast.
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="admin-reg-fullName">Full Name</Label>
                    <Input id="admin-reg-fullName" name="fullName" placeholder="Admin User" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="admin-reg-email">Email</Label>
                    <Input id="admin-reg-email" name="email" type="email" placeholder="admin@example.com" required defaultValue="nitinpawar41@gmail.com" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="admin-reg-password">Password</Label>
                    <Input id="admin-reg-password" name="password" type="password" required defaultValue="Nirved@12345" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Admin Account
                </Button>
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
            <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
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
                 <TabsContent value="register">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-headline">Admin Registration</CardTitle>
                        <CardDescription>
                          Create the initial admin account.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AdminRegistrationForm />
                      </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
