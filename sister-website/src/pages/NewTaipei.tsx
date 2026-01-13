// src/pages/NewTaipei.tsx
import React, { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard/ArticleCard';

const NewTaipei: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  // 封裝讀取邏輯
  const loadData = () => {
    const savedData = localStorage.getItem('ig_posts');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // 統一使用小寫 key
      setPosts(parsedData.newTaipei || []);
    }
  };

  useEffect(() => {
    // 1. 初始載入
    loadData();

    // 2. 監聽視窗焦點回歸（當您從後台分頁切換回前台分頁時觸發）
    window.addEventListener('focus', loadData);
    
    // 3. 監聽同網域其他分頁的 Storage 變動
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-neutral-100 pb-8">
        <h1 className="text-4xl font-serif text-secondary italic">New Taipei</h1>
        <p className="text-sm text-neutral-400 mt-2 tracking-widest uppercase">新北美食探索</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {posts.map((post) => (
          <ArticleCard
            key={post.id} // 對應 JSON 的 id
            category="NEW TAIPEI"
            title={post.title} // 對應 JSON 的 title
            date={post.date}
            image={post.image} // 對應本地 static/images 的網址
          />
        ))}
      </div>
      
      {posts.length === 0 && (
        <p className="py-20 text-center text-neutral-300 italic">尚未更新新北文章</p>
      )}
    </div>
  );
};
export default NewTaipei;