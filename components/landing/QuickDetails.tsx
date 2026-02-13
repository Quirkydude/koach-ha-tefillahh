'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Heart, Book, Flame, Sparkles } from 'lucide-react';

const details = [
  {
    icon: Flame,
    title: '5 Powerful Nights',
    description: 'Feb 18th - 22nd, 2026',
    color: 'from-primary to-primary/80',
  },
  {
    icon: Clock,
    title: 'Evening Sessions',
    description: '6:45 PM each night',
    color: 'from-secondary to-secondary/80',
  },
  {
    icon: Users,
    title: 'All Are Welcome',
    description: 'Youth & Adults',
    color: 'from-accent to-accent/80',
  },
  {
    icon: Book,
    title: 'Bible-Centered',
    description: 'Judges 16 & 1 Samuel 17',
    color: 'from-primary to-secondary',
  },
  {
    icon: Heart,
    title: 'Prayer & Worship',
    description: 'Powerful intercession',
    color: 'from-accent to-primary',
  },
  {
    icon: Sparkles,
    title: 'Free Entry',
    description: 'No registration fees',
    color: 'from-secondary to-accent',
  },
];

export default function QuickDetails() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What to Expect
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for 5 days of powerful prayer, worship, and spiritual breakthrough
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-border hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative mb-6">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${detail.color} flex items-center justify-center shadow-lg`}
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 },
                      }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${detail.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {detail.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {detail.description}
                  </p>

                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to experience the power of prayer?
          </p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-primary via-secondary to-accent text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300"
          >
            Register for the Conference →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}