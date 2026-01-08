import React from 'react';
import { motion } from 'framer-motion';
import TopArticle from '../components/TopArticle/TopArticle';
import ContentSection from '../components/ContentSection/ContentSection';

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-neutral-50"
    >
      {/* 直接由 TopArticle 擔任 Hero 角色 
         TopArticle 內部的文字可以直接改成原本標語的內容
      */}
      <TopArticle />

      {/* 內容區塊 */}
      <div className="max-w-7xl mx-auto">
        <ContentSection />
      </div>
    </motion.div>
  );
};

export default Home;