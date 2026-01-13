import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// 1. 引入 Firebase
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const About: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. 監聽 Firestore 的 posts 集合
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="py-20 text-center font-serif italic text-neutral-400">正在讀取旅遊故事...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-neutral-100 pb-8">
        <h1 className="text-4xl font-serif text-secondary italic">出國旅遊</h1>
        <p className="text-sm text-neutral-400 mt-2 tracking-widest uppercase">雞不擇食的世界足跡</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.map((post) => (
            // 3. 使用 Link 讓每篇文章可以點擊進入詳情頁
            <Link to={`/post/${post.id}`} key={post.id} className="group block">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                {/* 顯示縮圖 */}
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                  {post.content?.blocks?.find((b: any) => b.type === 'image') ? (
                    <img 
                      src={post.content.blocks.find((b: any) => b.type === 'image').data.file.url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={post.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">No Image</div>
                  )}
                </div>
                {/* 顯示文字資訊 */}
                <div className="p-6">
                  <span className="text-[10px] tracking-[0.2em] text-primary font-bold uppercase mb-2 block">
                    {post.category || 'Travel'}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-secondary line-clamp-2 mb-4">
                    {post.title}
                  </h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-widest">
                    {post.createdAt?.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-neutral-300 italic font-serif">尚未有相關文章。</p>
        </div>
      )}
    </div>
  );
};

export default About;