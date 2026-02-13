import { Metadata } from 'next';
import RegistrationForm from '@/components/registration/RegistrationForm';

export const metadata: Metadata = {
  title: 'Register Now | Koach Ha-Tefillah Prayer Conference 2026',
  description: 'Register for 5 days of powerful prayer at Koach Ha-Tefillah Conference - Feb 18-22, 2026',
};

export default function RegisterPage() {
  return <RegistrationForm />;
}