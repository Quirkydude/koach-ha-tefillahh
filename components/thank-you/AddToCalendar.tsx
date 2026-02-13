'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function AddToCalendar() {
  const eventDetails = {
    title: 'Koach Ha-Tefillah Prayer Conference',
    description: '5 Days Prayer Feaster - "There is Power in my Prayers" - Judges 16:19-30, 1 Samuel 17',
    location: 'Habitat Auditorium, Fosu, Ghana',
    startDate: '20260218T184500',
    endDate: '20260222T210000',
  };

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventDetails.title
  )}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(
    eventDetails.description
  )}&location=${encodeURIComponent(eventDetails.location)}`;

  // iCal format for Apple Calendar and Outlook
  const generateICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${eventDetails.startDate}
DTEND:${eventDetails.endDate}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'koach-ha-tefillah-conference.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calendarButtons = [
    {
      name: 'Google Calendar',
      icon: FaGoogle,
      color: 'from-red-500 to-yellow-500',
      onClick: () => window.open(googleCalendarUrl, '_blank'),
    },
    {
      name: 'Apple Calendar',
      icon: FaApple,
      color: 'from-gray-700 to-gray-900',
      onClick: generateICS,
    },
    {
      name: 'Outlook',
      icon: SiGmail,
      color: 'from-blue-500 to-blue-700',
      onClick: generateICS,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 text-foreground mb-3">
        <Calendar className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Add to Your Calendar</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {calendarButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <motion.button
              key={button.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.onClick}
              className={`bg-gradient-to-r ${button.color} text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{button.name}</span>
              <span className="sm:hidden">
                {button.name.includes('Google') ? 'Google' : button.name.includes('Apple') ? 'Apple' : 'Outlook'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}