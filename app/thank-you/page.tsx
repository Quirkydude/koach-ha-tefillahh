'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Download, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ConfettiEffect from '@/components/thank-you/ConfettiEffect';
import AddToCalendar from '@/components/thank-you/AddToCalendar';
import SocialShare from '@/components/thank-you/SocialShare';
import WhatToBring from '@/components/thank-you/WhatToBring';
import { Toaster } from 'react-hot-toast';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const registrationNumber = searchParams.get('reg') || 'N/A';
  const userName = searchParams.get('name') || 'Friend';

  useEffect(() => {
    setMounted(true);

    // Redirect if no registration number
    if (!searchParams.get('reg')) {
      router.push('/register');
    }
  }, [searchParams, router]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ConfettiEffect />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-b from-background via-green-50/30 to-background py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl"
              >
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Decorative Rings */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-4 border-green-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 border-4 border-green-300 rounded-full"
              />
            </div>
          </motion.div>

          {/* Main Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              You're All Set, {userName.split(' ')[0]}! 🎉
            </h1>
            <p className="text-xl text-muted-foreground">
              We can't wait to worship with you!
            </p>
          </motion.div>

          {/* Registration Number Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-primary/20"
          >
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Your Registration Number
              </p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="inline-block"
              >
                <div className="bg-gradient-to-r from-primary via-secondary to-accent px-8 py-4 rounded-2xl">
                  <p className="text-3xl md:text-4xl font-bold text-white tracking-wider">
                    {registrationNumber}
                  </p>
                </div>
              </motion.div>
              <p className="text-sm text-muted-foreground mt-4">
                📱 A confirmation SMS has been sent to your phone
              </p>
            </div>

            {/* Event Details Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <CalendarIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">SAT, 31 JAN 2026</p>
                <p className="text-xs text-muted-foreground">Save the date</p>
              </div>
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-6 mx-auto mb-2 text-2xl"
                >
                  ⏰
                </motion.div>
                <p className="text-sm font-semibold text-foreground">9:00 AM - 6:30 PM</p>
                <p className="text-xs text-muted-foreground">Full day event</p>
              </div>
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-6 mx-auto mb-2 text-2xl"
                >
                  📍
                </motion.div>
                <p className="text-sm font-semibold text-foreground">Casely-Hayford Hall</p>
                <p className="text-xs text-muted-foreground">UCC Campus</p>
              </div>
            </div>
          </motion.div>

          {/* Add to Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6"
          >
            <AddToCalendar />
          </motion.div>

          {/* Social Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6"
          >
            <SocialShare registrationNumber={registrationNumber} userName={userName} />
          </motion.div>

          {/* What to Bring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6"
          >
            <WhatToBring />
          </motion.div>

          {/* Important Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-r from-accent/10 via-secondary/10 to-primary/10 rounded-2xl p-6 mb-8 border border-primary/20"
          >
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Important Reminders
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep your registration number safe - you may need it at the venue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Gates open at 8:30 AM - arrive early for the best seats!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>We'll send you event updates and reminders via SMS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>For any questions, call 059 285 2555 or 059 475 7828</span>
              </li>
            </ul>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            See you at Divine Worship Splash 2026! 🙏✨
          </motion.p>
        </div>
      </div>
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}