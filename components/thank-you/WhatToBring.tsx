'use client';

import { motion } from 'framer-motion';
import { Book, Heart, Users, Moon } from 'lucide-react';

export default function WhatToBring() {
  const items = [
    {
      icon: Book,
      text: 'Your Bible and a notebook for taking notes',
      color: 'text-primary',
    },
    {
      icon: Heart,
      text: 'An open heart ready to encounter God',
      color: 'text-red-500',
    },
    {
      icon: Users,
      text: 'A friend or family member (it\'s free!)',
      color: 'text-blue-500',
    },
    {
      icon: Moon,
      text: 'Bedding & toiletries (if sleeping at venue)',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center text-foreground mb-4">
        What to Bring
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl"
            >
              <div className={`${item.color} mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-foreground flex-1">{item.text}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}