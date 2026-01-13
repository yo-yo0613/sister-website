import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard/PostCard'; // 💡 引入新組件
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Taipei: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 採用最穩定的全抓取邏輯
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        // 💡 關鍵篩選：依照頁面需求修改 "Taipei" 字串
        .filter((post: any) => post.category === "Taipei" && post.status === "published");

      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="py-20 text-center font-serif italic text-neutral-400">正在同步雲端數據...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-neutral-100 pb-8">
        <h1 className="text-4xl font-serif text-secondary italic">Taipei</h1>
        <p className="text-sm text-neutral-400 mt-2 tracking-widest uppercase">台北美食探索</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} /> 
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-neutral-300 italic">尚未有相關文章。</div>
      )}
    </div>
  );
};

export default Taipei;