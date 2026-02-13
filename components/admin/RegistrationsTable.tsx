'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, ChevronDown, CheckCircle, XCircle, 
  Calendar, Phone, Mail, MapPin, Moon, Home, Users 
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
import type { Registration } from '@/types';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

interface RegistrationsTableProps {
  registrations: Registration[];
}

const DAYS_MAP = {
  'day1': 'Day 1 (Feb 18)',
  'day2': 'Day 2 (Feb 19)',
  'day3': 'Day 3 (Feb 20)',
  'day4': 'Day 4 (Feb 21)',
  'day5': 'Day 5 (Feb 22)',
};

export default function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sleepFilter, setSleepFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch =
        reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.phone_number.includes(searchQuery) ||
        reg.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.email?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSleep = sleepFilter === 'all' || 
        (sleepFilter === 'yes' && reg.will_sleep) ||
        (sleepFilter === 'no' && !reg.will_sleep);

      return matchesSearch && matchesSleep;
    });
  }, [registrations, searchQuery, roleFilter, sleepFilter]);

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
      'Emergency Contact': reg.emergency_contact_name,
      'Emergency Phone': reg.emergency_contact_phone,
      'Medical Condition': reg.medical_condition || 'N/A',
      'Dietary Restrictions': reg.dietary_restrictions || 'N/A',
      'SMS Sent': reg.sms_sent ? 'Yes' : 'No',
      'Registered At': format(new Date(reg.created_at), 'dd/MM/yyyy HH:mm'),
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
    <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, phone, email, or registration number..."
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
              <SelectTrigger className="w-[180px] h-12">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Attendee">Attendee</SelectItem>
                <SelectItem value="Volunteer">Volunteer</SelectItem>
                <SelectItem value="Media Team">Media Team</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sleepFilter} onValueChange={(value) => {
              setSleepFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px] h-12">
                <Moon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sleeping over?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Sleeping Over</SelectItem>
                <SelectItem value="no">Not Sleeping</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Dropdown */}
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

      {/* Table - Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Registration #
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sleep
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                SMS
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Registered
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
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-semibold text-primary">
                      {reg.registration_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{reg.full_name}</div>
                    <div className="text-xs text-muted-foreground">{reg.age_range}, {reg.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{reg.phone_number}</div>
                    {reg.email && (
                      <div className="text-xs text-muted-foreground">{reg.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                    <span className="text-sm">
                      {reg.days_attending.length} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {reg.sms_sent ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {format(new Date(reg.created_at), 'dd/MM/yyyy HH:mm')}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expandedRow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-muted/20 p-6"
          >
            {registrations.find(r => r.id === expandedRow) && (
              <RegistrationDetails registration={registrations.find(r => r.id === expandedRow)!} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards - Mobile */}
      <div className="lg:hidden divide-y divide-border">
        <AnimatePresence>
          {paginatedRegistrations.map((reg, index) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{reg.full_name}</h3>
                  <p className="text-xs font-mono text-primary">{reg.registration_number}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {reg.phone_number}
                </div>
                {reg.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {reg.email}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {reg.area_residence}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs">
                <span className={reg.will_sleep ? 'text-indigo-600' : 'text-muted-foreground'}>
                  {reg.will_sleep ? '🛏️ Sleeping' : '🏠 Commuting'}
                </span>
                <span className="text-muted-foreground">
                  📅 {reg.days_attending.length} days
                </span>
                <span className="text-muted-foreground">
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
              ← Previous
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
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Registration Details Component
function RegistrationDetails({ registration }: { registration: Registration }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Users className="w-4 h-4" /> Personal Information
        </h4>
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Age:</span> {registration.age_range}</p>
          <p><span className="text-muted-foreground">Gender:</span> {registration.gender}</p>
          <p><span className="text-muted-foreground">Area:</span> {registration.area_residence}</p>
          <p><span className="text-muted-foreground">Status:</span> {registration.student_or_worker}</p>
          {registration.occupation && (
            <p><span className="text-muted-foreground">Occupation:</span> {registration.occupation}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Attendance
        </h4>
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Days attending:</span></p>
          <ul className="list-disc list-inside space-y-1">
            {registration.days_attending.map(day => (
              <li key={day} className="text-sm">
                {DAYS_MAP[day as keyof typeof DAYS_MAP]}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            <span className="text-muted-foreground">Sleeping:</span>{' '}
            {registration.will_sleep ? 'Yes (bring bedding)' : 'No'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Phone className="w-4 h-4" /> Emergency Contact
        </h4>
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Name:</span> {registration.emergency_contact_name}</p>
          <p><span className="text-muted-foreground">Phone:</span> {registration.emergency_contact_phone}</p>
        </div>

        {registration.medical_condition && (
          <>
            <h4 className="font-semibold text-sm text-foreground mt-4">Medical Conditions</h4>
            <p className="text-sm">{registration.medical_condition}</p>
          </>
        )}

        {registration.dietary_restrictions && (
          <>
            <h4 className="font-semibold text-sm text-foreground mt-4">Dietary Restrictions</h4>
            <p className="text-sm">{registration.dietary_restrictions}</p>
          </>
        )}
      </div>
    </div>
  );
}