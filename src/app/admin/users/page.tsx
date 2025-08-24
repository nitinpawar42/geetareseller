
'use client';

import { useEffect, useState, useTransition } from 'react';
import { PageHeader } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MoreHorizontal, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, getUsers, updateUserStatus } from '@/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const statusVariant: Record<User['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Active: 'default',
  Pending: 'secondary',
  Inactive: 'outline',
  Suspended: 'destructive',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch user data.',
       });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleUpdateStatus = (uid: string, newStatus: User['status']) => {
    startTransition(async () => {
        try {
            await updateUserStatus(uid, newStatus);
            setUsers(prevUsers => 
                prevUsers.map(u => u.uid === uid ? {...u, status: newStatus} : u)
            );
            toast({
                title: 'Success',
                description: `User status updated to ${newStatus}.`
            });
        } catch (error) {
            console.error('Failed to update status', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update user status.',
            });
        }
    });
  };

  return (
    <>
      <PageHeader title="User Management" description="View and manage all users on the platform." />
       <main className="p-4 xl:p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all resellers and affiliates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Total Earnings</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                   ))
                ) : (
                  users.map((user) => (
                    <TableRow key={user.uid} className={isPending ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.photoURL || undefined} alt={user.fullName} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[user.status]} className="capitalize">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(user.joinedAt, 'PP')}
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        ${user.totalEarnings.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {user.status === 'Pending' && (
                               <DropdownMenuItem onSelect={() => handleUpdateStatus(user.uid, 'Active')}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    Approve
                                </DropdownMenuItem>
                            )}
                             {user.status === 'Active' && (
                                <DropdownMenuItem onSelect={() => handleUpdateStatus(user.uid, 'Suspended')} className="text-destructive">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Suspend
                                </DropdownMenuItem>
                             )}
                             {user.status === 'Suspended' && (
                                <DropdownMenuItem onSelect={() => handleUpdateStatus(user.uid, 'Active')}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    Reactivate
                                </DropdownMenuItem>
                             )}
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
       </main>
    </>
  );
}
