'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Cross } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary to-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Cross className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Koach Ha-Tefillah</h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              A 5-day prayer conference hosted by The Church of Pentecost, Fosu Town District Youth Ministry Habitat Assembly.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Habitat Auditorium, Fosu</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">habitatyouth@cop.org</span>
              </div>
            </div>
          </motion.div>

          {/* Event Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-4">Event Details</h3>
            <div className="space-y-2 text-white/80 text-sm">
              <p>📅 February 18-22, 2026</p>
              <p>⏰ 6:45 PM Each Night</p>
              <p>📍 Habitat Auditorium</p>
              <p className="font-semibold text-white mt-4">#ThereIsPowerInMyPrayers</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-white/20 pt-8 text-center"
        >
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} The Church of Pentecost - Fosu Town District. All rights reserved.
          </p>
          <p className="text-white/60 text-sm mt-2">
            Youth Ministry Habitat Assembly
          </p>
        </motion.div>
      </div>
    </footer>
  );
}