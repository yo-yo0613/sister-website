import { useEffect, useState } from 'react';
import ArticleCard from './../ArticleCard/ArticleCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// 1. 引入 Firebase 必要工具
import { db } from '../../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const ContentSection = () => {
  // 存放 Firebase 文章
  const [posts, setPosts] = useState<any[]>([]);
  // 💡 新增：存放本機抓到的 IG 圖片
  const [igImages, setIgImages] = useState<any[]>([]);

  useEffect(() => {
    // A. 監聽 Firebase 資料 (維持不變)
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(8)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data.slice(1));
    });

    // B. 💡 關鍵：從本機 localStorage 抓取妳存好的 IG 資料
    const savedIG = localStorage.getItem('ig_posts');
    if (savedIG) {
      try {
        const parsed = JSON.parse(savedIG);
        // 合併所有分類 (taipei, taichung...) 並取前 6 張
        const allPosts = Object.values(parsed).flat();
        setIgImages(allPosts.slice(0, 6)); 
      } catch (e) {
        console.error("解析本機 IG 資料失敗", e);
      }
    }

    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const getImageUrl = (post: any) => {
    return post.content?.blocks?.find((b: any) => b.type === 'image')?.data?.file?.url || "";
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      {/* 1. 上方文章區域 (維持不變) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16"
      >
        {posts.slice(0, 3).map((post) => (
          <Link to={`/post/${post.id}`} key={post.id}>
            <ArticleCard 
              category={post.category?.toUpperCase() || "LIFESTYLE"} 
              title={post.title} 
              date={post.createdAt?.toDate().toLocaleDateString() || "Recently"} 
              image={getImageUrl(post)} 
            />
          </Link>
        ))}
      </motion.div>

      {/* 2. 廣告區域 (維持不變) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="my-24 border-y border-neutral-100 py-10 text-center"
      >
        <p className="text-[10px] text-neutral-400 tracking-[0.3em] mb-4">ADVERTISEMENT</p>
        <div className="bg-neutral-50 h-32 w-full flex items-center justify-center text-neutral-400 italic">
          二姊自定義廣告區
        </div>
      </motion.div>

      {/* 3. Editorial Picks (維持不變) */}
      <section>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-end border-b border-secondary/10 pb-4 mb-12"
        >
          <h2 className="text-2xl font-serif text-secondary italic">Editorial Picks</h2>
          <button className="text-[10px] tracking-widest text-primary hover:text-secondary transition-colors uppercase">View All</button>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {posts.slice(3, 7).map((post) => (
            <Link to={`/post/${post.id}`} key={post.id}>
              <ArticleCard 
                category={post.category?.toUpperCase() || "LIFESTYLE"} 
                title={post.title} 
                date={post.createdAt?.toDate().toLocaleDateString() || "Recently"} 
                image={getImageUrl(post)} 
              />
            </Link>
          ))}
          
          {posts.length < 7 && Array.from({ length: 7 - posts.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-neutral-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-neutral-100">
              <span className="text-[10px] text-neutral-300 tracking-widest uppercase">Coming Soon</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 4. 💡 修改：Social Media Block 改為顯示本機抓到的 IG 圖片 */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-32 border-t border-neutral-100 pt-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-secondary mb-2 italic">Follow us on IG</h2>
          <p className="text-primary text-sm tracking-widest uppercase">@XUN.G_FOODIE</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {igImages.length > 0 ? (
            igImages.map((ig, i) => (
              <motion.a 
                key={i}
                href={`https://www.instagram.com/reels/${ig.id || ig.ID}/`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 0.96 }}
                className="aspect-square bg-neutral-100 cursor-pointer overflow-hidden relative group" 
              >
                <img 
                  src={ig.image || ig.Image} 
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" 
                  alt="Instagram Post"
                />
                <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))
          ) : (
            // 如果沒資料，顯示美美的佔位符
            [1,2,3,4,5,6].map((i) => (
              <div key={i} className="aspect-square bg-neutral-50 animate-pulse" />
            ))
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default ContentSection;