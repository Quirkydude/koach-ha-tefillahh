'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, ChevronDown, CheckCircle, XCircle, Calendar, Phone, Mail, MapPin } from 'lucide-react';
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

export default function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [firstTimeFilter, setFirstTimeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch =
        reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.phone_number.includes(searchQuery) ||
        reg.registration_number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || reg.role === roleFilter;
      const matchesFirstTime =
        firstTimeFilter === 'all' ||
        (firstTimeFilter === 'yes' && reg.first_time_attendee) ||
        (firstTimeFilter === 'no' && !reg.first_time_attendee);

      return matchesSearch && matchesRole && matchesFirstTime;
    });
  }, [registrations, searchQuery, roleFilter, firstTimeFilter]);

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
      'Gender': reg.gender || 'N/A',
      'First Time': reg.first_time_attendee ? 'Yes' : 'No',
      'Role': reg.role,
      'Department': reg.executive_department || 'N/A',
      'Area': reg.area_residence || 'N/A',
      'SMS Sent': reg.sms_sent ? 'Yes' : 'No',
      'Registered At': format(new Date(reg.created_at), 'dd/MM/yyyy HH:mm'),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `divine-worship-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported successfully!');
  };

  // Export to Excel (CSV with .xlsx extension for Excel compatibility)
  const exportToExcel = () => {
    const csvData = filteredRegistrations.map((reg) => ({
      'Registration Number': reg.registration_number,
      'Full Name': reg.full_name,
      'Phone Number': `'${reg.phone_number}`, // Preserve leading zero
      'Email': reg.email || 'N/A',
      'Age Range': reg.age_range,
      'Gender': reg.gender || 'N/A',
      'First Time': reg.first_time_attendee ? 'Yes' : 'No',
      'Role': reg.role,
      'Department': reg.executive_department || 'N/A',
      'Area': reg.area_residence || 'N/A',
      'SMS Sent': reg.sms_sent ? 'Yes' : 'No',
      'Registered At': format(new Date(reg.created_at), 'dd/MM/yyyy HH:mm'),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `divine-worship-registrations-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to Excel successfully!');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Attendee':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Executive':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Guest Minister':
        return 'bg-orange-100 text-orange-700 border-orange-200';
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
              placeholder="Search by name, phone, or registration number..."
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
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Attendee">Attendee</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
                <SelectItem value="Guest Minister">Guest Minister</SelectItem>
              </SelectContent>
            </Select>

            <Select value={firstTimeFilter} onValueChange={(value) => {
              setFirstTimeFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="First time?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attendees</SelectItem>
                <SelectItem value="yes">First-timers</SelectItem>
                <SelectItem value="no">Returning</SelectItem>
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
                <DropdownMenuItem onClick={exportToExcel}>
                  Export as Excel
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
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                First Time
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
                    {reg.email && (
                      <div className="text-xs text-muted-foreground">{reg.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {reg.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getRoleBadgeColor(reg.role)}>
                      {reg.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {reg.first_time_attendee ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
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
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{reg.full_name}</h3>
                  <p className="text-xs font-mono text-primary">{reg.registration_number}</p>
                </div>
                <Badge className={getRoleBadgeColor(reg.role)}>
                  {reg.role}
                </Badge>
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
                {reg.area_residence && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {reg.area_residence}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(reg.created_at), 'dd/MM/yyyy HH:mm')}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">
                  {reg.first_time_attendee ? '🆕 First-timer' : '🔁 Returning'}
                </span>
                <span className="text-xs text-muted-foreground">
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