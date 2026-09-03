import { motion } from 'framer-motion';
import ActivityCard from './ActivityCard';

export default function ItineraryDay({ day, title, activities, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: Math.min(index * 0.08, 0.3) }}
      className="py-10 border-t border-line first:border-t-0 first:pt-0"
    >
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-display text-sm text-terracotta tracking-wide">
          DAY {String(day).padStart(2, '0')}
        </span>
        <h3 className="font-display text-2xl md:text-3xl text-charcoal">{title}</h3>
      </div>
      <div>
        {activities.map((a, i) => (
          <ActivityCard key={i} {...a} />
        ))}
      </div>
    </motion.div>
  );
}
