import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white pt-32 px-10"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-serif text-secondary border-l-4 border-primary pl-6 mb-12"
        >
          關於我們 <span className="text-sm text-neutral-400 block tracking-widest uppercase mt-2">About Sister</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
             {/* 這裡之後放二姊的照片 */}
             <div className="w-full h-full bg-primary-light/20 flex items-center justify-center text-secondary-light tracking-widest">IMAGE PLACEHOLDER</div>
          </div>
          <div className="space-y-6">
            <p className="text-secondary leading-relaxed tracking-wide">
              這裡寫入關於二姊的專業背景或是網頁的創立初衷。我們採用簡約且極具質感的設計語彙，為每一位客戶提供最精準的解決方案。
            </p>
            <p className="text-neutral-400 leading-relaxed">
              以低飽和度的橘色與咖啡色為基調，營造出溫暖且值得信賴的企業形象。
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;