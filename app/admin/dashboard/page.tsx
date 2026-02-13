import { Metadata } from 'next';
import DashboardContent from './DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard | Divine Worship Splash 2026',
  description: 'Admin dashboard for managing registrations',
};

export default function AdminDashboardPage() {
  return <DashboardContent />;
}