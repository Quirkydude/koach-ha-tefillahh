'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Shirt, Smile } from 'lucide-react';

export default function WhatToBring() {
  const items = [
    {
      icon: Heart,
      text: 'Your enthusiasm and open heart',
      color: 'text-red-500',
    },
    {
      icon: Users,
      text: 'A friend or family member (it\'s free!)',
      color: 'text-blue-500',
    },
    {
      icon: Shirt,
      text: 'Comfortable clothes for a full day',
      color: 'text-green-500',
    },
    {
      icon: Smile,
      text: 'Your beautiful smile and positive energy',
      color: 'text-yellow-500',
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