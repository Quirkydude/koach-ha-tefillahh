'use client';

import { motion } from 'framer-motion';
import { Users, UserCheck, Briefcase, Moon, Calendar, TrendingUp } from 'lucide-react';
import type { Registration } from '@/types';

interface StatsCardsProps {
  registrations: Registration[];
}

export default function StatsCards({ registrations }: StatsCardsProps) {
  const totalRegistrations = registrations.length;
  const sleepingOver = registrations.filter((r) => r.will_sleep).length;

  // Calculate today's registrations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRegistrations = registrations.filter((r) => {
    const regDate = new Date(r.created_at);
    regDate.setHours(0, 0, 0, 0);
    return regDate.getTime() === today.getTime();
  }).length;

  // Calculate days distribution
  const dayCounts = {
    day1: registrations.filter(r => r.days_attending.includes('day1')).length,
    day2: registrations.filter(r => r.days_attending.includes('day2')).length,
    day3: registrations.filter(r => r.days_attending.includes('day3')).length,
    day4: registrations.filter(r => r.days_attending.includes('day4')).length,
    day5: registrations.filter(r => r.days_attending.includes('day5')).length,
  };

  const stats = [
    {
      title: 'Total Registrations',
      value: totalRegistrations,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: `+${todayRegistrations} today`,
    },
    {
      title: 'Sleeping Over',
      value: sleepingOver,
      icon: Moon,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      change: `${((sleepingOver / totalRegistrations) * 100).toFixed(0)}% of total`,
    },
    
    {
      title: 'Day 1 Attendance',
      value: dayCounts.day1,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: `${dayCounts.day2} on Day 2, ${dayCounts.day3} on Day 3`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className={`text-xs font-medium ${stat.textColor} bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                <TrendingUp className="w-4 h-4 inline" />
              </div>
            </div>

            <div className="mb-2">
              <motion.h3
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                className="text-4xl font-bold text-foreground"
              >
                {stat.value.toLocaleString()}
              </motion.h3>
            </div>

            <p className="text-sm font-medium text-muted-foreground mb-2">
              {stat.title}
            </p>

            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}