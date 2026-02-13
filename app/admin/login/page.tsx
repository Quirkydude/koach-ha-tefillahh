import { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | Divine Worship Splash 2026',
  description: 'Admin dashboard login',
};

export default function AdminLoginPage() {
  return <LoginForm />;
}