import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard/PostCard';
import { db } from '../firebase';
// 💡 優化：引入 where 進行資料庫層級篩選
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion } from 'framer-motion';

const Taipei: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 實質優化：直接在資料庫篩選 category，效能比 .filter() 更好
    const q = query(
      collection(db, "posts"),
      where("category", "==", "Taipei"),
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
    <div className="min-h-[60vh] flex items-center justify-center font-serif italic text-neutral-400">
      正在同步台北的美食記憶...
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
          Taipei
        </motion.h1>
        <p className="text-sm text-neutral-400 tracking-[0.3em] uppercase font-medium">台北美食探索 · 都市裡的味蕾旅行</p>
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
          這裡暫時還沒有故事，敬請期待。
        </div>
      )}
    </div>
  );
};

export default Taipei;