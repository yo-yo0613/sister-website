import React, { useEffect, useState } from 'react';
import { motion, } from 'framer-motion';
import TopArticle from '../components/TopArticle/TopArticle';
import ContentSection from '../components/ContentSection/ContentSection';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const Home: React.FC = () => {
  const [latestPost, setLatestPost] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: null, name: 'Latest' },
    { id: 'Travel', name: 'Travel' },
    { id: 'NewTaipei', name: 'New Taipei' },
    { id: 'Taipei', name: 'Taipei' },
    { id: 'Taichung', name: 'Taichung' }
  ];

  useEffect(() => {
    // 抓取最新一篇發布的文章
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-white"
    >
      <TopArticle post={latestPost} />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        {/* 💡 行動版友善的分類切換條 */}
        <div className="flex overflow-x-auto no-scrollbar gap-8 mb-16 border-b border-neutral-100 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap text-[10px] tracking-[0.4em] uppercase font-bold transition-all duration-500 relative ${
                activeCategory === cat.id ? 'text-primary' : 'text-neutral-300 hover:text-secondary'
              }`}
            >
              {cat.name}
              {activeCategory === cat.id && (
                <motion.div 
                  layoutId="activeCircle" 
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* 傳入 activeCategory 到內容區塊進行過濾 */}
        <ContentSection category={activeCategory} />
      </div>
    </motion.div>
  );
};

export default Home;