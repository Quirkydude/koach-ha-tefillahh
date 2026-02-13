import Hero from '@/components/landing/Hero';
import CountdownTimer from '@/components/landing/CountdownTimer';
import QuickDetails from '@/components/landing/QuickDetails';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CountdownTimer />
      <QuickDetails />
      <Footer />
    </main>
  );
}