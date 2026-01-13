import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TopArticle from '../components/TopArticle/TopArticle';
import ContentSection from '../components/ContentSection/ContentSection';
// 引入 Firebase 必要的工具
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const Home: React.FC = () => {
  const [latestPost, setLatestPost] = useState<any>(null);

  useEffect(() => {
    // 💡 只需要抓取「最新的一篇」公開文章給 TopArticle 用
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setLatestPost(data);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-neutral-50"
    >
      {/* 💡 唯一改動：把抓到的最新文章傳進去 */}
      <TopArticle post={latestPost} />

      {/* 內容區塊保持原樣 */}
      <div className="max-w-7xl mx-auto">
        <ContentSection />
      </div>
    </motion.div>
  );
};

export default Home;