import AppLayout from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { OptimizerForm } from '@/components/optimizer-form';

export default function OptimizerPage() {
  return (
    <AppLayout userType="admin">
      <PageHeader title="Commission Optimizer" description="Use AI to find the sweet spot for your commission splits." />
      <main className="p-4 xl:p-6">
        <OptimizerForm />
      </main>
    </AppLayout>
  );
}
