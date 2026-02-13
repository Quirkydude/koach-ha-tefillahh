import { Metadata } from 'next';
import DashboardContent from './DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard | Koach Ha-Tefillah Conference',
  description: 'Admin dashboard for managing registrations',
};

export default function AdminDashboardPage() {
  return <DashboardContent />;
}