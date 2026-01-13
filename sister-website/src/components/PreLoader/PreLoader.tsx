import React from 'react';
import { motion } from 'framer-motion';

const PreLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
      className="fixed inset-0 z-[999] bg-primary-light flex flex-col items-center justify-center"
    >
      <div className="overflow-hidden">
        {/* 💡 Logo 浮現動畫 */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-4xl font-serif italic text-secondary font-bold tracking-tighter"
        >
          雞不 <span className="text-primary">擇食</span>
        </motion.div>
      </div>

      {/* 💡 進度條提示 */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="h-[1px] bg-secondary/20 mt-6 w-24 relative"
      >
        <motion.div 
          className="absolute inset-0 bg-secondary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[10px] tracking-[0.5em] text-secondary/40 uppercase mt-4 font-bold"
      >
        Gourmet & Lifestyle
      </motion.p>
    </motion.div>
  );
};

export default PreLoader;