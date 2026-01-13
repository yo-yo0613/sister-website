import { motion } from 'framer-motion';

// 定義傳入資料的類型
interface TopArticleProps {
  post?: any; // 接收來自 Home.tsx 的最新文章
}

const TopArticle: React.FC<TopArticleProps> = ({ post }) => {
  // 如果還在加載或沒有文章，顯示 Loading 樣式
  if (!post) {
    return (
      <section className="relative w-screen h-[85vh] bg-neutral-200 animate-pulse flex items-center justify-center">
        <span className="text-neutral-400 font-serif italic">Loading Story...</span>
      </section>
    );
  }

  // 從 Editor.js 的 blocks 中尋找第一張圖片
  const firstImage = post.content?.blocks?.find((b: any) => b.type === 'image')?.data?.file?.url;

  return (
    <section className="relative w-screen h-[85vh] overflow-hidden bg-neutral-900">
      {/* 背景圖緩慢縮放動畫 */}
      <motion.div 
        key={post.id} // 當文章切換時重新啟動動畫
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }} // 稍微降低透明度讓文字更清晰
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img 
          src={firstImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d"} 
          className="w-full h-full object-cover"
          alt={post.title}
        />
        {/* 加入漸層遮罩，確保白色文字在任何圖片上都清晰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </motion.div>

      {/* 文字內容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-white tracking-[0.5em] text-xs mb-6 block uppercase font-sans">
            {post.category || 'Featured'} / {new Date(post.createdAt?.toDate()).toLocaleDateString()}
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-serif italic leading-tight mb-8 max-w-4xl">
            {post.title}
          </h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="h-[1px] bg-white mx-auto"
          ></motion.div>
          
          {/* 加入一個「閱讀更多」的優雅按鈕 */}
          <motion.a
            href={`/post/${post.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10 inline-block text-white text-[10px] tracking-[0.4em] uppercase border border-white/30 px-8 py-3 hover:bg-white hover:text-black transition-all duration-500"
          >
            Read Story
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TopArticle;