import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc, updateDoc, increment, collection, getDocs, query, where } from 'firebase/firestore';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AdComponent from '../components/AdComponent/AdComponent';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [ad, setAd] = useState<any>(null); // 內文廣告
  const [sidebarAd, setSidebarAd] = useState<any>(null); // 💡 新增：側欄廣告
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const postRef = doc(db, "posts", id);
        const docSnap = await getDoc(postRef);
        
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost(postData);
          
          if (postData.adActive) {
            // 1. 抓取內文廣告
            const middleAdsQuery = query(
              collection(db, "ads"), 
              where("position", "==", "post_middle"), 
              where("isActive", "==", true)
            );
            const middleAdsSnap = await getDocs(middleAdsQuery);
            if (!middleAdsSnap.empty) {
              setAd(middleAdsSnap.docs[0].data());
            }

            // 💡 2. 抓取側欄廣告 (抓取 position 為 sidebar 的廣告)
            const sidebarAdsQuery = query(
              collection(db, "ads"), 
              where("position", "==", "sidebar"), 
              where("isActive", "==", true)
            );
            const sidebarAdsSnap = await getDocs(sidebarAdsQuery);
            if (!sidebarAdsSnap.empty) {
              setSidebarAd({ id: sidebarAdsSnap.docs[0].id, ...sidebarAdsSnap.docs[0].data() });
            }
          }

          await updateDoc(postRef, { views: increment(1) });
        }
      } catch (error) {
        console.error("獲取資料出錯:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleAdClick = async (adId: string) => {
    if (!adId) return;
    try {
      await updateDoc(doc(db, "ads", adId), { clicks: increment(1) });
    } catch (error) {
      console.error("紀錄點擊失敗:", error);
    }
  };

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'header':
        const HeaderTag = `h${block.data.level || 2}` as React.ElementType;
        return (
          <HeaderTag key={block.id} className="font-serif text-secondary mt-16 mb-8 text-2xl md:text-3xl italic leading-tight">
            {block.data.text}
          </HeaderTag>
        );
      case 'paragraph':
        return (
          <p key={block.id} className="text-secondary/80 leading-[2] mb-10 text-lg font-sans tracking-wide" dangerouslySetInnerHTML={{ __html: block.data.text }} />
        );
      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : ('ul' as React.ElementType);
        return (
          <ListTag key={block.id} className={`list-inside space-y-5 mb-12 ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc underline-offset-8'}`}>
            {block.data.items.map((item: string, i: number) => (
              <li key={i} className="text-secondary/80 leading-relaxed pl-2" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ListTag>
        );
      case 'image':
        return (
          <figure key={block.id} className="my-20">
            <motion.div whileHover={{ scale: 0.99 }} className="overflow-hidden rounded-[2.5rem] shadow-2xl bg-neutral-50">
              <img src={block.data.file?.url} className="w-full object-cover" alt={block.data.caption || ""} />
            </motion.div>
            {block.data.caption && (
              <figcaption className="text-center text-[11px] text-neutral-400 mt-8 italic tracking-[0.3em] uppercase">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="pt-40 text-center font-serif italic text-neutral-400 animate-pulse">Synchronizing Story...</div>;
  if (!post) return <div className="pt-40 text-center text-secondary font-serif">無法取得文章內容。</div>;

  return (
    <HelmetProvider>
      <div className="bg-white min-h-screen">
        <Helmet>
          <title>{post.title} | 雞不擇食 XUN.G_FOODIE</title>
          <meta name="description" content={post.seoDescription || "探索二姊的私藏美食與生活提案"} />
          <meta name="keywords" content={post.seoKeywords} />
        </Helmet>

        <motion.div className="fixed top-24 left-0 right-0 h-1 bg-primary origin-left z-[70]" style={{ scaleX }} />

        {/* 💡 核心改動：改為 Grid 雙欄佈局 */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 1. 左側：文章主體 (佔 8 欄) */}
          <motion.article 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            className="lg:col-span-8"
          >
            <header className="mb-20 text-center lg:text-left">
              <span className="text-[10px] tracking-[0.6em] text-primary font-bold uppercase mb-8 block">
                {post.category || 'Lifestyle'}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary leading-[1.3] mb-12 italic">
                {post.title}
              </h1>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <p className="text-neutral-400 text-[10px] tracking-[0.4em] uppercase font-medium">
                  {post.createdAt ? `Published: ${post.createdAt.toDate().toLocaleDateString()}` : "Latest Release"}
                </p>
                <p className="text-[9px] text-primary tracking-[0.3em] font-bold bg-primary/5 px-4 py-1 rounded-full">
                  {post.views || 0} VIEWS
                </p>
              </div>
            </header>

            <div className="prose prose-stone max-w-none">
              {post.content?.blocks?.map((block: any, index: number) => (
                <React.Fragment key={block.id || index}>
                  {renderBlock(block)}
                  {/* 內文廣告邏輯 */}
                  {index === 2 && post.adActive && ad && (
                    <AdComponent ad={ad} handleAdClick={handleAdClick} />
                  )}
                </React.Fragment>
              ))} 
              {post.content?.blocks?.length <= 2 && post.adActive && ad && (
                <div className="mt-16 border-t border-neutral-50 pt-16">
                  <AdComponent ad={ad} handleAdClick={handleAdClick} />
                </div>
              )}
            </div>
          </motion.article>

          {/* 💡 2. 右側：側邊欄廣告 (佔 4 欄，僅桌面版顯示) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              {/* 側欄廣告容器 */}
              {sidebarAd && (
                <div className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 text-center shadow-sm">
                  <p className="text-[9px] text-neutral-400 tracking-[0.4em] mb-8 uppercase font-bold">Advertisement</p>
                  <AdComponent ad={sidebarAd} handleAdClick={() => handleAdClick(sidebarAd.id)} />
                </div>
              )}

              {/* 側欄額外資訊：例如關於作者 */}
              <div className="p-8 border-l border-neutral-100">
                <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-secondary mb-4 text-primary">About Xung Foodie</h4>
                <p className="text-sm text-neutral-400 font-serif italic leading-relaxed">
                  雞不擇食，致力於發現城市角落的精緻味蕾。
                </p>
              </div>
            </div>
          </aside>
        </div>

        <footer className="pt-20 border-t border-neutral-100 text-center pb-20">
          <p className="text-serif italic text-secondary/40 text-base mb-10">感謝妳的閱讀，希望這份提案能帶給妳靈感。</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] tracking-[0.6em] text-primary uppercase font-bold">Back to Top ↑</button>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default PostDetail;