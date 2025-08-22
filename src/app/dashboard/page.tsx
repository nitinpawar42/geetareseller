import { PageHeader } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Percent, ShoppingBag, Users } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { SalesChart } from '@/components/sales-chart';

const recentSales = [
  { id: 'sale_01', product: 'AcousticPro Headphones', customer: 'Alex D.', amount: 199.99, commission: 19.99, type: 'reseller' },
  { id: 'sale_02', product: 'ErgoFlow Office Chair', customer: 'Ben C.', amount: 349.99, commission: 35.00, type: 'affiliate' },
  { id: 'sale_03', product: 'Gourmet Coffee Blend', customer: 'Chloe M.', amount: 24.99, commission: 2.50, type: 'reseller' },
  { id: 'sale_04', product: 'Classic Leather Wallet', customer: 'David F.', amount: 79.99, commission: 8.00, type: 'affiliate' },
  { id: 'sale_05', product: 'YogaFlex Mat', customer: 'Eva G.', amount: 49.99, commission: 5.00, type: 'reseller' },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Your performance summary and earnings." />
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4 xl:p-6">
        <StatCard title="Total Revenue" value="$45,231.89" icon={DollarSign} trend="+20.1% from last month" />
        <StatCard title="Affiliate Commissions" value="$4,201.20" icon={Percent} trend="+15% from last month" />
        <StatCard title="Reseller Sales" value="+12,234" icon={ShoppingBag} trend="+19% from last month" />
        <StatCard title="New Customers" value="+573" icon={Users} trend="+201 since last week" />
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-5 xl:p-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Sales Overview</CardTitle>
            <CardDescription>Your sales performance over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
             <SalesChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Recent Sales</CardTitle>
            <CardDescription>Your most recent affiliate and reseller sales.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="font-medium">{sale.product}</div>
                      <div className="text-sm text-muted-foreground">{sale.customer}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sale.type === 'affiliate' ? 'default' : 'secondary'} className="capitalize">
                        {sale.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      +${sale.commission.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
