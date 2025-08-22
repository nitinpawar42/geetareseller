import { redirect } from 'next/navigation';

// This page is obsolete and redirects to the admin dashboard.
// The primary dashboard logic is now in /admin/dashboard and reseller-specific views.
export default function DashboardPage() {
    redirect('/admin/dashboard');
}
