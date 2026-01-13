import { useEffect, useState } from 'react';
import ArticleCard from './../ArticleCard/ArticleCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
// 💡 關鍵：引入 getDocs 進行廣告集合的條件抓取
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc, increment, getDocs } from 'firebase/firestore';

interface ContentSectionProps {
  category?: string | null;
}

const ContentSection: React.FC<ContentSectionProps> = ({ category }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [igImages, setIgImages] = useState<any[]>([]);
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    // A. 文章抓取邏輯 (維持不變，支援分類篩選)
    const constraints = [
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(8)
    ];

    if (category) {
      constraints.unshift(where("category", "==", category));
    }

    const q = query(collection(db, "posts"), ...constraints);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data.slice(1));
    });

    // B. 💡 修復後的廣告抓取邏輯：從 ads 集合抓取首頁專用廣告
    const fetchHomeAd = async () => {
      try {
        const adsQuery = query(
          collection(db, "ads"),
          where("position", "==", "index_middle"), // 💡 指定首頁精選位點
          where("isActive", "==", true),
          limit(1)
        );
        const querySnapshot = await getDocs(adsQuery);
        if (!querySnapshot.empty) {
          const adDoc = querySnapshot.docs[0];
          setAd({ id: adDoc.id, ...adDoc.data() });
        }
      } catch (error) {
        console.error("廣告載入失敗:", error);
      }
    };
    fetchHomeAd();

    // C. IG 資料 (維持不變)
    const savedIG = localStorage.getItem('ig_posts');
    if (savedIG) {
      try {
        const parsed = JSON.parse(savedIG);
        const allPosts = Object.values(parsed).flat();
        setIgImages(allPosts.slice(0, 6)); 
      } catch (e) { console.error(e); }
    }

    return () => unsubscribe();
  }, [category]);

  // 💡 紀錄廣告點擊次數 (修正路徑)
  const handleAdClick = async (adId: string) => {
    if (!adId) return;
    try {
      const adRef = doc(db, "ads", adId); // 💡 指向 ads 集合
      await updateDoc(adRef, {
        clicks: increment(1)
      });
    } catch (error) {
      console.error("紀錄點擊失敗:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const getImageUrl = (post: any) => {
    return post.content?.blocks?.find((b: any) => b.type === 'image')?.data?.file?.url || "";
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      {/* 1. 文章區域 */}
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
        {posts.slice(0, 3).map((post) => (
          <Link to={`/post/${post.id}`} key={post.id}>
            <ArticleCard category={post.category || "LIFESTYLE"} title={post.title} date={post.createdAt?.toDate().toLocaleDateString() || "Recently"} image={getImageUrl(post)} />
          </Link>
        ))}
      </motion.div>

      {/* 2. 💡 修正後的廣告區塊 UI */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="my-32 border-y border-neutral-100 py-16 text-center"
      >
        <p className="text-[10px] text-neutral-400 tracking-[0.4em] mb-10 uppercase font-bold">Featured Partner</p>
        
        {ad ? (
          <a 
            href={ad.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group block max-w-5xl mx-auto"
            onClick={() => handleAdClick(ad.id)}
          >
            <div className="flex flex-col md:flex-row items-center gap-12 px-6">
              {ad.imageUrl && (
                <div className="w-full md:w-3/5 overflow-hidden rounded-[2.5rem] shadow-xl">
                  <img src={ad.imageUrl} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-1000" alt="Ad" />
                </div>
              )}
              <div className="w-full md:w-2/5 text-left">
                <h3 className="text-3xl font-serif text-secondary mb-6 leading-tight group-hover:text-primary transition-colors">
                  {ad.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-8 leading-loose font-serif italic line-clamp-3">
                  {ad.description || "Discover premium lifestyles curated by Xun G Foodie."}
                </p>
                <span className="inline-block border-b-2 border-primary text-[11px] font-bold tracking-[0.3em] text-primary pb-2 uppercase transition-all group-hover:tracking-[0.5em]">
                  Explore More
                </span>
              </div>
            </div>
          </a>
        ) : (
          <div className="bg-neutral-50 h-40 w-full rounded-[2.5rem] flex items-center justify-center text-neutral-300 italic font-serif tracking-widest border border-dashed border-neutral-200">
            廣告招商中 ｜ Contact Us
          </div>
        )}
      </motion.div>

      {/* 3. Editorial Picks & 4. Social Block (保持原樣，僅微調間距) */}
      <section>
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex justify-between items-end border-b border-secondary/10 pb-6 mb-16">
          <h2 className="text-3xl font-serif text-secondary italic">Editorial Picks</h2>
          <button className="text-[10px] tracking-[0.4em] text-primary hover:text-secondary transition-colors uppercase font-bold">View All</button>
        </motion.div>
        
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.slice(3, 7).map((post) => (
            <Link to={`/post/${post.id}`} key={post.id}>
              <ArticleCard category={post.category || "LIFESTYLE"} title={post.title} date={post.createdAt?.toDate().toLocaleDateString() || "Recently"} image={getImageUrl(post)} />
            </Link>
          ))}
          {posts.length < 7 && Array.from({ length: 7 - posts.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-neutral-50 rounded-[2.5rem] h-80 flex items-center justify-center border-2 border-dashed border-neutral-100">
              <span className="text-[10px] text-neutral-200 tracking-[0.3em] uppercase font-bold">Coming Soon</span>
            </div>
          ))}
        </motion.div>
      </section>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mt-40 border-t border-neutral-100 pt-24 text-center">
        <div className="mb-16">
          <h2 className="text-4xl font-serif text-secondary mb-4 italic">Moments on Instagram</h2>
          <p className="text-primary text-[10px] tracking-[0.5em] uppercase font-bold">@XUN.G_FOODIE</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {igImages.map((ig, i) => (
            <motion.a key={i} href={`https://www.instagram.com/reels/${ig.id || ig.ID}/`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 0.98 }} className="aspect-[4/5] bg-neutral-100 cursor-pointer overflow-hidden relative group rounded-3xl">
              <img src={ig.image || ig.Image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="IG" />
              <div className="absolute inset-0 bg-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </main>
  );
};

export default ContentSection;