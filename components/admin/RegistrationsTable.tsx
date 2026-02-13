// components/admin/RegistrationsTable.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, ChevronDown, CheckCircle, XCircle, 
  Calendar, Phone, Mail, MapPin, Moon, Home, Users, 
  HeartPulse, Utensils, Briefcase, GraduationCap, AlertCircle,
  ChevronLeft, ChevronRight, User, Clock, Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Registration } from '@/types';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { DAYS_MAP } from '@/types';

interface RegistrationsTableProps {
  registrations: Registration[];
}

export default function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sleepFilter, setSleepFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const itemsPerPage = 10;

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = 
        reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.phone_number.includes(searchQuery) ||
        reg.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        reg.area_residence.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || reg.role === roleFilter;
      const matchesSleep = sleepFilter === 'all' || 
        (sleepFilter === 'yes' && reg.will_sleep) ||
        (sleepFilter === 'no' && !reg.will_sleep);
      const matchesGender = genderFilter === 'all' || reg.gender === genderFilter;

      return matchesSearch && matchesRole && matchesSleep && matchesGender;
    });
  }, [registrations, searchQuery, roleFilter, sleepFilter, genderFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegistrations = filteredRegistrations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredRegistrations.map((reg) => ({
      'Registration Number': reg.registration_number,
      'Registration Date': format(new Date(reg.created_at), 'dd/MM/yyyy HH:mm'),
      'Full Name': reg.full_name,
      'Phone Number': reg.phone_number,
      'Email': reg.email || 'N/A',
      'Age Range': reg.age_range,
      'Gender': reg.gender,
      'Area of Residence': reg.area_residence,
      'Student/Worker': reg.student_or_worker,
      'Occupation': reg.occupation || 'N/A',
      'Will Sleep': reg.will_sleep ? 'Yes' : 'No',
      'Days Attending': reg.days_attending.map(d => DAYS_MAP[d as keyof typeof DAYS_MAP]).join(', '),
      'Role': reg.role,
      'Emergency Contact Name': reg.emergency_contact_name,
      'Emergency Contact Phone': reg.emergency_contact_phone,
      'Medical Condition': reg.medical_condition || 'None',
      'Dietary Restrictions': reg.dietary_restrictions || 'None',
      'SMS Sent': reg.sms_sent ? 'Yes' : 'No',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `prayer-conference-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported successfully!');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Attendee':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Volunteer':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Media Team':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, phone, email, reg number, or area..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={roleFilter} onValueChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[160px] h-12">
                  <Users className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Attendee">Attendee</SelectItem>
                  <SelectItem value="Volunteer">Volunteer</SelectItem>
                  <SelectItem value="Media Team">Media Team</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genderFilter} onValueChange={(value) => {
                setGenderFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] h-12">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sleepFilter} onValueChange={(value) => {
                setSleepFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[160px] h-12">
                  <Moon className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sleeping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Sleeping Over</SelectItem>
                  <SelectItem value="no">Not Sleeping</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToCSV}>
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {paginatedRegistrations.length} of {filteredRegistrations.length} registrations
            {filteredRegistrations.length !== registrations.length && (
              <span className="ml-2 text-primary font-medium">
                (filtered from {registrations.length} total)
              </span>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Reg #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Name & Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Demographics
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Sleep
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  SMS
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {paginatedRegistrations.map((reg, index) => (
                  <motion.tr
                    key={reg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                      selectedRegistration?.id === reg.id ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedRegistration(reg)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-semibold text-primary">
                        {reg.registration_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{reg.full_name}</div>
                      <div className="text-xs text-muted-foreground">{reg.phone_number}</div>
                      {reg.email && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{reg.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{reg.age_range}, {reg.gender}</div>
                      <div className="text-xs text-muted-foreground">{reg.area_residence}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleBadgeColor(reg.role)}>
                        {reg.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium">
                        {reg.days_attending.length} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reg.will_sleep ? (
                        <span className="flex items-center gap-1 text-indigo-600">
                          <Moon className="w-4 h-4" />
                          Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Home className="w-4 h-4" />
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reg.sms_sent ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(reg.created_at), 'dd/MM/yy HH:mm')}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-border">
          <AnimatePresence>
            {paginatedRegistrations.map((reg, index) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                  selectedRegistration?.id === reg.id ? 'bg-primary/5' : ''
                }`}
                onClick={() => setSelectedRegistration(reg)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{reg.full_name}</h3>
                    <p className="text-xs font-mono text-primary">{reg.registration_number}</p>
                  </div>
                  <Badge className={getRoleBadgeColor(reg.role)}>
                    {reg.role}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {reg.phone_number}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {reg.area_residence}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {reg.age_range}, {reg.gender}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {reg.days_attending.length} days
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-xs">
                  <span className={reg.will_sleep ? 'text-indigo-600' : 'text-muted-foreground'}>
                    {reg.will_sleep ? '🛏️ Sleeping' : '🏠 Commuting'}
                  </span>
                  <span className={reg.sms_sent ? 'text-green-600' : 'text-red-600'}>
                    {reg.sms_sent ? '✅ SMS Sent' : '❌ SMS Pending'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t bg-muted/20">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Registration Details Modal/View */}
      <AnimatePresence>
        {selectedRegistration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Registration Details
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRegistration(null)}
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency</TabsTrigger>
                  <TabsTrigger value="health">Health & Diet</TabsTrigger>
                </TabsList>

                {/* Personal Information */}
                <TabsContent value="personal" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Registration Number</label>
                        <p className="text-lg font-mono font-bold text-primary">{selectedRegistration.registration_number}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                        <p className="text-base font-semibold">{selectedRegistration.full_name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                        <p className="text-base flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          {selectedRegistration.phone_number}
                          {selectedRegistration.sms_sent ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">SMS Sent</span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">SMS Pending</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <p className="text-base flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          {selectedRegistration.email || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Age Range</label>
                        <p className="text-base flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          {selectedRegistration.age_range}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Gender</label>
                        <p className="text-base">{selectedRegistration.gender}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Area of Residence</label>
                        <p className="text-base flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {selectedRegistration.area_residence}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Registered On</label>
                        <p className="text-base flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {format(new Date(selectedRegistration.created_at), 'EEEE, MMMM do, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Attendance Information */}
                <TabsContent value="attendance" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Student or Worker</label>
                        <p className="text-base flex items-center gap-2">
                          {selectedRegistration.student_or_worker === 'Student' ? (
                            <GraduationCap className="w-4 h-4 text-primary" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-primary" />
                          )}
                          {selectedRegistration.student_or_worker}
                        </p>
                      </div>
                      {selectedRegistration.occupation && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Occupation</label>
                          <p className="text-base">{selectedRegistration.occupation}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Role</label>
                        <p className="text-base mt-1">
                          <Badge className={getRoleBadgeColor(selectedRegistration.role)}>
                            {selectedRegistration.role}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Sleep at Venue</label>
                        <p className="text-base flex items-center gap-2">
                          {selectedRegistration.will_sleep ? (
                            <>
                              <Moon className="w-4 h-4 text-indigo-600" />
                              <span className="text-indigo-600 font-medium">Yes, will sleep</span>
                            </>
                          ) : (
                            <>
                              <Home className="w-4 h-4 text-muted-foreground" />
                              <span>No, will commute</span>
                            </>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Days Attending</label>
                        <div className="mt-2 space-y-2">
                          {selectedRegistration.days_attending.map((day) => (
                            <div key={day} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{DAYS_MAP[day as keyof typeof DAYS_MAP]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Emergency Contact */}
                <TabsContent value="emergency" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Emergency Contact Name</label>
                        <p className="text-base flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-primary" />
                          {selectedRegistration.emergency_contact_name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Emergency Contact Phone</label>
                        <p className="text-base flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          {selectedRegistration.emergency_contact_phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Health & Dietary */}
                <TabsContent value="health" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Medical Conditions</label>
                        <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                          {selectedRegistration.medical_condition ? (
                            <p className="text-base flex items-start gap-2">
                              <HeartPulse className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{selectedRegistration.medical_condition}</span>
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No medical conditions reported</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Dietary Restrictions</label>
                        <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                          {selectedRegistration.dietary_restrictions ? (
                            <p className="text-base flex items-start gap-2">
                              <Utensils className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{selectedRegistration.dietary_restrictions}</span>
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No dietary restrictions</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}