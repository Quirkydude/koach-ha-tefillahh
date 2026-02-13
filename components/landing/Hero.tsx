'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Cross } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 sm:py-16 md:py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
        
        {/* Background Image */}
        <Image
          src="/images/prayer-bg.jpg" // Add your image to public/images/
          alt="Prayer Conference Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        
        {/* Optional: Add a subtle pattern overlay */}
        <div className="absolute inset-0 bg-pattern opacity-10 z-20" />
        
        {/* Animated gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/20 z-20" />
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-6xl mx-auto text-center w-full">
        {/* Logos Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 mb-8"
        >
          {/* Two Logos Side by Side */}
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {/* Church Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border-2 border-white/50"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                <Image
                  src="/images/church-logo.png" // Add your church logo
                  alt="Church of Pentecost Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
  
            {/* Youth Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border-2 border-white/50"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                <Image
                  src="/images/youth-logo.png" // Add your youth logo
                  alt="Youth Ministry Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
                    </div>

          {/* Church Name Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-base font-medium border border-white/30 shadow-xl"
          >
            THE CHURCH OF PENTECOST - FOSU TOWN DISTRICT
          </motion.div>
          
          {/* Presents Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full text-white/90 text-xs sm:text-sm md:text-base font-medium border border-white/20"
          >
            HABITAT ASSEMBLY YOUTH MINISTRY PRESENTS
          </motion.div>
        </motion.div>

        {/* Main Event Title - Optimized for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white/95 mb-3 sm:mb-4 drop-shadow-lg">
            5 Days Prayer Feaster
          </h2>
          
          {/* Hebrew text for mobile */}
          <div className="block sm:hidden text-white/80 text-sm mb-2 font-semibold">
            כוח התפילה
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
            <span className="block mb-2">Koach</span>
            <span className="block text-primary bg-white px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl inline-block shadow-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Ha-Tefillah
            </span>
            <span className="block mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl" style={{ fontFamily: 'cursive' }}>
              Conference
            </span>
          </h1>
        </motion.div>

        {/* Scripture Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium drop-shadow-lg bg-black/20 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
            Judges 16:19-30 • 1 Samuel 17
          </p>
        </motion.div>

        {/* Event Details - Stack on mobile, row on larger screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 text-white/95 mb-8 sm:mb-10 md:mb-12 px-2"
        >
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-white/30 w-full sm:w-auto justify-center shadow-lg text-sm sm:text-base">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">18TH - 22ND FEB, 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-white/30 w-full sm:w-auto justify-center shadow-lg text-sm sm:text-base">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">6:45 PM EACH NIGHT</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-white/30 w-full sm:w-auto justify-center shadow-lg text-sm sm:text-base">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold">HABITAT AUDITORIUM</span>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-10 sm:mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-primary/90 via-secondary/90 to-accent/90 backdrop-blur-md px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/30 shadow-2xl">
            <p className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-wide">
              #There is Power in my Prayers
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons - Stack on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg rounded-full font-bold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
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

          {/* Free Badge - Smaller on mobile */}
          <motion.div
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-white text-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-xl whitespace-nowrap"
          >
            It's FREE! 🙏
          </motion.div>
        </motion.div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/70 flex flex-col items-center gap-2"
          >
            <span className="text-xs sm:text-sm drop-shadow-lg">Scroll to explore</span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1.5 sm:p-2 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/70 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Quick Action - Fixed bottom button for mobile */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
        >
          <Link href="/register" className="block w-full">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full font-bold shadow-2xl shadow-primary/30"
            >
              Register Now - It's FREE! 🙏
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Add custom styles for the pattern */}
      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 20H50L38 30L45 45L30 35L15 45L22 30L10 20H25L30 5Z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E");
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
}