import React from 'react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-6"
    >
      {/* 核心標語區域 */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-serif text-secondary mb-6 tracking-widest leading-tight">
          優雅與專業的<br /><span className="text-primary">完美契合</span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl tracking-[0.2em] font-light">
          SISTER DESIGN / PROFESSIONAL SERVICES
        </p>
      </motion.div>
      
      {/* 裝飾線條 */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="w-32 h-[1px] bg-primary mt-12"
      />
    </motion.div>
  );
};

export default Home;