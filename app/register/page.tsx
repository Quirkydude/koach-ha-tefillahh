import { Metadata } from 'next';
import RegistrationForm from '@/components/registration/RegistrationForm';

export const metadata: Metadata = {
  title: 'Register Now | Divine Worship Splash 2026',
  description: 'Register for Divine Worship Splash 2026 - A transformative day of worship with Yefter Nkansah',
};

export default function RegisterPage() {
  return <RegistrationForm />;
}