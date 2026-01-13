import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// 引入 Firebase
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const PostList: React.FC = () => {
  const [displayPosts, setDisplayPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // 定義一個讀取合併資料的函式
  const loadMergedPosts = (firebasePosts: any[]) => {
    const savedIGData = localStorage.getItem('ig_posts');
    let igPosts: any[] = [];
    if (savedIGData) {
      const parsedIG = JSON.parse(savedIGData);
      igPosts = Object.values(parsedIG).flat().map((p: any) => ({
        ...p,
        // 確保屬性對應正確
        id: p.id || p.ID,
        title: p.title || p.Title,
        image: p.image || p.Image,
        source: 'instagram',
        adActive: false
      }));
    }
    setDisplayPosts([...firebasePosts, ...igPosts]);
  };

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const firebaseArray: any[] = [];
      querySnapshot.forEach((doc) => {
        firebaseArray.push({ 
          id: doc.id, 
          ...doc.data(),
          source: 'firebase',
          date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently'
        });
      });
      loadMergedPosts(firebaseArray);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAutoUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('http://localhost:8000/api/crawl_and_sort/xun.g_foodie');
      const result = await response.json();
      
      if (result.status === 'success') {
        localStorage.setItem('ig_posts', JSON.stringify(result.data));
        alert('✨ 更新完成！');
        // 不需要全頁刷新，直接重新整理列表狀態
        window.location.reload(); 
      }
    } catch (error) {
      alert('連線失敗，請檢查 Python 後端');
    } finally {
      setIsUpdating(false);
    }
  };

  // 切換廣告狀態 (僅限 Firebase 文章)
  const toggleAd = async (postId: string, currentStatus: boolean, source: string) => {
    if (source !== 'firebase') {
      alert("自動抓取的貼文暫不支援直接修改雲端狀態");
      return;
    }
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { adActive: !currentStatus });
    } catch (error) {
      alert("更新廣告狀態失敗");
    }
  };

  // 刪除文章
  const handleDelete = async (postId: string, source: string) => {
    if (source === 'instagram') {
      alert("請至 LocalStorage 清除緩存，或在 Python 端重新抓取以更新列表");
      return;
    }
    if (window.confirm("確定要刪除這篇珍貴的文章嗎？")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
      } catch (error) {
        alert("刪除失敗");
      }
    }
  };

  if (loading) return <div className="p-20 text-center font-serif italic text-neutral-400">正在同步雲端文章庫...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-secondary italic">文章管理系統</h2>
          <p className="text-sm text-gray-400 mt-1">在這裡管理每一篇食記與時尚故事</p>
        </div>
        <div className="flex gap-3">
          {/* 自動更新按鈕 */}
          <button 
            onClick={handleAutoUpdate}
            disabled={isUpdating}
            className={`px-6 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-bold tracking-widest transition-all ${isUpdating ? 'opacity-50 cursor-wait' : 'hover:bg-primary hover:text-white'}`}
          >
            {isUpdating ? '同步中...' : '⟳ 自動更新 IG'}
          </button>
          
          <Link to="/admin/edit" className="bg-secondary text-white px-8 py-2.5 rounded-full hover:bg-primary transition-all shadow-lg text-sm font-bold tracking-widest">
            + 撰寫新文章
          </Link>
        </div>
      </header>

      {/* 文章列表 */}
      <div className="space-y-5">
        {displayPosts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex gap-6 items-center group hover:shadow-xl transition-all duration-500"
          >
            {/* 縮圖處理 */}
            <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100">
               {post.source === 'instagram' ? (
                 <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="ig-thumb" />
               ) : post.content?.blocks.find((b:any) => b.type === 'image') ? (
                 <img 
                   src={post.content.blocks.find((b:any) => b.type === 'image').data.file.url} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   alt="fb-thumb" 
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-300 tracking-[0.2em] uppercase font-bold">No Image</div>
               )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${post.source === 'instagram' ? 'bg-pink-50 text-pink-500' : 'bg-primary/10 text-primary'}`}>
                  {post.source === 'instagram' ? 'Instagram' : (post.category || 'Lifestyle')}
                </span>
                <span className="text-[10px] text-gray-400 tracking-widest uppercase font-medium">{post.date}</span>
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-secondary line-clamp-1 hover:text-primary transition-colors mb-4">
                {post.title}
              </h3>

              <div className="flex gap-10">
                <div className="flex flex-col">
                  <span className="text-neutral-400 text-[9px] uppercase tracking-widest mb-1">人氣指數</span>
                  <span className="font-bold text-secondary text-lg font-serif">{post.views || post.likes || 0}</span>
                </div>
                
                <div className="flex flex-col border-l border-neutral-100 pl-8">
                  <span className="text-neutral-400 text-[9px] uppercase tracking-widest mb-1">插頁廣告</span>
                  <div 
                    onClick={() => toggleAd(post.id, post.adActive, post.source)}
                    className={`mt-1 w-11 h-5 rounded-full relative cursor-pointer transition-all duration-500 ${post.adActive ? 'bg-primary' : 'bg-neutral-200'} ${post.source === 'instagram' && 'opacity-30'}`}
                  >
                    <motion.div 
                      animate={{ x: post.adActive ? 24 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pr-4">
              <Link 
                to={`/admin/edit/${post.id}`} // 💡 關鍵：帶上 ID
                className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 hover:text-primary uppercase text-center"
              >
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(post.id, post.source)}
                className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 hover:text-red-500 uppercase"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PostList;