// components/admin/StatsCards.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Users, Calendar, Moon, HeartPulse, Utensils, 
  UserCheck, TrendingUp, Activity, PieChart,
  Briefcase, GraduationCap, MapPin
} from 'lucide-react';
import type { Registration, Stats } from '@/types';
import { 
  PieChart as RePieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface StatsCardsProps {
  registrations: Registration[];
}

export default function StatsCards({ registrations }: StatsCardsProps) {
  // Calculate all stats
  const totalRegistrations = registrations.length;
  
  // Today's registrations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRegistrations = registrations.filter(r => {
    const regDate = new Date(r.created_at);
    regDate.setHours(0, 0, 0, 0);
    return regDate.getTime() === today.getTime();
  }).length;

  // Gender distribution
  const byGender = {
    Male: registrations.filter(r => r.gender === 'Male').length,
    Female: registrations.filter(r => r.gender === 'Female').length,
  };

  // Age distribution
  const byAge = {
    '12-17': registrations.filter(r => r.age_range === '12-17').length,
    '18-25': registrations.filter(r => r.age_range === '18-25').length,
    '26-35': registrations.filter(r => r.age_range === '26-35').length,
    '36+': registrations.filter(r => r.age_range === '36+').length,
  };

  // Role distribution
  const byRole = {
    Attendee: registrations.filter(r => r.role === 'Attendee').length,
    Volunteer: registrations.filter(r => r.role === 'Volunteer').length,
    'Media Team': registrations.filter(r => r.role === 'Media Team').length,
  };

  // Days attendance
  const byDay = {
    day1: registrations.filter(r => r.days_attending.includes('day1')).length,
    day2: registrations.filter(r => r.days_attending.includes('day2')).length,
    day3: registrations.filter(r => r.days_attending.includes('day3')).length,
    day4: registrations.filter(r => r.days_attending.includes('day4')).length,
    day5: registrations.filter(r => r.days_attending.includes('day5')).length,
  };

  // Other stats
  const sleepingOver = registrations.filter(r => r.will_sleep).length;
  const withMedicalConditions = registrations.filter(r => r.medical_condition?.trim()).length;
  const withDietaryRestrictions = registrations.filter(r => r.dietary_restrictions?.trim()).length;
  
  // Student/Worker ratio
  const studentWorkerRatio = {
    Student: registrations.filter(r => r.student_or_worker === 'Student').length,
    Worker: registrations.filter(r => r.student_or_worker === 'Worker').length,
  };

  // Top areas
  const areaCounts = registrations.reduce((acc, r) => {
    acc[r.area_residence] = (acc[r.area_residence] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topAreas = Object.entries(areaCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Colors for charts
  const COLORS = ['#C75F2E', '#5C342A', '#4DB8E8', '#9CA3AF', '#6B7280'];

  // Stats cards data
  const statsCards = [
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
      change: `${((sleepingOver / totalRegistrations) * 100).toFixed(1)}% of total`,
    },
    {
      title: 'Medical Conditions',
      value: withMedicalConditions,
      icon: HeartPulse,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      change: `${((withMedicalConditions / totalRegistrations) * 100).toFixed(1)}% need attention`,
    },
    {
      title: 'Dietary Restrictions',
      value: withDietaryRestrictions,
      icon: Utensils,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: `${((withDietaryRestrictions / totalRegistrations) * 100).toFixed(1)}% special diet`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Gender Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Male', value: byGender.Male },
                    { name: 'Female', value: byGender.Female },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
              <span className="text-sm">Male: {byGender.Male}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
              <span className="text-sm">Female: {byGender.Female}</span>
            </div>
          </div>
        </motion.div>

        {/* Age Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Age Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(byAge).map(([age, count]) => ({ age, count }))}>
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Days Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Daily Attendance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Day 1', count: byDay.day1 },
                { day: 'Day 2', count: byDay.day2 },
                { day: 'Day 3', count: byDay.day3 },
                { day: 'Day 4', count: byDay.day4 },
                { day: 'Day 5', count: byDay.day5 },
              ]}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Student vs Worker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Students vs Workers
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Students', value: studentWorkerRatio.Student },
                    { name: 'Workers', value: studentWorkerRatio.Worker },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS[1]} />
                  <Cell fill={COLORS[2]} />
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
              <span className="text-sm">Students: {studentWorkerRatio.Student}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[2] }} />
              <span className="text-sm">Workers: {studentWorkerRatio.Worker}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Areas */}
      {topAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Top 5 Areas
          </h3>
          <div className="space-y-3">
            {topAreas.map(([area, count], index) => (
              <div key={area} className="flex items-center gap-3">
                <span className="text-sm font-medium w-24 truncate">{area}:</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / totalRegistrations) * 100}%` }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}