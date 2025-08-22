import AppLayout from '@/components/layout/app-layout';

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout userType="reseller">{children}</AppLayout>;
}
