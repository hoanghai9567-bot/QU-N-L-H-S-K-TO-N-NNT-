import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  isAccent?: boolean;
}

export const StatCard = ({ title, value, icon: Icon, isAccent }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card group hover:border-[#d4af37]/30 transition-all cursor-default"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] group-hover:text-[#a3a3a3] transition-colors">
          {title}
        </p>
        <div className={isAccent ? 'text-[#d4af37]' : 'text-[#333]'}>
          <Icon size={14} strokeWidth={1.5} />
        </div>
      </div>
      <p className={`text-3xl font-serif leading-none ${isAccent ? 'text-[#d4af37]' : 'text-white'}`}>
        {value}
      </p>
    </motion.div>
  );
};
