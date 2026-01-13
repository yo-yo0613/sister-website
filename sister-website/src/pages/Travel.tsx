import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard/PostCard'; // 💡 統一使用組件
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion } from 'framer-motion';

const Travel: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("category", "==", "Travel"), // 💡 確保 category 名稱正確
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center font-serif italic text-neutral-400 animate-pulse">
      正在讀取二姊的世界足跡...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-16 border-b border-neutral-100 pb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-serif text-secondary italic mb-4"
        >
          Travel
        </motion.h1>
        <p className="text-sm text-neutral-400 tracking-[0.3em] uppercase font-medium">出國旅遊 · 雞不擇食的世界足跡</p>
      </header>

      {posts.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} /> 
          ))}
        </motion.div>
      ) : (
        <div className="py-32 text-center text-neutral-300 italic font-serif text-lg">
          尚未開啟新的旅程。
        </div>
      )}
    </div>
  );
};

export default Travel;