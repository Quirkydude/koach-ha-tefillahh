'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCards from '@/components/admin/StatsCards';
import RegistrationsTable from '@/components/admin/RegistrationsTable';
import { supabase } from '@/lib/supabase';
import type { Registration } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardContent() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!session || error) {
          console.log('No session found, redirecting to login...');
          router.push('/admin/login');
          return;
        }

        console.log('Session found:', session.user.email);
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Fetch registrations
  // Fetch registrations
const fetchRegistrations = async () => {
  try {
    const { data, error } = await supabase
      .from('prayer_conference_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    setRegistrations(data || []);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    toast.error('Failed to load registrations');
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};
  // Real-time subscription
  useEffect(() => {
    if (isCheckingAuth) return; // Don't fetch until auth is verified

    fetchRegistrations();

    // Subscribe to new registrations
    const subscription = supabase
      .channel('registrations-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.success('New registration received! 🎉', {
              duration: 5000,
            });
            fetchRegistrations();
          } else if (payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
            fetchRegistrations();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isCheckingAuth]);

  // Logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRegistrations();
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isCheckingAuth ? 'Verifying authentication...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
        {/* Header */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Divine Worship Splash 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="hidden sm:flex"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StatsCards registrations={registrations} />
          </motion.div>

          {/* Registrations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RegistrationsTable registrations={registrations} />
          </motion.div>
        </div>
      </div>
    </>
  );
}