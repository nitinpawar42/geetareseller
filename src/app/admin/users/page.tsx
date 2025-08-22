import AppLayout from '@/components/layout/app-layout';
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
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const users = [
  { id: 'user_01', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'reseller', status: 'Active', joined: '2023-01-15', totalEarnings: 1250.75, avatar: 'https://placehold.co/40x40.png' },
  { id: 'user_02', name: 'John Smith', email: 'john.smith@example.com', role: 'affiliate', status: 'Active', joined: '2023-02-20', totalEarnings: 850.00, avatar: 'https://placehold.co/40x40.png' },
  { id: 'user_03', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'reseller', status: 'Pending', joined: '2023-03-10', totalEarnings: 0.00, avatar: 'https://placehold.co/40x40.png' },
  { id: 'user_04', name: 'Robert Brown', email: 'robert.b@example.com', role: 'affiliate', status: 'Inactive', joined: '2022-11-05', totalEarnings: 2300.50, avatar: 'https://placehold.co/40x40.png' },
  { id: 'user_05', name: 'Emily White', email: 'emily.w@example.com', role: 'reseller', status: 'Active', joined: '2023-05-01', totalEarnings: 310.25, avatar: 'https://placehold.co/40x40.png' },
];

const statusVariant = {
  Active: 'default',
  Pending: 'secondary',
  Inactive: 'outline',
};

export default function UsersPage() {
  return (
    <AppLayout userType="admin">
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
                  <TableHead className="text-right">Total Earnings</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[user.status as keyof typeof statusVariant] || 'default'} className="capitalize">
                        {user.status}
                      </Badge>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
       </main>
    </AppLayout>
  );
}
