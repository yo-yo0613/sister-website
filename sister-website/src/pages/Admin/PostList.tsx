import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

const PostList: React.FC = () => {
  const [firebasePosts, setFirebasePosts] = useState<any[]>([]);
  const [igPosts, setIgPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // 💡 搜尋狀態
  const [searchTerm, setSearchTerm] = useState('');

  const POSTS_PER_PAGE = 5;

  // 💡 核心過濾邏輯：同時過濾 FB 與 IG 內容
  const filteredPosts = useMemo(() => {
    const allPosts = [...firebasePosts, ...igPosts];
    if (!searchTerm.trim()) return allPosts;

    return allPosts.filter(post => 
      (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [firebasePosts, igPosts, searchTerm]);

  // 💡 讀取 IG 貼文 (保留妳原本的功能)
  const loadIGPosts = () => {
    const savedIGData = localStorage.getItem('ig_posts');
    if (savedIGData) {
      try {
        const parsedIG = JSON.parse(savedIGData);
        const formattedIG = Object.values(parsedIG).flat().map((p: any) => ({
          ...p,
          id: p.id || p.ID,
          title: p.title || p.Title || 'Instagram Post',
          image: p.image || p.Image,
          source: 'instagram',
          adActive: false,
          views: p.likes || 0,
          date: 'IG Content'
        }));
        setIgPosts(formattedIG);
      } catch (e) { console.error("IG資料解析失敗"); }
    }
  };

  // 💡 初始抓取 FB 文章
  const fetchInitialPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: 'firebase',
        date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently'
      }));
      setFirebasePosts(items);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
    } catch (error) { console.error("抓取文章失敗:", error); }
    setLoading(false);
  };

  // 💡 載入更多 FB 文章
  const handleLoadMore = async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextQ = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(POSTS_PER_PAGE));
      const snapshot = await getDocs(nextQ);
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: 'firebase',
        date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently'
      }));
      setFirebasePosts(prev => [...prev, ...newItems]);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) { console.error("載入更多失敗:", error); }
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchInitialPosts();
    loadIGPosts();
  }, []);

  // 💡 保留：同步 IG 功能
  const handleAutoUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('http://localhost:8000/api/crawl_and_sort/xun.g_foodie');
      const result = await response.json();
      if (result.status === 'success') {
        localStorage.setItem('ig_posts', JSON.stringify(result.data));
        alert('✨ 成功與 Instagram 同步最新動態！');
        loadIGPosts(); // 更新本地狀態
      }
    } catch (error) { alert('無法連接 Python 後端'); }
    finally { setIsUpdating(false); }
  };

  const toggleAd = async (postId: string, currentStatus: boolean, source: string) => {
    if (source !== 'firebase') return;
    try {
      await updateDoc(doc(db, "posts", postId), { adActive: !currentStatus });
      setFirebasePosts(prev => prev.map(p => p.id === postId ? { ...p, adActive: !currentStatus } : p));
    } catch (error) { alert("無法更新廣告狀態"); }
  };

  const handleDelete = async (postId: string, source: string) => {
    if (source === 'instagram' || !window.confirm("確定要永久刪除這篇文章嗎？")) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      setFirebasePosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) { alert("刪除失敗"); }
  };

  if (loading) return <div className="flex flex-col items-center justify-center h-64 font-serif text-neutral-400 italic animate-pulse">Synchronizing Data...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-serif text-secondary italic mb-2 tracking-tight">Content Library</h2>
          <p className="text-[10px] text-neutral-400 tracking-[0.3em] uppercase font-bold">搜尋並管理妳的美食與 IG 記憶</p>
        </div>

        {/* 💡 搜尋欄位 */}
        <div className="relative w-full md:w-80 group">
          <input 
            type="text"
            placeholder="搜尋標題或分類..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-5 pr-12 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300">🔍</div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={handleAutoUpdate} disabled={isUpdating} className="flex-1 px-6 py-3.5 rounded-full border border-neutral-200 text-secondary text-[10px] font-bold tracking-widest hover:bg-neutral-50 transition-all flex items-center justify-center gap-2">
            {isUpdating ? 'SYNCING...' : 'SYNC IG'}
          </button>
          <Link to="/admin/edit" className="flex-1 bg-secondary text-white px-8 py-3.5 rounded-full hover:bg-primary transition-all shadow-xl text-[10px] font-bold tracking-widest uppercase text-center">
            Create New
          </Link>
        </div>
      </header>

      <div className="space-y-6 mb-12">
        <AnimatePresence mode='popLayout'>
          {filteredPosts.map((post) => (
            <motion.div 
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-8 items-center group hover:shadow-2xl transition-all duration-700"
            >
              <div className="w-full md:w-56 h-40 md:h-36 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-neutral-50 shadow-inner">
                <img 
                  src={post.source === 'instagram' ? post.image : (post.content?.blocks.find((b:any) => b.type === 'image')?.data.file.url)} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  alt="" 
                />
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-3">
                  <span className={`text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${post.source === 'instagram' ? 'bg-pink-50 text-pink-500' : 'bg-primary/10 text-primary'}`}>
                    {post.source === 'instagram' ? 'Feed' : post.category}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">{post.date}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-secondary mb-5 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex gap-12">
                  <div className="flex flex-col text-center md:text-left">
                    <span className="text-neutral-400 text-[9px] uppercase tracking-widest mb-1 font-bold">人氣指數</span>
                    <span className="font-serif text-xl text-secondary">{post.views || 0} <span className="text-[10px] opacity-40 uppercase">Views</span></span>
                  </div>
                  <div className="flex flex-col border-l border-neutral-100 pl-10">
                    <span className="text-neutral-400 text-[9px] uppercase tracking-widest mb-1 font-bold">插頁廣告</span>
                    <div onClick={() => toggleAd(post.id, post.adActive, post.source)} className={`mt-1 w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner ${post.source === 'instagram' ? 'bg-neutral-100 cursor-not-allowed' : (post.adActive ? 'bg-green-400' : 'bg-neutral-200 cursor-pointer')}`}>
                      <motion.div animate={{ x: post.adActive ? 26 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col gap-4 w-full md:w-auto md:pr-6 md:border-l border-neutral-50 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
                {post.source === 'firebase' && (
                  <Link to={`/admin/edit/${post.id}`} className="flex-1 text-center text-[10px] tracking-widest font-bold text-neutral-300 hover:text-primary transition-colors uppercase">Edit</Link>
                )}
                <button onClick={() => handleDelete(post.id, post.source)} className="flex-1 text-center text-[10px] tracking-widest font-bold text-neutral-300 hover:text-red-400 transition-colors uppercase">Remove</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && !searchTerm && (
        <div className="flex justify-center mt-12">
          <button onClick={handleLoadMore} disabled={loadingMore} className="px-12 py-4 border border-neutral-200 rounded-full text-secondary text-[10px] font-bold tracking-[0.4em] uppercase hover:border-primary transition-all shadow-sm">
            {loadingMore ? 'Loading...' : 'Discover More Content'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;