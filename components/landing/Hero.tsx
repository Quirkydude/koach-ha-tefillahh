'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, Cross } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16 md:py-20">
      {/* Background with Prayer Theme */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 prayer-gradient" />
        
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-white/10 rounded-full blur-xl md:blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-48 h-48 md:w-96 md:h-96 bg-white/10 rounded-full blur-xl md:blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Floating Cross Icon */}
          <motion.div
            className="absolute top-1/4 right-1/4 text-white/10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Cross className="w-32 h-32 md:w-48 md:h-48" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center w-full">
        {/* Church Logo/Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex flex-col items-center gap-3 mb-8"
        >
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white/95 text-xs md:text-sm font-medium border border-white/30 shadow-lg">
            THE CHURCH OF PENTECOST - FOSU TOWN DISTRICT
          </div>
          <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-xs md:text-sm font-medium border border-white/20">
            YOUTH MINISTRY HABITAT ASSEMBLY PRESENTS
          </div>
        </motion.div>

        {/* Main Event Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-4 drop-shadow-lg">
            5 Days Prayer Feaster
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight drop-shadow-2xl">
            <span className="block mb-2">Koach</span>
            <span className="block text-primary bg-white/95 px-6 py-2 rounded-2xl inline-block shadow-2xl">
              Ha-Tefillah
            </span>
            <span className="block mt-4 text-3xl md:text-5xl lg:text-6xl" style={{ fontFamily: 'cursive' }}>
              Conference
            </span>
          </h1>
        </motion.div>

        {/* Scripture Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-lg">
            Judges 16:19-30, 1 Samuel 17
          </p>
        </motion.div>

        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 lg:gap-6 text-white/95 mb-8 md:mb-12"
        >
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 w-fit shadow-lg">
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">18TH - 22ND FEB, 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 w-fit shadow-lg">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">6:45 PM EACH NIGHT</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 w-fit shadow-lg">
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">HABITAT AUDITORIUM</span>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-white/30 shadow-2xl">
            <p className="text-white font-bold text-lg md:text-xl tracking-wide">
              #There is Power in my Prayers
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 md:px-12 md:py-7 text-base md:text-lg rounded-full font-bold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Register Now
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </Button>
          </Link>

          {/* Free Badge */}
          <motion.div
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-white text-primary px-6 py-3 rounded-full font-bold text-lg shadow-xl whitespace-nowrap"
          >
            It's FREE! 🙏
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/70 flex flex-col items-center gap-2"
          >
            <span className="text-sm drop-shadow-lg">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white/70 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}