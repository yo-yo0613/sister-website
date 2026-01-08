import { motion } from 'framer-motion';

const TopArticle = () => {
  return (
    <section className="relative w-screen h-[85vh] overflow-hidden bg-neutral-100">
      {/* 背景圖緩慢縮放動畫 */}
      <motion.div 
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" 
          className="w-full h-full object-cover opacity-90"
          alt="Featured"
        />
      </motion.div>

      {/* 文字內容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-white tracking-[0.5em] text-xs mb-6 block uppercase font-sans">
            Trending / Fashion
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-serif italic leading-tight mb-8">
            The Winter <br /> Minimalist
          </h1>
          <div className="w-16 h-[1px] bg-white mx-auto"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default TopArticle;